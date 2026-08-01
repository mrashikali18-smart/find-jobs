const STAGES = ['applied', 'reviewed', 'shortlisted', 'hired'];

const STAGE_LABELS = {
  applied: 'Applied',
  reviewed: 'Reviewed',
  shortlisted: 'Shortlisted',
  hired: 'Hired',
  rejected: 'Not selected',
};

/**
 * Renders the four hiring stages as connected nodes around an arc — the
 * recurring "loop" motif used across the dashboard and application tracker.
 */
export default function LoopRing({ status = 'applied', size = 'md' }) {
  const isRejected = status === 'rejected';
  const activeIndex = isRejected ? -1 : STAGES.indexOf(status);
  const dims = size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5';

  return (
    <div className="flex items-center gap-1.5">
      {STAGES.map((stage, i) => {
        const reached = !isRejected && i <= activeIndex;
        const isLast = i === STAGES.length - 1;
        return (
          <div key={stage} className="flex items-center">
            <span
              className={`rounded-full ${dims} ${
                reached ? 'bg-amber-400' : 'bg-ink-700/15'
              }`}
              title={STAGE_LABELS[stage]}
            />
            {!isLast && (
              <span
                className={`h-[2px] w-4 sm:w-6 ${
                  reached && i < activeIndex ? 'bg-amber-400' : 'bg-ink-700/15'
                }`}
              />
            )}
          </div>
        );
      })}
      <span
        className={`ml-2 badge ${
          isRejected
            ? 'bg-red-50 text-red-600'
            : status === 'hired'
            ? 'bg-emerald-50 text-emerald-700'
            : 'bg-ink-50 text-ink-700'
        }`}
      >
        {STAGE_LABELS[status] || status}
      </span>
    </div>
  );
}
