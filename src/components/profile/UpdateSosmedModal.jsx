import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { useUpdateUserProfile } from '../../hooks/member.hooks';
import { TextField } from '../ui/Textfield';

const UpdateSosmedModal = ({ isOpen, onClose, user, onSuccess }) => {
  const { executeUpdateProfile, isLoading } = useUpdateUserProfile();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      sosmed_instagram: user?.social_media?.instagram || '',
      sosmed_linkedin: user?.social_media?.linkedin || '',
      sosmed_telegram: user?.social_media?.telegram || ''
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        sosmed_instagram: user.social_media?.instagram || '',
        sosmed_linkedin: user.social_media?.linkedin || '',
        sosmed_telegram: user.social_media?.telegram || ''
      });
    }
  }, [user, reset, isOpen]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append('social_media[instagram]', data.sosmed_instagram);
      formData.append('social_media[linkedin]', data.sosmed_linkedin);
      formData.append('social_media[telegram]', data.sosmed_telegram);

      await executeUpdateProfile(formData);

      toast.success('Social media links updated successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to update social media links. ' + (error.data?.message || 'Please try again.'));
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
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Update Social Media
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                    disabled={isLoading}>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <TextField
                    id="linkedin"
                    label="LinkedIn"
                    placeholder="Your LinkedIn profile link"
                    {...register('sosmed_linkedin')}
                    disabled={isLoading}
                  />
                  <TextField
                    id="sosmed_instagram"
                    label="Instagram"
                    placeholder="Your Instagram username"
                    {...register('sosmed_instagram')}
                    disabled={isLoading}
                  />
                  <TextField
                    id="sosmed_telegram"
                    label="Telegram"
                    placeholder="Your Telegram profile link"
                    {...register('sosmed_telegram')}
                    disabled={isLoading}
                  />
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 flex items-center"
                      disabled={isLoading}>
                      {isLoading && <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />}
                      Save
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

export default UpdateSosmedModal;
