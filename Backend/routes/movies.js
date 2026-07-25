const express = require('express');
const axios = require('axios');
const router = express.Router();

const TMDB_BASE = 'https://api.themoviedb.org/3';

// Search movies by text query
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(`${TMDB_BASE}/search/movie`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query,
      },
    });
    res.json(response.data.results);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// Discover movies by genre/rating (for candidate pool later)
router.get('/discover', async (req, res) => {
  try {
    const { genre, minRating } = req.query;
    const response = await axios.get(`${TMDB_BASE}/discover/movie`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        with_genres: genre,
        'vote_average.gte': minRating,
        sort_by: 'popularity.desc',
      },
    });
    res.json(response.data.results);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

module.exports = router;