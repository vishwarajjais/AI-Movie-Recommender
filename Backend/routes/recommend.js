const express = require('express');
const axios = require('axios');
const router = express.Router();

const TMDB_BASE = 'https://api.themoviedb.org/3';
const GROQ_BASE = 'https://api.groq.com/openai/v1/chat/completions';

router.post('/', async (req, res) => {
  try {
    const { userPreference } = req.body;

    if (!userPreference) {
      return res.status(400).json({ error: 'userPreference is required' });
    }

    // Step A: candidate pool from TMDB
    const candidateResponse = await axios.get(`${TMDB_BASE}/movie/popular`, {
      params: { api_key: process.env.TMDB_API_KEY },
    });

    const candidates = candidateResponse.data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      rating: movie.vote_average,
      poster_path: movie.poster_path,
    }));

    // Step B: prompt + Groq call
    const prompt = `
You are a movie recommendation assistant. A user has this preference:
"${userPreference}"

Here is a list of real movies (JSON):
${JSON.stringify(candidates.map(c => ({ 
  title: c.title, 
  overview: c.overview.slice(0, 100), 
  rating: c.rating 
})))}

Pick the best 5 movies from this list that match the user's preference.
Respond with ONLY valid JSON, no markdown, no extra text, in exactly this format:
[
  { "title": "Movie Title", "reason": "one sentence explaining why this fits" }
]
`;

    const groqResponse = await axios.post(
      GROQ_BASE,
      {
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LLM_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const rawText = groqResponse.data.choices[0].message.content;

    // Step C: parse LLM response safely
    let llmPicks;
    try {
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      llmPicks = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('Failed to parse LLM response:', rawText);
      return res.status(500).json({ error: 'LLM returned unparseable response' });
    }

    // Step C continued: merge LLM picks with full candidate data
    const finalResults = llmPicks
      .map(pick => {
        const match = candidates.find(
          c => c.title.toLowerCase() === pick.title.toLowerCase()
        );
        if (!match) return null; // skip if LLM picked something not in our pool
        return {
          ...match,
          reason: pick.reason,
        };
      })
      .filter(Boolean); // remove any nulls

    res.json({ userPreference, recommendations: finalResults });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

module.exports = router;