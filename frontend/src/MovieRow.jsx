import { useState } from 'react';

export default function MovieRow({
  title,
  movies,
  favorites,
  onToggleFavorite,
  onSelectMovie,
}) {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (e) => {
    setScrollPosition(e.target.scrollLeft);
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="mb-10">
      {/* Row Title */}
      <h2 className="text-xl font-semibold text-slate-900 mb-4">{title}</h2>

      {/* Horizontal Scrollable Container */}
      <div
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
        style={{
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        onScroll={handleScroll}
      >
        {/* Hide scrollbar for all browsers */}
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {movies.map((movie) => (
          <div
            key={movie.id}
            className="flex-shrink-0 group relative cursor-pointer"
            style={{ width: '120px' }}
            onClick={() => onSelectMovie(movie)}
          >
            {/* Poster Card */}
            <div className="relative rounded-lg overflow-hidden bg-slate-200 shadow-sm hover:shadow-md transition-all">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  style={{ aspectRatio: '2/3' }}
                />
              ) : (
                <div
                  className="w-full bg-slate-300 flex items-center justify-center text-slate-500 text-xs text-center p-2"
                  style={{ aspectRatio: '2/3' }}
                >
                  No image
                </div>
              )}

              {/* Favorite Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(movie.id);
                }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={favorites.includes(movie.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg
                  className={`w-4 h-4 transition-colors ${
                    favorites.includes(movie.id)
                      ? 'fill-red-500'
                      : 'fill-none stroke-slate-400 stroke-2'
                  }`}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>

              {/* Title on Hover (optional, minimal design) */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-end p-2">
                <p className="text-white text-xs font-semibold line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {movie.title}
                </p>
              </div>
            </div>

            {/* Rating Badge (below card) */}
            {movie.vote_average && (
              <div className="mt-2 flex items-center gap-1 text-xs">
                <span className="text-amber-600 font-medium">★</span>
                <span className="text-slate-700 font-medium">{movie.vote_average.toFixed(1)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
