import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useAllEvents } from '../../hooks/event.hooks';
import EventCard from '../core/EventCard';
import NotFoundCard from '../ui/NotFoundCard';
import ErrorCard from '../ui/ErrorCard';
import { SkeletonCard } from '../ui/SkeletonLoad';
import useDebounce from '../../hooks/debouncer';

const EventList = () => {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [eventsPerPage, setEventsPerPage] = useState(8);
  const [activeTab, setActiveTab] = useState('all');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const debouncedQuery = useDebounce(query, 500);

  const {
    events: paginatedEvents,
    metaData,
    isLoading,
    error,
    refetch
  } = useAllEvents(currentPage + 1, eventsPerPage, debouncedQuery, activeTab);

  const pageCount = metaData ? metaData.totalPage : 0;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setEventsPerPage(2);
      else if (window.innerWidth < 1024) setEventsPerPage(4);
      else setEventsPerPage(8);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <SkeletonCard count={8} />
        </div>
      );
    }

    if (error) {
      return <ErrorCard message="Error loading events" onRetry={refetch} />;
    }

    if (paginatedEvents.length === 0) {
      return (
        <div className="bg-white rounded-xl p-6 shadow-sm w-full">
          <NotFoundCard message="No events found." />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 bg-white rounded-xl p-6 shadow-sm">
        {paginatedEvents.map((event, index) => (
          <EventCard event={event} key={event.id} />
        ))}
      </div>
    );
  };

  return (
    <div className="px-4 sm:px-6 py-8 sm:py-12 md:m-4 lg:m-6 rounded-3xl bg-background bg-repeat bg-[url('../../assets/images/pattern.webp')]">
      <div className="mx-auto max-w-[95vw] md:max-w-[90vw] px-0 lg:px-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-10 gap-4">
          <div
            className={`flex flex-nowrap relative w-full transition-all duration-300 ease-in-out ${
              isSearchActive ? 'sm:w-96' : 'sm:w-60'
            }`}>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="h-3 w-3 sm:h-4 sm:w-4" />
            </span>
            <input
              type="text"
              placeholder="Search Event"
              className="py-2 sm:py-3 px-8 sm:px-10 w-full border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm sm:text-base"
              value={query}
              onFocus={() => setIsSearchActive(true)}
              onBlur={() => setIsSearchActive(false)}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(0);
              }}
            />
          </div>

          <div className="relative flex border border-gray-200 p-1 sm:p-2 rounded-full bg-white w-full sm:w-auto justify-between sm:justify-center ">
            {['all', 'upcoming', 'active', 'cancel', 'done'].map((tab) => (
              <button
                key={tab}
                className={`relative font-medium text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2 z-10 ${
                  activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(0);
                }}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.span
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-full bg-black z-[-1]"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {renderContent()}

        {paginatedEvents.length > 0 && pageCount > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4 text-sm sm:gap-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className="px-4 py-2 border rounded disabled:opacity-50">
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <p>
              Page {currentPage + 1} of {pageCount}
            </p>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount - 1))}
              disabled={currentPage === pageCount - 1}
              className="px-4 py-2 border rounded disabled:opacity-50">
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;
