export const SkeletonCard = ({ count = 4 }) => {
  const cols = Math.max(1, Math.min(4, count));
  const mdGridClass =
    cols === 1
      ? 'md:grid-cols-1'
      : cols === 2
      ? 'md:grid-cols-2'
      : cols === 3
      ? 'md:grid-cols-3'
      : 'md:grid-cols-4';

  const gridClass = ['grid', 'gap-4', 'items-center', 'grid-cols-1', mdGridClass].join(' ');

  return (
    <div className="shadow-sm p-8 w-[90%] mx-auto my-4">
      <div className={gridClass}>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`border rounded-lg p-3 animate-pulse space-y-3 h-[50vh] ${
              index > 0 ? 'hidden sm:block' : ''
            }`}>
            <div className="h-5 w-28 bg-gray-200 rounded" />
            <div className="h-[50%] w-full bg-gray-200 rounded" />
            <div className="h-5 w-40 bg-gray-200 rounded" />
            <div className="h-5 w-12 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const FaqSkeleton = () => {
  return (
    <div className="grid grid-cols-5 grid-rows-5 gap-3 animate-pulse">
      <div className="col-span-2 bg-gray-200 rounded-xl row-span-5 mr-3" />
      <div className="col-span-3 bg-gray-200 rounded-xl h-14 col-start-3" />
      <div className="col-span-3 bg-gray-200 rounded-xl h-14 col-start-3 row-start-2" />
      <div className="col-span-3 bg-gray-200 rounded-xl h-14 col-start-3 row-start-3" />
      <div className="col-span-3 bg-gray-200 rounded-xl h-14 col-start-3 row-start-4" />
      <div className="col-span-3 bg-gray-200 rounded-xl h-14 col-start-3 row-start-5" />
    </div>
  );
};

export const RangerSkeleton = () => {
  return (
    <>
      <div className={'grid gap-4 items-center grid-cols-1 md:grid-cols-6'}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className={`border rounded-lg p-3 animate-pulse space-y-3 h-[30vh] ${
              index > 0 ? 'hidden sm:block' : ''
            }`}>
            <div className="h-5 w-28 bg-gray-200 rounded" />
            <div className="h-[50%] w-full bg-gray-200 rounded" />
            <div className="h-5 w-40 bg-gray-200 rounded" />
            <div className="h-5 w-12 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-16 bg-gray-200 rounded-md"></div>
      {Array(rows)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="h-10 bg-gray-200 rounded-md"></div>
        ))}
    </div>
  );
};

export const DetailEventSkeleton = () => {
  return (
    <div className="grid grid-cols-5 grid-rows-5 gap-4 animate-pulse">
      <div className="col-span-2 bg-gray-200 rounded-xl h-12" />
      <div className="col-span-3 bg-gray-200 rounded-xl row-span-6 row-start-2" />
      <div className="col-span-2 bg-gray-200 rounded-xl h-20 col-start-4 row-start-2" />
      <div className="col-span-2 bg-gray-200 rounded-xl h-20 col-start-4 row-start-3" />
      <div className="col-span-2 bg-gray-200 rounded-xl h-20 col-start-4 row-start-4" />
      <div className="col-span-2 bg-gray-200 rounded-xl h-20 col-start-4 row-start-5" />
      <div className="col-span-2 bg-gray-200 rounded-xl h-20 col-start-4 row-start-6" />
      <div className="col-span-2 bg-gray-200 rounded-xl h-20 col-start-4 row-start-7" />
      <div className="col-span-5 bg-gray-200 rounded-xl h-32 row-start-8" />
    </div>
  );
};

export const ProfileSkeleton = () => {
  return (
    <div className="grid grid-cols-5 grid-rows-7 gap-4 animate-pulse">
      <div className="col-span-5 bg-gray-200 rounded-xl row-span-2 h-56" />
      <div className="col-span-3 bg-gray-200 rounded-xl row-span-5 row-start-3" />
      <div className="col-span-2 bg-gray-200 rounded-xl row-span-5 col-start-4 row-start-3" />
    </div>
  );
};

export const ContentSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-56 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
    ))}
  </div>
);