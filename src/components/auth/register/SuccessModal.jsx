import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export const SuccessModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 overflow-y-auto backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100">
              <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-8 text-center align-middle shadow-xl transition-all border-2 border-dashed border-gray-300">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-gray-200">
                  <FontAwesomeIcon icon={faEnvelope} className="h-8 w-8 text-gray-500" />
                </div>
                <DialogTitle as="h3" className="text-3xl font-bold text-gray-900 mt-6">
                  Success to Register!
                </DialogTitle>
                <div className="mt-8 space-y-4">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/login');
                    }}
                    className="w-full bg-orange-600 text-white font-semibold py-3 rounded-full hover:bg-orange-700 transition-colors">
                    Login to your Account
                  </button>
                  <button
                    onClick={onClose}
                    className="flex items-center gap-2 mx-auto text-gray-500 font-semibold hover:text-gray-800">
                    <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
                    Previous page
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
