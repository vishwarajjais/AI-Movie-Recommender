import { useState } from 'react';
import SearchBar from './SearchBar';
import MovieCard from './MovieCard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavorites, setShowFavorites] = useState(false);

  const handleSearch = async (userPreference) => {
    setLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPreference }),
      });

      if (!response.ok) throw new Error('Failed to fetch recommendations');

      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const exists = prev.find((m) => m.id === movie.id);
      const updated = exists
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie];
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold text-blue-600 text-center mb-4">
        AI Movie Recommender
      </h1>

      <div className="text-center mb-6">
        <button
          onClick={() => setShowFavorites((prev) => !prev)}
          className="text-blue-600 underline"
        >
          {showFavorites ? 'Back to search' : `View Favorites (${favorites.length})`}
        </button>
      </div>

      {!showFavorites && <SearchBar onSearch={handleSearch} loading={loading} />}

      {error && (
        <p className="text-red-500 text-center mb-4">{error}</p>
      )}

      {showFavorites ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {favorites.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">No favorites yet.</p>
          ) : (
            favorites.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
              />
            ))
          )}
        </div>
      ) : (
        <>
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-96 animate-pulse"></div>
              ))}
            </div>
          )}

          {!loading && recommendations.length === 0 && !error && (
            <p className="text-center text-gray-500 mt-10">
              Enter a preference above to get recommendations.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {recommendations.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorite={favorites.some((m) => m.id === movie.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;