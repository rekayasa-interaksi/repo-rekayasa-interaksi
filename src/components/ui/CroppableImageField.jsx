import React, { useState, useCallback, useRef, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { Dialog, DialogTitle, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCropAlt, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getCroppedImg } from '../../utils/imageCrop';
import { CustomImageUpload } from '../ui/CustomImageUpload';
import toast from 'react-hot-toast';

const CroppableImageField = ({
  label,
  aspect,
  onFileCropped,
  defaultPreviewUrl = null,
  onRemove
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (defaultPreviewUrl) {
      setPreview(`${process.env.REACT_APP_IMG_PATH}/${defaultPreviewUrl}`);
    } else {
      setPreview(null);
    }
  }, [defaultPreviewUrl]);

  const onFileChange = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
        setIsCropperOpen(true);
      };
      onFileCropped(null);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      onFileCropped(null);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSaveCrop = async () => {
    try {
      const croppedImageFile = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        'cropped-image.jpeg'
      );
      onFileCropped(croppedImageFile);
      setPreview(URL.createObjectURL(croppedImageFile));
      closeModal();
    } catch (e) {
      toast.error('Error cropping image. ' + (e.data?.message || 'Please try again.'));
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onFileCropped('DELETE');
    if (inputRef.current) {
      inputRef.current.value = '';
    }

    if (onRemove) {
      onRemove();
    }
  };

  const closeModal = () => {
    setIsCropperOpen(false);
    setImageSrc(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="mb-4 w-full">
      <div className="flex items-center gap-4">
        <CustomImageUpload
          id={`croppable-upload-${label}`}
          label={label}
          currentImage={preview}
          onChange={onFileChange}
          maxFileSize={5 * 1024 * 1024}
          aspect={aspect}
          ref={inputRef}
        />
      </div>

      {preview && (
        <button
          type="button"
          onClick={handleRemoveImage}
          className="mt-2 text-red-600 hover:text-red-800 flex items-center gap-2 text-sm">
          <FontAwesomeIcon icon={faTrash} />
          Remove Image
        </button>
      )}

      <Transition appear show={isCropperOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-[60]" onClose={closeModal}>
          <TransitionChild
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/50" />
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
                <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center">
                    Potong Gambar
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </DialogTitle>
                  <div className="mt-4 relative w-full h-80 bg-gray-200">
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={aspect}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Zoom</label>
                    <input
                      type="range"
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      aria-labelledby="Zoom"
                      onChange={(e) => setZoom(e.target.value)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCrop}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90">
                      <FontAwesomeIcon icon={faCropAlt} className="mr-2" />
                      Simpan & Potong
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default CroppableImageField;
