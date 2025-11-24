import React, { useState, useEffect } from 'react';
import ProfileHeader from '../components/profile/ProfileHeader';
import Sidebar from '../components/profile/Sidebar';
import MainContent from '../components/profile/MainContent';
import Navbar from '../components/core/Navbar';
import Footer from '../components/core/Footer';
import { useUserProfile } from '../hooks/member.hooks';
import { ProfileSkeleton } from '../components/ui/SkeletonLoad';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import ErrorCard from '../components/ui/ErrorCard';
import UpdateProfileModal from '../components/profile/UpdateProfileModal';
import UpdateBioModal from '../components/profile/UpdateBioModal';
import UpdateSosmed from '../components/profile/UpdateSosmedModal';
import ResetPasswordModal from '../components/profile/ResetPasswordModal';

const Profile = () => {
  const { isAuthenticated } = useAuth();
  const { userProfile, isLoading, error, refetch } = useUserProfile();
  const [isUpdateProfileModalOpen, setIsUpdateProfileModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [isSosmedModalOpen, setIsSosmedModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (isLoading || isAuthenticated === null) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <ProfileSkeleton count={8} />
      </div>
    );
  }

  if (error) {
    return <ErrorCard message="Error loading events" onRetry={refetch} />;
  }

  return (
    <div className="min-h-screen max-w-screen overflow-hidden ">
      <Navbar
        textColor="text-dark"
        buttonColor="secondary"
        barsColor="text-gray-700"
        applyImageFilter={false}
      />

      <ProfileHeader
        user={userProfile}
        onEditClick={() => setIsUpdateProfileModalOpen(true)}
        onResetPw={() => setIsResetPasswordModalOpen(true)}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6 py-4 px-6 md:px-8 xl:px-12">
        <div className="col-span-1 lg:col-span-2 xl:col-span-3">
          <MainContent />
        </div>
        <div className="col-span-1 lg:col-span-1 lg:order-last">
          <Sidebar
            user={userProfile}
            onEditBio={() => setIsBioModalOpen(true)}
            onEditSosmed={() => setIsSosmedModalOpen(true)}
          />
        </div>
      </div>
      <UpdateProfileModal
        isOpen={isUpdateProfileModalOpen}
        onClose={() => setIsUpdateProfileModalOpen(false)}
        user={userProfile}
        onSuccess={refetch}
      />
      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        user={userProfile}
      />
      <UpdateBioModal
        isOpen={isBioModalOpen}
        onClose={() => setIsBioModalOpen(false)}
        user={userProfile}
        onSuccess={refetch}
      />
      <UpdateSosmed
        isOpen={isSosmedModalOpen}
        onClose={() => setIsSosmedModalOpen(false)}
        user={userProfile}
        onSuccess={refetch}
      />
      <Footer />
    </div>
  );
};

export default Profile;
