export default function Loading() {
  return (
    <div className="grid min-h-[70vh] place-items-center bg-sand" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-lake/20 border-t-lake" />
        <span className="text-sm text-stone-400">Loading…</span>
      </div>
    </div>
  );
}
