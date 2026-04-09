export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <div className="h-8 w-40 rounded-lg skeleton animate-shimmer" />
          <div className="hidden md:flex gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-16 rounded skeleton animate-shimmer" />
            ))}
          </div>
          <div className="h-10 w-28 rounded-full skeleton animate-shimmer" />
        </div>

        {/* Hero */}
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="h-6 w-48 rounded-full skeleton animate-shimmer" />
            <div className="space-y-3">
              <div className="h-12 w-3/4 rounded-lg skeleton animate-shimmer" />
              <div className="h-12 w-1/2 rounded-lg skeleton animate-shimmer" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full rounded skeleton animate-shimmer" />
              <div className="h-4 w-5/6 rounded skeleton animate-shimmer" />
              <div className="h-4 w-4/6 rounded skeleton animate-shimmer" />
            </div>
            <div className="flex gap-4">
              <div className="h-12 w-32 rounded-full skeleton animate-shimmer" />
              <div className="h-12 w-32 rounded-full skeleton animate-shimmer" />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="h-[400px] w-[400px] rounded-3xl skeleton animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
