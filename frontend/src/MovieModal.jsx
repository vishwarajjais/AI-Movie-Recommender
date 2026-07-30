export default function MovieModal({ movie, onClose }) {
  if (!movie) return null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col sm:flex-row"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 transition-colors p-1 rounded-full hover:bg-slate-100"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Poster */}
        <div className="sm:w-64 flex-shrink-0">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover rounded-lg sm:rounded-l-lg sm:rounded-r-none"
              style={{ aspectRatio: '2/3' }}
            />
          ) : (
            <div
              className="w-full bg-slate-200 flex items-center justify-center text-slate-400 rounded-lg sm:rounded-l-lg sm:rounded-r-none"
              style={{ aspectRatio: '2/3' }}
            >
              <span>No image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 pr-8">
            {movie.title}
          </h2>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-lg font-medium text-amber-600">★</span>
            <span className="text-lg font-semibold text-slate-700">{movie.rating?.toFixed(1)}</span>
            <span className="text-sm text-slate-500">/ 10</span>
          </div>

          {/* Overview */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Overview
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">{movie.overview}</p>
          </div>

          {/* Recommendation Reason */}
          {movie.reason && (
            <div className="mt-auto pt-4 border-t border-slate-200">
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                Why Recommended
              </h3>
              <p className="text-sm italic text-indigo-700 font-medium">{movie.reason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}