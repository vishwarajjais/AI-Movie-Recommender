function MovieModal({ movie, onClose }) {
  if (!movie) return null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row"
      >
        {posterUrl && (
          <img src={posterUrl} alt={movie.title} className="w-full md:w-1/3 h-64 md:h-auto object-cover" />
        )}
        <div className="p-6 flex-1">
          <button
            onClick={onClose}
            className="float-right text-gray-500 hover:text-gray-800 text-xl"
          >
            ✕
          </button>
          <h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
          <p className="text-sm text-gray-500 mb-4">⭐ {movie.rating?.toFixed(1)}</p>
          <p className="text-gray-700 mb-4">{movie.overview}</p>
          {movie.reason && (
            <p className="text-purple-700 italic border-t pt-4">
              Why recommended: {movie.reason}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieModal;