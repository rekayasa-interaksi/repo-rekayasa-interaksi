import React, { useState, useEffect } from 'react';
import EventCard from '../core/EventCard';
import {
  useUserHistory,
  useUserAchievements,
  useUserRegisteredEvents
} from '../../hooks/member.hooks';
import ErrorCard from '../ui/ErrorCard';
import { ContentSkeleton } from '../ui/SkeletonLoad';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import NotFoundCard from '../ui/NotFoundCard';

const AchievementCard = ({ title, date }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-4 transition-transform hover:shadow-md hover:scale-[1.02] cursor-pointer">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">🏆 {title}</h3>
      <h4 className="text-gray-500 text-sm">Diberikan pada: {date}</h4>
    </div>
  );
};

const MainContent = () => {
  const [activeTab, setActiveTab] = useState('register');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const {
    history,
    isLoading: isHistoryLoading,
    error: historyError,
    refetch: refetchHistory
  } = useUserHistory();
  const {
    achievements,
    isLoading: isAchievementsLoading,
    error: achievementsError,
    refetch: refetchAchievements
  } = useUserAchievements();

  const {
    registeredEvents,
    isLoading: isRegisteredLoading,
    error: registeredError,
    refetch: refetchRegistered
  } = useUserRegisteredEvents();

  const isLoading = isHistoryLoading || isAchievementsLoading || isRegisteredLoading;
  const error = historyError || achievementsError || registeredError;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(2);
      } else if (window.innerWidth < 1280) {
        setItemsPerPage(4);
      } else {
        setItemsPerPage(6);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCurrentPage(0);
  };

  const renderContent = () => {
    if (isLoading) {
      return <ContentSkeleton />;
    }

    if (error) {
      const getRetryFunction = () => {
        if (activeTab === 'history') return refetchHistory;
        if (activeTab === 'achievement') return refetchAchievements;
        if (activeTab === 'register') return refetchRegistered;
        return () => {};
      };
      return <ErrorCard message="Failed to load data" onRetry={getRetryFunction()} />;
    }

    let currentData = [];
    let notFoundMessage = 'No data found.';

    if (activeTab === 'register') {
      currentData = registeredEvents || [];
      notFoundMessage = 'You are not registered for any upcoming events.';
    } else if (activeTab === 'history') {
      currentData = history || [];
      notFoundMessage = 'You do not have any event history yet.';
    } else if (activeTab === 'achievement') {
      currentData = achievements || [];
      notFoundMessage = 'You do not have any achievements yet.';
    }

    if (currentData.length === 0) {
      return <NotFoundCard message={notFoundMessage} />;
    }

    const pageCount = Math.ceil(currentData.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const paginatedData = currentData.slice(offset, offset + itemsPerPage);

    let contentToRender;

    if (activeTab === 'register') {
      contentToRender = (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginatedData.map((event, index) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      );
    } else if (activeTab === 'history') {
      contentToRender = (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginatedData.map((h, index) => (
            <EventCard key={h.id} event={h} />
          ))}
        </div>
      );
    } else if (activeTab === 'achievement') {
      contentToRender = (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginatedData.map((achievement, index) => (
            <AchievementCard key={index} title={achievement.title} date={achievement.date} />
          ))}
        </div>
      );
    }

    const paginationControls = pageCount > 1 && (
      <div className="mt-8 flex items-center justify-center gap-4 text-sm sm:gap-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className="px-4 py-2 border rounded-md disabled:opacity-50 transition-colors hover:bg-gray-100">
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <p className="text-gray-700 ">
          Page {currentPage + 1} of {pageCount}
        </p>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount - 1))}
          disabled={currentPage === pageCount - 1}
          className="px-4 py-2 border rounded-md disabled:opacity-50 transition-colors hover:bg-gray-100">
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    );

    return (
      <>
        {contentToRender}
        {paginationControls}
      </>
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm ">
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => handleTabClick('register')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'register'
                ? 'bg-white text-primary  shadow'
                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
            }`}>
            Register Event
          </button>
          <button
            onClick={() => handleTabClick('history')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'history'
                ? 'bg-white text-primary  shadow'
                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
            }`}>
            History Event
          </button>
          <button
            onClick={() => handleTabClick('achievement')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === 'achievement'
                ? 'bg-white text-primary  shadow'
                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
            }`}>
            Achievement
          </button>
        </nav>
      </div>

      <div>{renderContent()}</div>
    </div>
  );
};

export default MainContent;
