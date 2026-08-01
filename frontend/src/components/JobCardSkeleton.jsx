export default function JobCardSkeleton() {
  return (
    <div className="card flex flex-col gap-4 p-5" aria-hidden="true">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-ink-700/10" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-3/4 animate-pulse rounded bg-ink-700/10" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-ink-700/10" />
        </div>
      </div>
      <div className="flex gap-3">
        <div className="h-3 w-16 animate-pulse rounded bg-ink-700/10" />
        <div className="h-3 w-20 animate-pulse rounded bg-ink-700/10" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-5 w-14 animate-pulse rounded-full bg-ink-700/10" />
        <div className="h-5 w-14 animate-pulse rounded-full bg-ink-700/10" />
      </div>
    </div>
  );
}
