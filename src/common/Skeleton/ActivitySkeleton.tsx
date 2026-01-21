export default function ActivitySkeleton() {
  return (
    <div className="py-3 border-b border-gray-100 last:border-0 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-4/5 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-24"></div>
    </div>
  );
}
