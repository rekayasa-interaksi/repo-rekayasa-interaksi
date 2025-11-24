import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogTitle, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { useUpdateUserProfile, useDeleteUserProfileImage } from '../../hooks/member.hooks';
import { TextField } from '../ui/Textfield';
import CroppableImageField from '../ui/CroppableImageField';

const UpdateProfileModal = ({ isOpen, onClose, user, onSuccess }) => {
  const { executeUpdateProfile, isLoading } = useUpdateUserProfile();
  const { executeDeleteProfileImage } = useDeleteUserProfileImage();
  const [croppedProfileFile, setCroppedProfileFile] = useState(null);
  const [croppedCoverFile, setCroppedCoverFile] = useState(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: user?.name || '',
      image_profile: user?.image_profile || null,
      image_cover: user?.image_cover || null
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        image_profile: null,
        image_cover: null
      });

      setCroppedProfileFile(null);
      setCroppedCoverFile(null);
    }
  }, [user, reset, isOpen]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    let hasError = false;

    try {
      if (croppedProfileFile === 'DELETE' && croppedCoverFile === 'DELETE') {
        await executeDeleteProfileImage('all');
      } else if (croppedProfileFile === 'DELETE') {
        await executeDeleteProfileImage('profile');
      } else if (croppedCoverFile === 'DELETE') {
        await executeDeleteProfileImage('cover');
      }
    } catch (err) {
      toast.error(err.data?.message || 'Failed to delete image(s).');
      hasError = true;
    }

    if (hasError) return;

    try {
      if (croppedProfileFile && croppedProfileFile !== 'DELETE') {
        if (user.image_profile_path) {
          await executeDeleteProfileImage('profile');
        }
        formData.append('image_profile', croppedProfileFile);
      }

      if (croppedCoverFile && croppedCoverFile !== 'DELETE') {
        if (user.image_cover_path) {
          await executeDeleteProfileImage('cover');
        }
        formData.append('image_cover', croppedCoverFile);
      }
    } catch (err) {
      toast.error(err.data?.message || 'Failed to replace image(s).');
      hasError = true;
    }

    if (hasError) return;

    const nameChanged = data.name !== user.name;
    const filesUploaded =
      (croppedProfileFile && croppedProfileFile !== 'DELETE') ||
      (croppedCoverFile && croppedCoverFile !== 'DELETE');
    const filesDeleted = croppedProfileFile === 'DELETE' || croppedCoverFile === 'DELETE';

    if (nameChanged || filesUploaded) {
      try {
        await executeUpdateProfile(formData);
        toast.success('Profile updated successfully!');
        onSuccess();
        onClose();
      } catch (err) {
        toast.error(err.data?.message || 'Failed to update profile.');
      }
    } else if (filesDeleted) {
      toast.success('Image(s) deleted successfully!');
      onSuccess();
      onClose();
    } else {
      toast.success('No changes to save.');
      onClose();
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
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0 scale-95">
              <DialogPanel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <DialogTitle as="h3" className="text-xl font-bold leading-6 text-gray-900">
                    Update Profile
                  </DialogTitle>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mt-4 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-4">
                      <TextField label="Nama Lengkap" {...register('name')} required />

                      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                        <div className="w-full md:w-1/3 max-w-xs">
                          <CroppableImageField
                            label="Photo Profile"
                            aspect={1}
                            onFileCropped={(file) => setCroppedProfileFile(file)}
                            defaultPreviewUrl={user?.image_profile_path}
                          />
                        </div>

                        <div className="w-full">
                          <CroppableImageField
                            label="Photo Cover"
                            aspect={3 / 1}
                            onFileCropped={(file) => setCroppedCoverFile(file)}
                            defaultPreviewUrl={user?.image_cover_path}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary text-white font-semibold py-3 px-4 rounded-full hover:bg-primary/90 transition-colors disabled:bg-gray-400">
                      {isLoading ? (
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                      ) : (
                        'Save Changes'
                      )}
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

export default UpdateProfileModal;
