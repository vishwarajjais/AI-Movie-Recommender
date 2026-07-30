export default function MovieCard({ movie, isFavorite, onToggleFavorite, onSelect }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const handleCardClick = () => {
    onSelect(movie);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(movie.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
    >
      {/* Poster Image */}
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full object-cover transition-transform group-hover:scale-105"
          style={{ aspectRatio: '2/3' }}
        />
      ) : (
        <div
          className="w-full bg-slate-200 flex items-center justify-center text-slate-400"
          style={{ aspectRatio: '2/3' }}
        >
          <span className="text-sm">No image</span>
        </div>
      )}

      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform z-10"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <svg
          className={`w-5 h-5 transition-colors ${
            isFavorite ? 'fill-red-500' : 'fill-none stroke-slate-400 stroke-2'
          }`}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between bg-white">
        <div>
          <h3 className="font-semibold text-sm text-slate-900 line-clamp-2 leading-tight">
            {movie.title}
          </h3>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-xs font-medium text-amber-600">★</span>
            <span className="text-sm text-slate-600 font-medium">{movie.rating?.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-xs text-slate-600 italic line-clamp-2 mt-2">{movie.reason}</p>
      </div>
    </div>
  );
}