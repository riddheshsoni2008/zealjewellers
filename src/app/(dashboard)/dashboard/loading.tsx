export default function DashboardLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header Skeleton */}
      <div className="border-b border-amber-200 dark:border-slate-800 pb-6 space-y-2">
        <div className="h-8 w-64 rounded-xl bg-amber-200/60 dark:bg-slate-800/60 animate-pulse" />
        <div className="h-4 w-96 max-w-full rounded-lg bg-amber-100/60 dark:bg-slate-800/40 animate-pulse" />
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-amber-200/70 dark:border-slate-800 bg-amber-50/50 dark:bg-slate-900/50 p-4 space-y-3 animate-pulse"
          >
            <div className="h-3.5 w-24 rounded bg-amber-200/80 dark:bg-slate-800" />
            <div className="h-7 w-32 rounded bg-amber-500/20" />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 h-80 rounded-2xl border border-amber-200/70 dark:border-slate-800 bg-amber-50/40 dark:bg-slate-900/40 p-6 space-y-4 animate-pulse">
          <div className="h-5 w-44 rounded bg-amber-200/80 dark:bg-slate-800" />
          <div className="space-y-3 pt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 rounded-xl bg-amber-100/50 dark:bg-slate-800/40" />
            ))}
          </div>
        </div>
        <div className="h-80 rounded-2xl border border-amber-200/70 dark:border-slate-800 bg-amber-50/40 dark:bg-slate-900/40 p-6 space-y-4 animate-pulse">
          <div className="h-5 w-36 rounded bg-amber-200/80 dark:bg-slate-800" />
          <div className="space-y-3 pt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-amber-100/50 dark:bg-slate-800/40" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
