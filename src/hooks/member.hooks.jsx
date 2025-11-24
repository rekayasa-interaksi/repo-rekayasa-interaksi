import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getAllMembers,
  getAllProgramAlumni,
  getAllDomiciles,
  getUserProfile,
  updateUserProfile,
  getAchievements,
  getHistoryUser,
  getRegisteredUser,
  deleteUserProfileImage
} from '../services/member.api';
import { useAuth } from '../context/authContext';
import {
  registerMember,
} from '../services/auth.api';

// get all members with filters
export const useAllMembers = (filters = {}) => {
  const queryKey = ['members', filters];

  const queryFn = async () => {
    const response = await getAllMembers(filters);
    return response.data;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn
  });

  return {
    members: data?.data ?? [],
    metaData: data?.metaData ?? {},
    isLoading,
    error: isError ? error : null,
    refetch
  };
};

// register a new member
export const useRegisterMember = () => {
  const { mutateAsync, isPending, error, data } = useMutation({
    mutationFn: async (memberData) => {
      const response = await registerMember(memberData);
      return response.data;
    }
  });

  return {
    executeRegister: mutateAsync,
    isLoading: isPending,
    error,
    data
  };
};

// get all program alumni
export const useAllProgramAlumni = () => {
  const queryKey = ['programAlumni'];

  const queryFn = async () => {
    const response = await getAllProgramAlumni();
    return response.data.data || [];
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn
  });

  return {
    programAlumni: data || [],
    isLoading,
    error: isError ? error : null,
    refetch
  };
};

// get all domiciles
export const useAllDomiciles = () => {
  const queryKey = ['domiciles'];

  const queryFn = async () => {
    const response = await getAllDomiciles();
    return response.data.data || [];
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn
  });

  return {
    domiciles: data || [],
    isLoading,
    error: isError ? error : null,
    refetch
  };
};

// get user profile
export const useUserProfile = () => {
  const queryKey = ['userProfile'];
  const { isAuthenticated } = useAuth();

  const queryFn = async () => {
    const response = await getUserProfile();
    return response.data.data || {};
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn,
    enabled: !!isAuthenticated
  });

  return {
    userProfile: data || {},
    isLoading,
    error: isError ? error : null,
    refetch
  };
};

// update user profile
export const useUpdateUserProfile = () => {
  const { mutateAsync, isPending, error, data } = useMutation({
    mutationFn: async (profileData) => {
      const response = await updateUserProfile(profileData);
      return response.data;
    }
  });

  return {
    executeUpdateProfile: mutateAsync,
    isLoading: isPending,
    error,
    data
  };
};

// delete user profile image
export const useDeleteUserProfileImage = () => {
  const { mutateAsync, isPending, error, data } = useMutation({
    mutationFn: async (imageType) => {
      const response = await deleteUserProfileImage(imageType);
      return response.data;
    }
  });

  return {
    executeDeleteProfileImage: mutateAsync,
    isLoading: isPending,
    error,
    data
  };
}

// get user achievements
export const useUserAchievements = () => {
  const queryKey = ['userAchievements'];
  const { isAuthenticated } = useAuth();

  const queryFn = async () => {
    const response = await getAchievements();
    return response.data.data || [];
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn,
    enabled: !!isAuthenticated
  });

  return {
    achievements: data || [],
    isLoading,
    error: isError ? error : null,
    refetch
  };
};

// get user history
export const useUserHistory = () => {
  const queryKey = ['userHistory'];
  const { isAuthenticated } = useAuth();

  const queryFn = async () => {
    const response = await getHistoryUser();
    return response.data.data || [];
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn,
    enabled: !!isAuthenticated
  });

  return {
    history: data || [],
    isLoading,
    error: isError ? error : null,
    refetch
  };
};

// get user registered events
export const useUserRegisteredEvents = () => {
  const queryKey = ['userRegisteredEvents'];

  const queryFn = async () => {
    const response = await getRegisteredUser();
    return response.data.data || [];
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn
  });

  return {
    registeredEvents: data || [],
    isLoading,
    error: isError ? error : null,
    refetch
  };
};
