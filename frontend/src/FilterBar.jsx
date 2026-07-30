export default function FilterBar({
  genres,
  selectedGenre,
  onGenreChange,
  minRating,
  onRatingChange,
}) {
  const ratingOptions = [
    { value: '', label: 'Any Rating' },
    { value: '6', label: '6+' },
    { value: '7', label: '7+' },
    { value: '8', label: '8+' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Genre Filter */}
      <div className="flex-1">
        <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
          Genre
        </label>
        <select
          value={selectedGenre}
          onChange={(e) => onGenreChange(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm appearance-none cursor-pointer"
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      {/* Rating Filter */}
      <div className="flex-1">
        <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
          Minimum Rating
        </label>
        <select
          value={minRating}
          onChange={(e) => onRatingChange(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm appearance-none cursor-pointer"
        >
          {ratingOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
