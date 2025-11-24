import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faShieldAlt, faKey } from '@fortawesome/free-solid-svg-icons';
import { LuBadgeCheck } from 'react-icons/lu';

const ProfileHeader = ({ user, onEditClick, onResetPw }) => {
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  const isDigistar = ((user?.unique_number || user?.id || '') + '')
    .toLowerCase()
    .includes('digistar');

  return (
    <div className="mt-16 px-4">
      <div className=" bg-gray-800 shadow-xl rounded-2xl overflow-visible">
        {user.image_cover_path ? (
          <img
            src={`${process.env.REACT_APP_IMG_PATH}/${user.image_cover_path}`}
            alt="Cover"
            className="w-full h-48 object-cover rounded-t-2xl"
          />
        ) : (
          <div className="relative h-48 w-full bg-cover bg-center bg-background bg-repeat bg-[url('../../assets/images/pattern.webp')] rounded-t-2xl"></div>
        )}
        <div className="relative p-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
              <div className="relative -mt-20 z-10 w-28 h-28  bg-primary rounded-full flex items-center justify-center border-4  border-gray-800 shadow-lg">
                {user.image_profile_path ? (
                  <img
                    src={`${process.env.REACT_APP_IMG_PATH}/${user.image_profile_path}`}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-5xl font-bold text-white">{userInitial}</span>
                )}
              </div>

              <div className="mt-4 sm:mt-0 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-white inline-block relative">
                  {user?.name || 'User Name'}
                  {isDigistar && (
                    <span
                      title="Digistar member"
                      className="absolute top-0 -right-6 text-white text-xs font-semibold rounded-full shadow-md">
                      <LuBadgeCheck className="w-4 h-4" />
                    </span>
                  )}
                </h1>
                <p className=" text-md text-gray-400"> {user?.unique_number || 'Loading ID...'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 sm:mt-0">
              <div className="flex items-center gap-2 text-sm font-medium  bg-green-900 text-green-200 px-3 py-1.5 rounded-full">
                <FontAwesomeIcon icon={faShieldAlt} />
                <span>{user?.level || 'Standard'}</span>
              </div>

              <button
                onClick={onEditClick}
                className="flex items-center gap-2 bg-gray-700 text-gray-100 font-medium px-4 py-1.5 rounded-lg text-sm hover:bg-gray-600 transition-colors">
                <FontAwesomeIcon icon={faEdit} className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={onResetPw}
                className="flex items-center gap-2 bg-gray-700 text-gray-100 font-medium px-4 py-1.5 rounded-lg text-sm hover:bg-gray-600 transition-colors">
                <FontAwesomeIcon icon={faKey} className="w-3.5 h-3.5" />
                <span>Reset Password</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
