import { useState } from 'react';

export default function RefineBar({ onRefine, loading }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onRefine(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Refine: e.g., less sci-fi, more romance..."
          className="flex-1 px-4 py-2 border border-indigo-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-sm"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          {loading ? '⟳ Refining...' : 'Refine'}
        </button>
      </div>
    </form>
  );
}