import React, { createContext, useContext, useReducer, useMemo } from 'react';
import { useAllCampuses } from '../hooks/campus.hooks';
import { useAllStudentChapters } from '../hooks/chapter.hooks';
import { useAllProgramAlumni, useAllDomiciles } from '../hooks/member.hooks';
import { useAllMajors } from '../hooks/major.hooks';

const RegisterFormContext = createContext();

const initialState = {
  formData: {
    email: '',
    name: '',
    phone: '',
    birthday: '',
    gender: '',
    domisili_id: '',
    domisili_name: '',
    program_alumni_id: '',
    student_chapter_id: '',
    status: '',
    student_campus_id: '',
    student_campus_name: '',
    major_campus_id: '',
    major_campus_name: '',
    linkedin: '',
    instagram: '',
    telegram: '',
    terms: false
  },
  password: '',
  confirmPassword: '',
  passwordStrength: 0,
  otp: '',
  otpSent: false,
  isEmailVerified: false
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.name]: action.payload.value
        }
      };
    case 'SET_PASSWORD':
      let score = 0;
      if (action.payload.length >= 8) score++;
      if (/[A-Z]/.test(action.payload)) score++;
      if (/[0-9]/.test(action.payload)) score++;
      if (/[^A-Za-z0-9]/.test(action.payload)) score++;
      return { ...state, password: action.payload, passwordStrength: score };
    case 'SET_CONFIRM_PASSWORD':
      return { ...state, confirmPassword: action.payload };
    case 'SET_OTP':
      return { ...state, otp: action.payload };
    case 'SET_OTP_SENT':
      return { ...state, otpSent: action.payload };
    case 'RESET_EMAIL':
      return {
        ...state,
        isEmailVerified: false,
        otpSent: false,
        otp: '',
        formData: { ...state.formData, email: action.payload }
      };
    case 'SET_EMAIL_VERIFIED':
      return { ...state, isEmailVerified: true, otpSent: false, otp: '' };
    case 'RESET_FORM':
      return initialState;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export const RegisterFormProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { campuses, isLoading: campusLoading } = useAllCampuses();
  const { chapters, isLoading: chapterLoading } = useAllStudentChapters();
  const { programAlumni, isLoading: alumniLoading } = useAllProgramAlumni();
  const { domiciles, isLoading: domicileLoading } = useAllDomiciles();
  const { majors, isLoading: majorLoading } = useAllMajors();

  const alumniOptions = useMemo(
    () => programAlumni?.map((al) => ({ value: al.id, label: al.name })) || [],
    [programAlumni]
  );
  const chapterOptions = useMemo(
    () => chapters?.map((c) => ({ value: c.id, label: c.institute })) || [],
    [chapters]
  );
  const campusOptions = useMemo(() => {
    const list = campuses?.map((c) => ({ value: c.id, label: c.institute })) || [];
    return [...list, { value: 'other', label: 'Other' }];
  }, [campuses]);
  const domicileOptions = useMemo(() => {
    const list = domiciles?.map((d) => ({ value: d.id, label: d.domisili })) || [];
    return [...list, { value: 'other', label: 'Other' }];
  }, [domiciles]);
  const majorOptions = useMemo(() => {
    const list = majors?.map((m) => ({ value: m.id, label: m.major })) || [];
    return [...list, { value: 'other', label: 'Other' }];
  }, [majors]);

  const statusOptions = [
    { value: 'mahasiswa/siswi', label: 'Mahasiswa/Siswi' },
    { value: 'fresh graduate', label: 'Fresh Graduate' },
    { value: 'bekerja', label: 'Bekerja' }
  ];

  const isStepValid = (step) => {
    const { formData, password, confirmPassword, isEmailVerified } = state;
    switch (step) {
      case 1:
        return isEmailVerified && password && confirmPassword && password === confirmPassword;
      case 2:
        return (
          formData.name &&
          formData.phone &&
          formData.birthday &&
          formData.gender &&
          formData.domisili_id &&
          (formData.domisili_id !== 'other' || formData.domisili_name)
        );
      case 3:
        return (
          formData.status &&
          formData.student_campus_id &&
          (formData.student_campus_id !== 'other' || formData.student_campus_name) &&
          formData.major_campus_id &&
          (formData.major_campus_id !== 'other' || formData.major_campus_name)
        );
      case 4:
        return formData.terms;
      default:
        return false;
    }
  };

  const value = {
    state,
    dispatch,
    isStepValid,
    dropdowns: {
      alumniOptions,
      chapterOptions,
      campusOptions,
      domicileOptions,
      majorOptions,
      statusOptions
    },
    loadings: {
      campusLoading,
      chapterLoading,
      alumniLoading,
      domicileLoading,
      majorLoading
    }
  };

  return <RegisterFormContext.Provider value={value}>{children}</RegisterFormContext.Provider>;
};

export const useRegisterForm = () => {
  const context = useContext(RegisterFormContext);
  if (context === undefined) {
    throw new Error('useRegisterForm must be used within a RegisterFormProvider');
  }
  return context;
};
