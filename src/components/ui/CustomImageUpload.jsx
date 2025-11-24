import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export const CustomImageUpload = ({
  id,
  label,
  onChange,
  currentImage,
  maxFileSize = 1048576,
  aspect = 1,
  allowedTypes = ['image/jpeg', 'image/png']
}) => {
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    let objectUrl = null;

    if (currentImage instanceof File) {
      objectUrl = URL.createObjectURL(currentImage);
      setPreview(objectUrl);
    } else {
      setPreview(currentImage);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [currentImage]);

  const handleFileChange = (file) => {
    if (file) {
      if (file.size > maxFileSize) {
        toast.error(`File size exceeds ${maxFileSize / (1024 * 1024)} MB limit.`);
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only JPEG and PNG images are allowed.');
        return;
      }
      onChange(file);
    } else {
      setPreview(null);
      onChange(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const aspectClass = aspect === 1 ? 'aspect-square' : 'aspect-[3/1]';

  return (
    <div className="mb-4 w-full">
      <label htmlFor={id} className="block text-gray-500 text-sm mb-2">
        {label}
      </label>
      <div
        className={`relative w-full ${aspectClass} border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer transition-colors
          ${
            isDragging
              ? 'border-primary bg-primary-light'
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }
        `}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}>
        <input
          id={id}
          type="file"
          accept={allowedTypes.join(',')}
          ref={fileInputRef}
          onChange={(e) => handleFileChange(e.target.files[0])}
          className="hidden"
        />

        {preview ? (
          <>
            <img
              src={preview}
              alt={
                label
                  ? label.replace(/\b(image|photo|picture)\b/gi, '').trim() || 'Uploaded file'
                  : 'Uploaded file'
              }
              className="h-full w-full object-contain rounded-md"
            />
          </>
        ) : (
          <div className={`text-center text-gray-500 `}>
            <FontAwesomeIcon icon={faCloudUploadAlt} className="text-4xl mb-2" />
            <p className="font-semibold text-sm">Drag & drop your image here</p>
            <p className="text-xs">
              or click to select a file <br /> (JPEG/PNG)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
