export default function SalesLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Skeleton */}
      <div className="border-b border-amber-200 dark:border-slate-800 pb-6 space-y-2">
        <div className="h-8 w-64 rounded-xl bg-amber-200/60 dark:bg-slate-800/60 animate-pulse" />
        <div className="h-4 w-96 max-w-full rounded-lg bg-amber-100/60 dark:bg-slate-800/40 animate-pulse" />
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-amber-200/70 dark:border-slate-800 bg-amber-50/50 dark:bg-slate-900/50 p-4 space-y-3 animate-pulse"
          >
            <div className="h-4 w-32 rounded bg-amber-200/80 dark:bg-slate-800" />
            <div className="h-8 w-44 rounded bg-amber-500/20" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-amber-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 space-y-4 animate-pulse">
        <div className="flex items-center justify-between pb-4 border-b border-amber-100 dark:border-slate-800">
          <div className="h-9 w-64 rounded-xl bg-amber-100/60 dark:bg-slate-800/60" />
          <div className="h-9 w-32 rounded-xl bg-amber-200/70 dark:bg-slate-700/60" />
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 rounded-xl bg-amber-100/40 dark:bg-slate-800/40" />
          ))}
        </div>
      </div>
    </div>
  );
}
