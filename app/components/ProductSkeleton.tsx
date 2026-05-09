export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 bg-slate-200"></div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-2">
            {/* Title Skeleton */}
            <div className="h-6 w-32 bg-slate-200 rounded-lg"></div>
            {/* Category Skeleton */}
            <div className="h-4 w-20 bg-slate-200 rounded-md"></div>
          </div>
          <div className="text-right space-y-2">
            {/* Price Skeleton */}
            <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
            <div className="h-3 w-12 bg-slate-200 rounded-md ml-auto"></div>
          </div>
        </div>

        {/* Details Skeleton */}
        <div className="bg-slate-50 rounded-2xl p-4 my-6 space-y-4">
          <div className="flex justify-between">
            <div className="h-4 w-16 bg-slate-200 rounded-md"></div>
            <div className="h-4 w-24 bg-slate-200 rounded-md"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-16 bg-slate-200 rounded-md"></div>
            <div className="h-4 w-20 bg-slate-200 rounded-md"></div>
          </div>
        </div>

        {/* Button Skeleton */}
        <div className="w-full h-12 bg-slate-200 rounded-2xl"></div>
      </div>
    </div>
  );
}
