import { Skeleton } from '@/components/ui/skeleton';

const LoadingBlock = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, index) => (
        <div className="flex flex-col space-y-3" key={index}>
          <Skeleton className="h-48 w-full rounded-t-lg" />
          <div className="space-y-2 flex flex-col">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 2/3" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="p-4">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingBlock;
