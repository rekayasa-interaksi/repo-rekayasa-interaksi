import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogTitle, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faSpinner,
  faEye,
  faEyeSlash,
  faInfoCircle,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { useResetPassword } from '../../hooks/auth.hook';
import { TextField } from '../ui/Textfield';

const checkPasswordStrength = (pass) => {
  let score = 0;
  if (!pass) return 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  return score;
};

const ResetPasswordModal = ({ isOpen, onClose, user, onSuccess }) => {
  const { executeResetPassword, isLoading } = useResetPassword();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isHintVisible, setIsHintVisible] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_new_password: '',
      confirm_text: ''
    }
  });

  const newPassword = watch('new_password');
  const confirmNewPassword = watch('confirm_new_password');

  useEffect(() => {
    if (isOpen) {
      reset({
        old_password: '',
        new_password: '',
        confirm_new_password: '',
        confirm_text: ''
      });
      setPasswordStrength(0);
    }
  }, [isOpen, reset]);

  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(newPassword));
  }, [newPassword]);

  const onSubmit = async (data) => {
    if (data.new_password !== data.confirm_new_password) {
      toast.error('Passwords do not match. Please try again.');
      return;
    }

    try {
      await executeResetPassword({
        old_password: data.old_password,
        new_password: data.new_password,
        confirm_new_password: data.confirm_new_password
      });

      toast.success('Password has been reset successfully!');
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to reset password. ' + (error.data?.message || 'Please try again.'));
    }
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
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Reset Password
                </DialogTitle>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  aria-label="Close Modal">
                  <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                  <TextField
                    label="Old Password"
                    type={showOldPassword ? 'text' : 'password'}
                    placeholder="Enter your old password"
                    {...register('old_password', { required: 'Old password is required.' })}
                    error={!!errors.old_password}
                    helperText={errors.old_password?.message}
                    endAdornment={
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="text-gray-500 text-sm hover:text-gray-700"
                        title={showOldPassword ? 'Hide password' : 'Show password'}>
                        <FontAwesomeIcon icon={showOldPassword ? faEye : faEyeSlash} />
                      </button>
                    }
                  />

                  <TextField
                    label="New Password"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    {...register('new_password', {
                      required: 'New password is required.',
                      minLength: { value: 8, message: 'Password must be 8+ characters.' },
                      validate: {
                        hasUpper: (v) => /[A-Z]/.test(v) || 'Must include an uppercase letter.',
                        hasNumber: (v) => /[0-9]/.test(v) || 'Must include a number.',
                        hasSpecial: (v) =>
                          /[^A-Za-z0-9]/.test(v) || 'Must include a special character.'
                      }
                    })}
                    error={!!errors.new_password}
                    helperText={errors.new_password?.message}
                    endAdornment={
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="text-gray-500 text-sm hover:text-gray-700"
                        title={showNewPassword ? 'Hide password' : 'Show password'}>
                        <FontAwesomeIcon icon={showNewPassword ? faEye : faEyeSlash} />
                      </button>
                    }
                  />

                  {newPassword && (
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-gray-200 rounded">
                        <div
                          className={`h-1 rounded transition-all ${
                            passwordStrength <= 1
                              ? 'bg-red-500 w-1/4'
                              : passwordStrength === 2
                              ? 'bg-yellow-500 w-2/4'
                              : passwordStrength === 3
                              ? 'bg-blue-500 w-3/4'
                              : 'bg-green-500 w-full'
                          }`}></div>
                      </div>
                      <div
                        className="relative"
                        onMouseEnter={() => setIsHintVisible(true)}
                        onMouseLeave={() => setIsHintVisible(false)}>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="text-gray-400 cursor-pointer"
                        />
                        <Transition
                          show={isHintVisible}
                          as={React.Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1">
                          <div className="absolute z-10 bottom-full right-0 mb-2 w-64 p-3 bg-gray-800 text-white text-xs rounded-md shadow-lg">
                            Password must be 8+ characters, include uppercase, number, and special
                            character.
                            <div className="absolute top-full right-1 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                          </div>
                        </Transition>
                      </div>
                    </div>
                  )}

                  <TextField
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    {...register('confirm_new_password', {
                      required: 'Please confirm your new password.',
                      validate: (value) => value === newPassword || 'Passwords do not match.'
                    })}
                    error={!!errors.confirm_new_password}
                    helperText={errors.confirm_new_password?.message}
                    endAdornment={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-500 text-sm hover:text-gray-700"
                        title={showConfirmPassword ? 'Hide password' : 'Show password'}>
                        <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                      </button>
                    }
                  />

                  {confirmNewPassword && (
                    <p
                      className={`mt-1 text-xs ${
                        confirmNewPassword === newPassword ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {confirmNewPassword === newPassword ? (
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faCheck} className="mr-2" />
                          Passwords match
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faTimes} className="mr-2" />
                          Passwords do not match
                        </div>
                      )}
                    </p>
                  )}

                  <TextField
                    label="Type this to confirm: RESET PASSWORD"
                    type="text"
                    placeholder='Type "RESET PASSWORD" to confirm'
                    {...register('confirm_text', {
                      required: 'Confirmation is required.',
                      validate: (value) =>
                        value === 'RESET PASSWORD' || 'Text does not match "RESET PASSWORD".'
                    })}
                    error={!!errors.confirm_text}
                    helperText={errors.confirm_text?.message}
                  />

                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading || !isValid}
                      className={`px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center ${
                        isLoading || !isValid ? 'cursor-not-allowed opacity-70' : ''
                      }`}>
                      {isLoading && <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />}
                      Reset Password
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ResetPasswordModal;
