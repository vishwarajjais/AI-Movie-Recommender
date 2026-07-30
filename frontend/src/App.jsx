import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import RefineBar from './RefineBar';
import MovieCard from './MovieCard';
import MovieModal from './MovieModal';
import Hero from './Hero';
import MovieRow from './MovieRow';

export default function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [minRating, setMinRating] = useState('');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteMovies');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [discoverMovies, setDiscoverMovies] = useState([]);
  const [discoverLoading, setDiscoverLoading] = useState(true);

  // Fetch genres on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/movies/genres`);
        const data = await response.json();
        setGenres(data);
      } catch (err) {
        console.error('Failed to fetch genres:', err);
      }
    };
    fetchGenres();
  }, []);

  // Fetch discover movies on mount for browse section
  useEffect(() => {
    const fetchDiscoverMovies = async () => {
      try {
        setDiscoverLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/movies/discover`);
        const data = await response.json();
        setDiscoverMovies(data || []);
      } catch (err) {
        console.error('Failed to fetch discover movies:', err);
        setDiscoverMovies([]);
      } finally {
        setDiscoverLoading(false);
      }
    };
    fetchDiscoverMovies();
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favoriteMovies', JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = async (preference) => {
    setSearchQuery(preference);
    setShowFavorites(false);
    setLoading(true);
    setError(null);

    try {
      const body = {
        userPreference: preference,
        ...(selectedGenre && { genre: selectedGenre }),
        ...(minRating && { minRating: minRating }),
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to fetch recommendations');
      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError(err.message || 'An error occurred');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async (refinement) => {
    const combinedPreference = `${searchQuery}, ${refinement}`;
    await handleSearch(combinedPreference);
  };

  const toggleFavorite = (movieId) => {
    setFavorites((prev) =>
      prev.includes(movieId) ? prev.filter((id) => id !== movieId) : [...prev, movieId]
    );
  };

  const favoriteMovies = recommendations.filter((movie) => favorites.includes(movie.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900">AI Movie Recommender</h1>
          <p className="text-sm text-slate-600 mt-1">Discover movies tailored to your mood</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!showFavorites ? (
          <>
            {/* Browse Section - Hero + Rows */}
            {discoverMovies.length > 0 && (
              <div className="mb-12">
                <Hero movie={discoverMovies[0]} />
                
                <MovieRow
                  title="Popular Right Now"
                  movies={discoverMovies.slice(0, 10)}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onSelectMovie={setSelectedMovie}
                />
                
                <MovieRow
                  title="Highly Rated"
                  movies={discoverMovies.slice(10, 20)}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onSelectMovie={setSelectedMovie}
                />
                
                <MovieRow
                  title="Trending Now"
                  movies={discoverMovies.slice(20, 30)}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onSelectMovie={setSelectedMovie}
                />
              </div>
            )}

            {/* Divider */}
            {discoverMovies.length > 0 && (
              <div className="my-12 border-t border-slate-200" />
            )}

            {/* AI Search Section Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Find With AI</h2>
              <p className="text-sm text-slate-600 mt-1">
                Describe what you're in the mood for and get personalized recommendations
              </p>
            </div>

            {/* Filters */}
            <div className="mb-8">
              <FilterBar
                genres={genres}
                selectedGenre={selectedGenre}
                onGenreChange={setSelectedGenre}
                minRating={minRating}
                onRatingChange={setMinRating}
              />
            </div>

            {/* Search */}
            <div className="mb-8">
              <SearchBar onSearch={handleSearch} loading={loading} />
            </div>

            {/* Refine + View Favorites Button */}
            {recommendations.length > 0 && (
              <div className="mb-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl font-semibold text-slate-900">Recommendations</h2>
                  {favorites.length > 0 && (
                    <button
                      onClick={() => setShowFavorites(true)}
                      className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      ♥ View Favorites ({favorites.length})
                    </button>
                  )}
                </div>
                <RefineBar onRefine={handleRefine} loading={loading} />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-8">
                <p className="text-red-700 font-medium text-sm">
                  Error: {error}
                </p>
              </div>
            )}

            {/* Loading Skeleton */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {Array(10)
                  .fill(null)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="rounded-lg overflow-hidden bg-slate-200 animate-pulse"
                      style={{ aspectRatio: '2/3' }}
                    />
                  ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && recommendations.length === 0 && !error && (
              <div className="text-center py-16">
                <p className="text-slate-500 text-base">Search for a movie vibe to get started</p>
              </div>
            )}

            {/* Results Grid */}
            {!loading && recommendations.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {recommendations.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isFavorite={favorites.includes(movie.id)}
                    onToggleFavorite={toggleFavorite}
                    onSelect={setSelectedMovie}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Favorites View Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-900">Favorite Movies</h2>
              <button
                onClick={() => setShowFavorites(false)}
                className="px-4 py-2 bg-slate-200 text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-300 transition-colors"
              >
                ← Back to Search
              </button>
            </div>

            {/* Favorites Empty State */}
            {favoriteMovies.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate-500 text-base">No favorite movies yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {favoriteMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isFavorite={favorites.includes(movie.id)}
                    onToggleFavorite={toggleFavorite}
                    onSelect={setSelectedMovie}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Movie Detail Modal */}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
    </div>
  );
}