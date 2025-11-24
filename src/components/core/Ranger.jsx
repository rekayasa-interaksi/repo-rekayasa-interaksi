import React from 'react';
import Marquee from 'react-fast-marquee';
import { images } from '../../constants/imageConstant';
import { useAllOrganizations } from '../../hooks/ranger.hooks';
import ErrorCard from '../ui/ErrorCard';
import { RangerSkeleton } from '../ui/SkeletonLoad';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faUsersSlash } from '@fortawesome/free-solid-svg-icons'; 

const CardCarousel = () => {
  const { organizations, isLoading, error, refetch } = useAllOrganizations();

  if (isLoading) {
    return (
      <div className="text-center py-20 w-[90%] mx-auto">
        <RangerSkeleton />
      </div>
    );
  }

  if (error) {
    return <ErrorCard message="Error loading Ranger data" onRetry={refetch} />;
  }

  if (organizations.length === 0) {
    return (
      <div className="mx-auto py-12 bg-background overflow-hidden relative">
        <div className="absolute inset-0 before:content-[''] before:absolute before:inset-0 before:bg-[url('../../assets/images/pattern.webp')] before:bg-repeat before:opacity-50"></div>
        <div className="mx-auto max-w-[85vw] mb-5 sm:mb-11 relative z-10">
          <h2 className="text-3xl md:text-5xl font-medium text-gray-900 ">
            Meet Existing Committee.
          </h2>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center py-16 text-center text-gray-700">
          <FontAwesomeIcon icon={faUsersSlash} className="h-20 w-20 text-gray-400" />
          <h3 className="mt-4 text-2xl font-semibold">Ranger Data Empty</h3>
          <p className="mt-2 text-gray-500">Ranger data is currently unavailable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto py-12 bg-background overflow-hidden relative">
      <div className="absolute inset-0 before:content-[''] before:absolute before:inset-0 before:bg-[url('../../assets/images/pattern.webp')] before:bg-repeat before:opacity-50"></div>
      <div className="mx-auto max-w-[85vw] mb-5 sm:mb-11 relative z-10">
        <h2 className="text-3xl md:text-5xl font-medium text-gray-900 ">
          Meet Existing Committee.
        </h2>
      </div>
      <Marquee direction="right" speed={100} delay={5}>
        {organizations.map((item, index) => (
          <div key={index} className="px-3 pb-3 mt-4">
            <div className="flex flex-col min-w-80 relative">
              <div className="relative flex justify-center h-[28rem] rounded-3xl bg-secondary pt-4 overflow-hidden">
                <div className="absolute inset-0 before:content-[''] before:absolute before:inset-0 before:bg-[url('../../assets/images/pattern.webp')] before:bg-cover before:bg-center before:opacity-10 before:scale-[2]"></div>
                <img
                  loading="lazy"
                  src={images.logo_digistar_kotak}
                  alt={'logo kotak'}
                  className="w-[15%] h-10 object-contain absolute"
                />
                <img
                  loading="lazy"
                  src={item.image_url}
                  alt={item.name}
                  className="absolute bottom-0 w-auto h-[90%] object-cover"
                />
                <div className="absolute bottom-0 bg-white bg-opacity-90 text-center rounded-xl mb-4  w-[95%] px-3 py-3 ">
                  <h3 className="font-medium text-xl">{item.name}</h3>
                  <p className="text-accent">{item.position}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default CardCarousel;
