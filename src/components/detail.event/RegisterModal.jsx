import React, { useState } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/authContext';
import { useRegisterEvent } from '../../hooks/event.hooks';
import toast from 'react-hot-toast';

const RegisterModal = ({ isOpen, onClose, eventType, eventId, onRegistrationSuccess }) => {
  const { execute, isLoading: isSubmitting, error: submitError } = useRegisterEvent();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('member');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let payload = { event_id: eventId };

      await execute(payload);
      toast.success('Register Successfully');

      if (onRegistrationSuccess) {
        onRegistrationSuccess();
      }

      onClose();
    } catch (err) {
      toast.error(`Register Failed: ${err.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
        onClose={onClose}>
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </TransitionChild>
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95">
          <DialogPanel
            className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto relative p-8"
            onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              aria-label="Close modal">
              <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-primary">
              {eventType === 'exclusive'
                ? 'Exclusive Event Registration'
                : 'Register for the Event'}
            </h2>

            {!isAuthenticated && eventType !== 'exclusive' && (
              <div className="flex mb-6">
                {['member', 'umum'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 font-semibold border ${
                      activeTab === tab
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } ${tab === 'member' ? 'rounded-l-md' : 'rounded-r-md'}`}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 pb-8">
              {isAuthenticated ? (
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-medium">Hi {user.name},</h3>
                  <h4>Click below to confirm your registration.</h4>
                  <button
                    type="submit"
                    className="w-full bg-secondary text-white font-bold py-3 px-6 rounded-full hover:bg-secondary-dark transition-all duration-300 transform hover:scale-105">
                    Confirm Registration
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-medium">Hi Guest,</h3>
                  <h4>Please fill in your details to register.</h4>
                  <button
                    type="submit"
                    className="w-full bg-secondary text-white font-bold py-3 px-6 rounded-full hover:bg-secondary-dark transition-all duration-300 transform hover:scale-105">
                    Register
                  </button>
                </div>
              )}
            </form>

            {isSubmitting && <h4 className="text-sm text-gray-500">Submitting...</h4>}
            {submitError && <h4 className="text-sm text-red-500">{submitError.data.message}</h4>}
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
};

export default RegisterModal;
