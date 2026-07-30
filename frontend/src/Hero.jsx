export default function Hero({ movie }) {
  if (!movie) return null;

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const truncatedOverview = movie.overview
    ? movie.overview.length > 200
      ? `${movie.overview.substring(0, 200)}...`
      : movie.overview
    : 'No description available';

  return (
    <div className="relative w-full mb-12 overflow-hidden rounded-lg shadow-lg">
      {/* Backdrop Image */}
      {backdropUrl ? (
        <img
          src={backdropUrl}
          alt={movie.title}
          className="w-full h-80 sm:h-96 md:h-[28rem] lg:h-96 object-cover"
        />
      ) : (
        <div className="w-full h-80 sm:h-96 md:h-[28rem] lg:h-96 bg-slate-800" />
      )}

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
            {movie.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-6">
            {truncatedOverview}
          </p>
          {movie.vote_average && (
            <div className="flex items-center gap-3">
              <span className="text-amber-400 text-lg font-medium">★</span>
              <span className="text-white font-semibold">{movie.vote_average.toFixed(1)}</span>
              <span className="text-slate-300 text-sm">/ 10</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
