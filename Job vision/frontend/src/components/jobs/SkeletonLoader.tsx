export const SkeletonLoader = () => {
  return (
    <div className="bg-white rounded-lg shadow-soft p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-6 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="flex gap-2 mt-4">
          <div className="h-10 bg-gray-200 rounded w-32"></div>
          <div className="h-10 bg-gray-200 rounded w-28"></div>
        </div>
      </div>
    </div>
  );
};
