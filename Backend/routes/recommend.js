const express = require('express');
const axios = require('axios');
const router = express.Router();

const TMDB_BASE = 'https://api.themoviedb.org/3';

router.post('/', async (req, res) => {
  try {
    const { userPreference } = req.body;

    if (!userPreference) {
      return res.status(400).json({ error: 'userPreference is required' });
    }

    // Step A: get a candidate pool from TMDB (popular movies for now)
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

    // Temporary: just return the candidates to confirm this part works
    res.json({ userPreference, candidates });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

module.exports = router;