function MovieCard({ movie, isFavorite, onToggleFavorite, onClick }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <div
      onClick={() => onClick(movie)}
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col relative cursor-pointer hover:shadow-lg transition-shadow"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(movie);
        }}
        className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow z-10"
      >
        {isFavorite ? '❤️' : '🤍'}
      </button>

      {posterUrl ? (
        <img src={posterUrl} alt={movie.title} className="w-full h-80 object-cover" />
      ) : (
        <div className="w-full h-80 bg-gray-200 flex items-center justify-center text-gray-500">
          No image
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-lg">{movie.title}</h3>
        <p className="text-sm text-gray-500 mb-2">⭐ {movie.rating?.toFixed(1)}</p>
        <p className="text-sm text-gray-700 italic">{movie.reason}</p>
      </div>
    </div>
  );
}

export default MovieCard;