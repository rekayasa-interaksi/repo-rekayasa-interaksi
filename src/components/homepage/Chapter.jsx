import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination } from 'swiper/modules';
import { useAllStudentChapters } from '../../hooks/chapter.hooks';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import ErrorCard from '../ui/ErrorCard';
import { RangerSkeleton } from '../ui/SkeletonLoad';

const CardSlider = () => {
  const { chapters, isLoading, error, refetch } = useAllStudentChapters();

  if (isLoading) {
    return (
      <div className="text-center py-20 w-[90%] mx-auto">
        <RangerSkeleton count={6} />
      </div>
    );
  }

  if (error) {
    return <ErrorCard message="Error loading Chapters" onRetry={refetch} />;
  }

  return (
    <div className="mx-auto py-12 bg-background overflow-hidden relative">
      <div className="absolute inset-0 before:content-[''] before:absolute before:inset-0 before:bg-[url('../../assets/images/pattern.webp')] before:bg-repeat before:opacity-50"></div>
      <div className="max-w-[85vw] relative z-10 mx-auto">
        <h2 className="text-3xl md:text-5xl 2xl:text-5xl font-medium tracking-tight text-gray-900 ">
          Gather with Chapter
        </h2>
      </div>
      <div className="max-w-[85vw] mx-auto flex justify-center flex-col mt-8 md:mt-12">
        <Swiper
          breakpoints={{
            375: {
              slidesPerView: 1,
              spaceBetween: 15
            },
            712: {
              slidesPerView: 2,
              spaceBetween: 15
            },
            1042: {
              slidesPerView: 4,
              spaceBetween: 15
            }
          }}
          freeMode={true}
          pagination={{
            clickable: true
          }}
          modules={[FreeMode, Pagination]}
          className="max-w-[100%]">
          {chapters.map((item) => (
            <SwiperSlide key={item.institute}>
              <div className="flex flex-col ring-1 bg-light ring-gray-200 items-start mb-16 group relative shadow-lg rounded-3xl h-[17rem] p-6 overflow-hidden text-ellipsis">
                <div className="w-full flex flex-row items-start mb-4">
                  <div className="w-1/4 ">
                    <img
                      loading="lazy"
                      src={item.image_url}
                      alt={item.institute}
                      className="w-36"
                    />
                  </div>
                </div>
                <h3 className="text-xl 2xl:text-2xl font-medium">{item.institute}</h3>
                <p className="text-md font-light line-clamp-5">{item.address}</p>
                {/* <button className="absolute bottom-7 right-7 bg-dark py-1 px-3 rounded-full">
                  <span className="text-light text-3xl font-light">+</span>
                </button> */}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CardSlider;
