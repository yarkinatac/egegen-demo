export default function AdminLoading() {
  return (
    <div className="p-8">
      <div className="animate-pulse space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-zinc-800 rounded w-48" />
          <div className="h-10 bg-zinc-800 rounded w-32" />
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="h-4 bg-zinc-800 rounded w-full" />
          <div className="h-4 bg-zinc-800 rounded w-3/4" />
          <div className="h-4 bg-zinc-800 rounded w-1/2" />
          <div className="h-4 bg-zinc-800 rounded w-5/6" />
          <div className="h-4 bg-zinc-800 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}
