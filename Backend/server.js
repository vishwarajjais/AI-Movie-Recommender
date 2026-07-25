const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


app.get('/api/ping', (req, res) => {
  res.json({ ok: true, message: 'Server is alive' });
});

const movieRoutes = require('./routes/movies');
app.use('/api/movies', movieRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});