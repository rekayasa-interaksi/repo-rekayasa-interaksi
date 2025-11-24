import React from 'react';
import { useAllStudentClubs } from '../../hooks/club.hooks';
import ErrorCard from '../ui/ErrorCard';
import { SkeletonCard } from '../ui/SkeletonLoad';

const CardGroup = () => {
  const { clubs, isLoading, refetch, error } = useAllStudentClubs();

  if (isLoading) {
    return  <SkeletonCard count={3} />;
  }

  if (error) {
    return <ErrorCard message="Error loading Clubs" onRetry={refetch} />;
  }

  return (
    <div className="bg-background bg-repeat bg-[url('../../assets/images/pattern.webp')] py-16">
      <div className="max-w-[85vw] mx-auto text-start">
        <h2 className="text-3xl md:text-5xl font-medium text-gray-900">
          Discover Our Clubs.
        </h2>
      </div>

      <div className="mt-8 md:mt-12 overflow-x-auto lg:overflow-visible py-4 px-6">
        <div className="flex lg:grid lg:grid-cols-3 gap-6 px-4 lg:px-0 max-w-[85vw] mx-auto">
          {clubs.map((club) => (
            <div key={club.id} className="group">
              <div className="min-w-[80vw] md:min-w-[60vw] lg:min-w-0 aspect-[3/4] md:aspect-[4/5] xl:aspect-[3.3/4] relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
                <img
                  loading="lazy"
                  src={club.image_url}
                  alt={club.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-black/40 to-transparent"></div>

                <div className="absolute bottom-0 left-0 p-6 w-full text-white">
                  <h3 className="text-2xl md:text-3xl sm:text-2xl font-medium">{club.name} Club</h3>
                  <p className="mt-2 text-base/relaxed opacity-90 line-clamp-3">
                    {club.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardGroup;
