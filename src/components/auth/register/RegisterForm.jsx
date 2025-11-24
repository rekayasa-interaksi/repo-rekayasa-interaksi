import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import { RegisterFormProvider, useRegisterForm } from '../../../context/registerFormContext';
import { useRegisterMember } from '../../../hooks/member.hooks';
import { SuccessModal } from './SuccessModal';
import { StepIndicator } from '../../../components/ui/StepIndicator';

import { Step1 } from './Step';
import { Step2 } from './Step';
import { Step3 } from './Step';
import { Step4 } from './Step';

const RegisterFormContent = () => {
  const [step, setStep] = useState(1);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const { state, dispatch, isStepValid } = useRegisterForm();
  const { executeRegister, isLoading: registering } = useRegisterMember();

  const nextStep = () => {
    if (isStepValid(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
    } else {
      toast.error('Please complete all required fields correctly.');
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStepValid(1) || !isStepValid(2) || !isStepValid(3) || !isStepValid(4)) {
      return toast.error('Some steps are incomplete. Please go back and check.');
    }

    try {
      const { formData, password } = state;
      const payload = {
        ...formData,
        password,

        social_media: {
          instagram: formData.instagram || null,
          linkedin: formData.linkedin || null,
          telegram: formData.telegram || null
        },

        ...(formData.domisili_id === 'other'
          ? { domisili_name: formData.domisili_name, domisili_id: null }
          : { domisili_id: formData.domisili_id, domisili_name: null }),

        ...(formData.student_campus_id === 'other'
          ? { student_campus_name: formData.student_campus_name, student_campus_id: null }
          : { student_campus_id: formData.student_campus_id, student_campus_name: null }),

        ...(formData.major_campus_id === 'other'
          ? { major_campus_name: formData.major_campus_name, major_campus_id: null }
          : { major_campus_id: formData.major_campus_id, major_campus_name: null })
      };

      if (payload.student_campus_id !== 'other') delete payload.student_campus_name;
      if (payload.major_campus_id !== 'other') delete payload.major_campus_name;
      if (payload.domisili_id !== 'other') delete payload.domisili_name;
      if (!payload.program_alumni_id) {
        delete payload.program_alumni_id;
      }
      if (!payload.student_chapter_id) {
        delete payload.student_chapter_id;
      }

      delete payload.instagram;
      delete payload.linkedin;
      delete payload.telegram;
      delete payload.terms;

      await executeRegister(payload);
      toast.success('Registration successful!');

      dispatch({ type: 'RESET_FORM' });
      setStep(1);
      setIsSuccessModalOpen(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="w-full px-8 py-12 scrollbar-hide border p-8 rounded-2xl shadow-lg bg-white">
      <h2 className="text-xl md:text-2xl font-semibold text-primary mb-1">Create Account</h2>
      <p className="text-xs text-gray-500 mb-6">
        Please enter your details to create a new account.
      </p>

      <StepIndicator currentStep={step} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-content">
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
          {step === 4 && <Step4 />}
        </div>

        <div className="flex justify-end items-center">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className="mr-4 text-xs font-semibold text-gray-600 py-2.5 px-6 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:hover:bg-transparent">
            Previous
          </button>

          {step < 4 && (
            <button
              type="button"
              onClick={nextStep}
              disabled={!isStepValid(step)}
              className="text-xs font-semibold text-white bg-orange-600 py-2.5 px-8 rounded-full hover:bg-orange-700 transition-colors disabled:bg-gray-400">
              Next
            </button>
          )}

          {step === 4 && (
            <button
              type="submit"
              disabled={registering || !isStepValid(4)}
              className="text-xs font-semibold text-white bg-orange-600 py-2.5 px-8 rounded-full hover:bg-orange-700 transition-colors disabled:bg-gray-400">
              {registering ? 'Submitting...' : 'Register'}
            </button>
          )}
        </div>
      </form>

      <p className="text-xs text-center text-gray-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-secondary font-semibold hover:underline">
          Login here
        </Link>
      </p>

      <SuccessModal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} />
    </div>
  );
};

const RegisterForm = () => {
  return (
    <RegisterFormProvider>
      <RegisterFormContent />
    </RegisterFormProvider>
  );
};

export default RegisterForm;
