import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { images } from '../../constants/imageConstant';
import RegisterModal from './RegisterModal';
import FeedbackModal from './FeedbackModal';
import { useAuth } from '../../context/authContext';

const LoginRequiredModal = ({ isOpen, onClose, onLoginClick }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
        <h3 className="text-2xl font-bold mb-4">You Must Login First!</h3>
        <p className="text-gray-600 mb-6">Please log in to your account to continue.</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors">
            Batal
          </button>
          <button
            onClick={onLoginClick}
            className="px-6 py-2 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors">
            Login Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

const Banner = ({ event, onRefresh }) => {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isRegistModalOpen, setIsRegistModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const openRegistModal = () => setIsRegistModalOpen(true);
  const closeRegistModal = () => setIsRegistModalOpen(false);
  const openFeedbackModal = () => setIsFeedbackModalOpen(true);
  const closeFeedbackModal = () => setIsFeedbackModalOpen(false);
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const handleRegisterClick = () => {
    if (isAuthenticated) {
      openRegistModal();
    } else {
      openLoginModal();
    }
  };

  const handleFeedbackClick = () => {
    if (isAuthenticated) {
      openFeedbackModal();
    } else {
      openLoginModal();
    }
  };

  if (!isBannerVisible) return null;

  return (
    <>
      <div className="fixed z-[99] bottom-0 w-full bg-primary bg-[url('../../assets/images/pattern-biru.png')] overflow-hidden h-[25vh] md:h-[20vh] flex items-center">
        <button
          onClick={() => setIsBannerVisible(false)}
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          aria-label="Close banner">
          <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
        </button>
        <div className="container mx-auto px-8 flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="text-white mb-2 md:mb-0 md:w-1/2">
            <h1 className="text-xl 2xl:text-2xl font-bold mb-4">
              Elevate your <span className="text-secondary italic">dreams</span>, <br /> embrace
              your <span className="text-secondary italic">passions</span>
            </h1>
            <img
              src={images.line}
              alt="Decorative"
              className="hidden md:block w-[80%] 2xl:w-[50%] max-w-96 object-cover mt-2"
              loading="lazy"
            />
          </div>
          <div className="md:w-1/2 flex justify-end items-center gap-6">
            <span className="text-white text-lg md:text-xl">Free Event</span>
            {event?.is_joined ? (
              <div className="bg-secondary text-white font-normal py-2.5 px-6 rounded-full text-base md:text-lg flex items-center transition-all duration-300 transform hover:scale-105">
                Participated
              </div>
            ) : event?.status === 'active' && event?.is_registered ? (
              <button
                onClick={handleFeedbackClick}
                className="bg-secondary text-white font-normal py-2.5 px-6 rounded-full text-base md:text-lg flex items-center transition-all duration-300 transform hover:scale-105">
                Presence Now
                <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3 ml-4 sm:h-4 sm:w-4" />
              </button>
            ) : event?.is_registered ? (
              <div className="bg-secondary text-white font-normal py-2.5 px-6 rounded-full text-base md:text-lg flex items-center transition-all duration-300 transform hover:scale-105">
                Registered
              </div>
            ) : (
              event?.status === 'upcoming' && (
                <button
                  onClick={handleRegisterClick}
                  className="bg-secondary text-white font-normal py-2.5 px-6 rounded-full text-base md:text-lg flex items-center transition-all duration-300 transform hover:scale-105">
                  Register Now
                  <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3 ml-4 sm:h-4 sm:w-4" />
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <RegisterModal
        isOpen={isRegistModalOpen}
        onClose={closeRegistModal}
        eventType={event?.type}
        eventId={event?.id}
        onRegistrationSuccess={onRefresh}
      />
      <FeedbackModal isOpen={isFeedbackModalOpen} onClose={closeFeedbackModal} event={event} />
      <LoginRequiredModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onLoginClick={() => navigate('/login')}
      />
    </>
  );
};

export default Banner;
