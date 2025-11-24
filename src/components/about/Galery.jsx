import React, { useEffect, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { images } from '../../constants/imageConstant';
import { useAllEventDoc } from '../../hooks/event.hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

const formatApiDate = (dateString) => {
  if (!dateString) return 'Date not available';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const Galery = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const { documents: apiData, isLoading, error } = useAllEventDoc({ is_active: true });

  const descriptions = useMemo(() => {
    if (!apiData) return [];
    return apiData.map((doc) => ({
      title: doc.title || 'Event Documentation',

      date: formatApiDate(doc.date || doc.created_at),

      image: doc.image_url
    }));
  }, [apiData]);

  useEffect(() => {
    if (descriptions.length === 0) return;

    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % descriptions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeIndex, descriptions.length]);

  const handleDotClick = (index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  if (isLoading) {
    return (
      <div className="relative overflow-hidden bg-background py-12">
        <div className="relative z-10 flex flex-col justify-center items-center h-[50vh]">
          <p>Loading Gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative overflow-hidden bg-background py-12">
        <div className="relative z-10 flex flex-col justify-center items-center h-[50vh]">
          <p className="text-red-500">Failed to load gallery.</p>
        </div>
      </div>
    );
  }

  if (descriptions.length === 0) {
    return (
      <div className="relative overflow-hidden bg-background py-12">
        <div className="relative z-10 flex flex-col justify-center items-center h-[50vh] px-4 text-center">
          <FontAwesomeIcon icon={faImage} className="h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-2xl font-semibold text-gray-700">Gallery is Empty</h3>
          <p className="mt-2 text-gray-500 text-medium">
            There is no documentation available at this moment.
          </p>
        </div>
      </div>
    );
  }

  const currentItem = descriptions[activeIndex];

  return (
    <div className="relative overflow-hidden bg-background py-12">
      <div className="absolute inset-0 before:absolute before:inset-0 before:content-[''] before:bg-[url('../../assets/images/pattern.webp')] before:bg-repeat before:opacity-50" />

      <div className="relative z-10 flex flex-col md:grid h-auto md:h-[120vh] md:grid-cols-10 md:grid-rows-10 gap-4 px-4 md:px-24">
        <div className="relative md:col-span-4 md:row-span-4 flex items-center overflow-hidden rounded-3xl bg-secondary p-8">
          <div className="absolute inset-0 before:absolute before:inset-0 before:content-[''] before:bg-[url('../../assets/images/pattern.webp')] before:bg-cover before:bg-center before:opacity-10 before:scale-[2.5]" />
          <div className="absolute -bottom-[40%] inset-0 flex items-end justify-center pointer-events-none">
            <img src={images.star_3} alt="Decoration Star" className="h-72" />
          </div>

          <div className="relative z-10 w-full text-white">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeIndex}
                initial={{ x: direction * 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -direction * 100, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}>
                <p className="mb-2 text-sm md:text-lg">{currentItem.date}</p>
                <h3 className="text-3xl font-semibold md:text-5xl">{currentItem.title}</h3>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex gap-2">
              {descriptions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'bg-white scale-125'
                      : 'bg-white opacity-50 hover:opacity-75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {[
          { pos: 'md:col-span-6 md:col-start-5 md:row-span-4' },
          { pos: 'md:col-span-6 md:row-span-4 md:row-start-5' },
          { pos: 'md:col-span-4 md:col-start-7 md:row-span-3 md:row-start-5' },
          { pos: 'md:col-span-4 md:col-start-7 md:row-span-3 md:row-start-8', mobileHidden: true },
          { pos: 'md:col-span-3 md:row-span-2 md:row-start-9', mobileHidden: true },
          { pos: 'md:col-span-3 md:col-start-4 md:row-span-2 md:row-start-9', mobileHidden: true }
        ].map(({ pos, mobileHidden }, i) => {
          const imageIndex = (activeIndex + i) % descriptions.length;
          const { image, title } = descriptions[imageIndex];

          return (
            <div
              key={i}
              className={`overflow-hidden rounded-3xl h-64 md:h-auto ${pos} ${
                i >= 2 ? 'hidden md:block' : ''
              }`}>
              <div className="relative w-full h-full">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={image}
                    src={image}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    loading="lazy"
                  />
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Galery;
