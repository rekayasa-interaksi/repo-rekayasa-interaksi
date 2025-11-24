import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { images } from '../../constants/imageConstant';
import { ArrowUpRightIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { HiOutlineInbox } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useAllHistory } from '../../hooks/history.hook';
import { useAllEventDoc } from '../../hooks/event.hooks';
import ErrorCard from '../ui/ErrorCard';
import NotFoundCard from '../ui/NotFoundCard';
import { format } from 'date-fns';

const LoadingSpinner = ({ variant = 'primary' }) => (
  <div className="w-full h-full flex justify-center items-center">
    <ArrowPathIcon
      className={`h-12 w-12 animate-spin ${variant === 'white' ? 'text-white' : 'text-primary'}`}
    />
  </div>
);

const EmptyCard = ({ message, variant = 'primary' }) => (
  <div className="absolute inset-0 z-20 w-full h-full flex flex-col justify-center items-center p-8 text-center">
    <HiOutlineInbox className="w-16 h-16 text-gray-300 " />
    <h3
      className={'text-lg font-semibold text-white'}>
      {message}
    </h3>
  </div>
);

const About = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const {
    histories,
    isLoading: isHistoryLoading,
    error: historyError,
    refetch: refetchHistory
  } = useAllHistory();
  const {
    documents,
    isLoading: isEventLoading,
    error: eventError,
    refetch: refetchEvents
  } = useAllEventDoc();

  useEffect(() => {
    if (isHistoryLoading || isEventLoading) return;

    const totalHistorySlides = histories?.length || 0;
    const totalDocSlides = documents?.length || 0;
    const totalSlides = Math.max(totalHistorySlides, totalDocSlides);

    if (totalSlides === 0) return;

    const interval = setInterval(() => {
      setDirection(1);

      setCurrent((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [histories, documents, isHistoryLoading, isEventLoading]);

  const renderHistoryCarousel = () => {
    if (isHistoryLoading) return <LoadingSpinner />;
    if (historyError) return <ErrorCard error={historyError} onRetry={refetchHistory} />;
    if (!histories || histories.length === 0) {
      return <NotFoundCard message="No histories available right now." />;
    }

    const historyIndex = current % histories.length;
    return (
      <>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.img
            key={current}
            src={`${process.env.REACT_APP_IMG_PATH}/${histories[historyIndex].image_path}`}
            alt={histories[historyIndex].title}
            className="w-full h-full rounded-2xl md:rounded-[2rem] object-cover"
            initial={{ opacity: 0, x: direction * 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 100 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </AnimatePresence>

        <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {histories.map((_, index) => (
            <span
              key={index}
              className={`w-2 h-2 bg-white rounded-full transition-all duration-300 ${
                historyIndex === index ? 'opacity-100 scale-125' : 'opacity-50'
              }`}></span>
          ))}
        </div>
      </>
    );
  };

  const renderDocumentCarousel = () => {
    if (isEventLoading) return <LoadingSpinner variant="white" />;
    if (eventError) return <ErrorCard error={eventError} onRetry={refetchEvents} variant="white" />;

    if (!documents || documents.length === 0) {
      return <EmptyCard message="No event documentation available right now." variant="white" />;
    }

    const docIndex = current % documents.length;
    return (
      <div className="relative z-20 text-white w-full flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ x: direction * 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -direction * 100, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full text-start">
            <p className="text-lg md:text-xl">
              {format(new Date(documents[docIndex].date), 'd MMMM yyyy')}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl mt-1 md:mt-2">
              {documents[docIndex].title}
            </h2>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 md:mt-8 flex justify-start gap-2">
          {documents.map((_, index) => (
            <span
              key={index}
              className={`w-2 h-2 bg-white rounded-full transition-opacity ${
                docIndex === index ? 'opacity-100 scale-125' : 'opacity-50'
              }`}></span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white bg-repeat py-8 lg:py-16">
      <div className="max-w-[95vw] lg:max-w-[85vw] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6 ">
        <div className="shadow-lg h-[40vh] sm:h-[50vh] lg:h-[53vh] rounded-2xl lg:rounded-[2rem] lg:col-span-3 overflow-hidden relative">
          {renderHistoryCarousel()}
        </div>

        <div className="shadow-lg h-auto lg:h-[53vh] rounded-2xl lg:rounded-[2rem] lg:col-span-2 bg-primary overflow-hidden relative flex items-center py-6 px-8 lg:px-4 2xl:px-16">
          <div className="absolute inset-0 before:content-[''] before:absolute before:inset-0 before:bg-[url('../../assets/images/pattern-biru.png')] before:bg-cover before:bg-center before:scale-[2]"></div>

          <img
            src={images.star_4}
            alt="Star"
            className="absolute -top-[40%] -right-[70%] z-0 pointer-events-none"
          />

          <div className="relative z-10 text-white">
            <h2 className="text-xl md:text-3xl 2xl:text-5xl">Get to Know About Digistar Club</h2>
            <p className="text-sm md:text-md mt-3 md:mt-4">
              Digistar Club is the official community by Telkom Indonesia that aims to support
              alumni of the LivinginTelkom program in their growth and learning about various
              digital and technological advancements.
            </p>

            <button
              onClick={() => navigate('/about')}
              className="px-4 py-2 md:px-6 md:py-2.5 mt-6 rounded-full border border-white text-white hover:bg-white hover:text-primary transition flex items-center gap-2 text-sm md:text-base">
              <span>Learn More</span>
              <ArrowUpRightIcon className="h-3 w-3 md:h-4 md:w-4" strokeWidth={6} />
            </button>
          </div>
        </div>

        <div className="shadow-lg h-auto lg:h-[53vh] rounded-2xl lg:rounded-[2rem] lg:col-span-2 bg-secondary overflow-hidden relative flex items-center p-6 lg:p-16 order-1 lg:order-none">
          <div className="absolute inset-0 before:content-[''] before:absolute before:inset-0 before:bg-[url('../../assets/images/pattern.webp')] before:bg-cover before:bg-center before:opacity-10 before:scale-[2.5]"></div>
          <div className="absolute inset-0 flex items-end -bottom-[50%] justify-center">
            <img src={images.star_3} alt="Star" className=" scale-75" />
          </div>
          {renderDocumentCarousel()}
        </div>

        <div className="shadow-lg h-[40vh] sm:h-[50vh] lg:h-[53vh] rounded-2xl lg:rounded-[2rem] lg:col-span-3">
          <img
            loading="lazy"
            src={images.img_about_2}
            alt="images"
            className="w-full h-full rounded-2xl lg:rounded-[2rem] object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
