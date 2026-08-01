export default function Spinner({ size = 28 }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="inline-block animate-spin rounded-full border-[3px] border-ink-700/15 border-t-ink-700"
      style={{ width: size, height: size }}
    />
  );
}
