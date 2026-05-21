export default function SummaryTab({ data }) {
  const points = data?.points || [];

  if (points.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-neutral-400 font-body">No summary data available.</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 rounded-xl bg-neutral-100 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10,9 9,9 8,9" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-display text-text-primary">Summary</h3>
          <p className="text-xs text-neutral-400 font-body">{points.length} key points</p>
        </div>
      </div>

      <ul className="space-y-4">
        {points.map((point, idx) => (
          <li
            key={point}
            className="flex gap-3 items-start group"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <span className="mt-1.5 size-2 rounded-full bg-gray-950 flex-shrink-0 group-hover:scale-125 transition-transform" />
            <p className="text-text-secondary font-body text-sm leading-relaxed group-hover:text-text-primary transition-colors">
              {point}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
