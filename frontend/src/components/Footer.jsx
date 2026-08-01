export default function Footer() {
  return (
    <footer className="border-t border-ink-700/10 bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-display text-lg text-ink-800">Find Jobs 🔎</p>
          <p className="text-sm text-ink-700/60">
            &copy; {new Date().getFullYear()} Find Jobs 🔎. A portfolio project — not a real hiring platform.
          </p>
        </div>
      </div>
    </footer>
  );
}
