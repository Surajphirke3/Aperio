export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <div className="w-7 h-7 rounded-full bg-[var(--accent-muted)] flex items-center justify-center text-[var(--accent-primary)] text-xs font-mono shrink-0">
        AI
      </div>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-[var(--accent-primary)]"
            style={{ animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}