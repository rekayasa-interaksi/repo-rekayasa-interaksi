import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog,DialogTitle, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const SuccessModal = ({
  isOpen,
  onClose,
  email,
  onResend,
  isResending,
  countdown,
  isResendDisabled
}) => {
  const navigate = useNavigate();

  const handleResend = () => {
    if (isResendDisabled || isResending) return;
    onResend();
  };

  const handleLoginClick = () => {
    onClose();
    navigate('/login');
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0 scale-95">
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-center align-middle shadow-xl transition-all">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-200">
                  <FontAwesomeIcon icon={faEnvelope} className="h-8 w-8 text-gray-500" />
                </div>
                <DialogTitle as="h3" className="text-2xl font-bold leading-6 text-gray-900 mt-6">
                  Check your email
                </DialogTitle>
                <div className="mt-2">
                  <h4 className="text-gray-500">
                    We have sent a reset link to
                    <span className="font-semibold text-gray-700"> {email}</span>
                  </h4>
                </div>
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={handleLoginClick}
                    className="w-full bg-orange-600 text-white font-semibold py-3 rounded-full hover:bg-orange-700 transition-colors">
                    Back to Login
                  </button>
                </div>
                <div className="mt-6 text-sm">
                  <span className="text-gray-500">Didn't receive the email? </span>
                  <button
                    onClick={handleResend}
                    disabled={isResendDisabled || isResending}
                    className="font-semibold text-blue-600 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed disabled:no-underline">
                    {isResending ? 'Sending...' : 'Resend email'}
                  </button>
                  {isResendDisabled && countdown > 0 && (
                    <h4 className="text-gray-400 mt-1">Available in {countdown} seconds</h4>
                  )}
                </div>
                <div className="mt-8">
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

export default SuccessModal;
