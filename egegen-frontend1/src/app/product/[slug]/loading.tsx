export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      {/* Geri butonu */}
      <div className="mb-8 h-5 w-32 rounded skeleton animate-shimmer" />

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Resim alani */}
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-2xl skeleton animate-shimmer" />
          <div className="flex gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 w-20 rounded-xl skeleton animate-shimmer" />
            ))}
          </div>
        </div>

        {/* Detay alani */}
        <div className="space-y-6">
          <div className="h-5 w-24 rounded-full skeleton animate-shimmer" />
          <div className="h-10 w-3/4 rounded-lg skeleton animate-shimmer" />
          <div className="flex items-center gap-4">
            <div className="h-10 w-24 rounded-lg skeleton animate-shimmer" />
            <div className="h-7 w-20 rounded-full skeleton animate-shimmer" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded skeleton animate-shimmer" />
            <div className="h-4 w-5/6 rounded skeleton animate-shimmer" />
            <div className="h-4 w-3/4 rounded skeleton animate-shimmer" />
          </div>
          <hr className="border-teal-dark/8" />
          <div className="space-y-3">
            <div className="h-4 w-16 rounded skeleton animate-shimmer" />
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 w-20 rounded-xl skeleton animate-shimmer" />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 w-12 rounded skeleton animate-shimmer" />
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 w-20 rounded-xl skeleton animate-shimmer" />
              ))}
            </div>
          </div>
          <hr className="border-teal-dark/8" />
          <div className="flex gap-4">
            <div className="h-12 w-36 rounded-xl skeleton animate-shimmer" />
            <div className="h-12 flex-1 rounded-xl skeleton animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
