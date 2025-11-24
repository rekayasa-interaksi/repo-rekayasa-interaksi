import React, { useState } from 'react';
import { useRegisterForm } from '../../../context/registerFormContext';
import { useSendOtp, useVerifyOtp, useOtpTimer } from '../../../hooks/otp.hooks';
import { TextField } from '../../ui/Textfield';
import toast from 'react-hot-toast';
import { Dropdown } from '../../ui/Dropdown';
import { RadioGroup } from '../../ui/RadioButton';
import { Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEyeSlash,
  faInfoCircle,
  faCheck,
  faX,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faTelegram, faInstagram } from '@fortawesome/free-brands-svg-icons';
import TaCModal from '../../core/TaCModal';

export const Step1 = () => {
  const { state, dispatch } = useRegisterForm();
  const { formData, password, confirmPassword, passwordStrength, otp, otpSent, isEmailVerified } =
    state;

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [isHintVisible, setIsHintVisible] = useState(false);

  const { time: otpTimer, start: startOtpTimer, reset: resetOtpTimer } = useOtpTimer();
  const { executeVerification: sendOtpApi, isLoading: sendingOtp } = useSendOtp();
  const { executeVerification: verifyOtpApi, isLoading: verifyingOtp } = useVerifyOtp();

  const handleEmailChange = (e) => {
    dispatch({ type: 'RESET_EMAIL', payload: e.target.value });
    resetOtpTimer();
  };

  const sendOtp = async () => {
    if (!formData.email) return toast.error('Enter your email first');
    try {
      await sendOtpApi({
        email: formData.email,
        type: 'register',
      });
      dispatch({ type: 'SET_OTP_SENT', payload: true });

      startOtpTimer();
      toast.success(`OTP sent to ${formData.email}`);
    } catch (err) {
      if (err?.data?.message === 'Email already verified') {
        dispatch({ type: 'SET_EMAIL_VERIFIED', payload: true });
        toast.success('Email already verified');
      } else {
        console.log(err);
        toast.error(err?.data?.message || 'Failed to send OTP');
      }
    }
  };
  const verifyOtp = async () => {
    if (!otp) return toast.error('Enter OTP');
    try {
      await verifyOtpApi(formData.email, otp, 'register');
      dispatch({ type: 'SET_EMAIL_VERIFIED', payload: true });
      toast.success('Email verified!');
    } catch {
      toast.error('Invalid OTP');
    }
  };

  return (
    <div className="space-y-4">
      <TextField
        name="email"
        placeholder="Enter your email address"
        label="Email Address *"
        value={formData.email}
        onChange={handleEmailChange}
        disabled={isEmailVerified}
        endAdornment={
          <button
            type="button"
            className={`text-xs font-semibold  ${
              isEmailVerified
                ? 'cursor-default text-green-500'
                : 'text-secondary hover:text-secondary/70'
            }`}
            onClick={sendOtp}
            disabled={sendingOtp || otpTimer > 0 || !formData.email}>
            {isEmailVerified ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : sendingOtp ? (
              'Sending...'
            ) : otpTimer > 0 ? (
              `Resend in ${otpTimer}s `
            ) : otpSent ? (
              <div className="">
                Resend OTP
                <FontAwesomeIcon icon={faPaperPlane} className="ml-2" />
              </div>
            ) : (
              <div className="">
                Send OTP
                <FontAwesomeIcon icon={faPaperPlane} className="ml-2" />
              </div>
            )}
          </button>
        }
      />
      {otpSent && !isEmailVerified && (
        <TextField
          value={otp}
          onChange={(e) => dispatch({ type: 'SET_OTP', payload: e.target.value })}
          placeholder="Enter OTP"
          required
          endAdornment={
            <button
              type="button"
              onClick={verifyOtp}
              disabled={verifyingOtp}
              className="text-xs font-semibold text-secondary hover:text-secondary/70">
              {verifyingOtp ? 'Verifying...' : 'Verify'}
            </button>
          }
        />
      )}
      <TextField
        type={showPwd ? 'text' : 'password'}
        value={password}
        placeholder="Enter Password"
        required
        disabled={!isEmailVerified}
        label="Password *"
        onChange={(e) => dispatch({ type: 'SET_PASSWORD', payload: e.target.value })}
        endAdornment={
          <button disabled={!isEmailVerified} onClick={() => setShowPwd((prev) => !prev)}>
            <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} />
          </button>
        }
      />
      {password && (
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
            <FontAwesomeIcon icon={faInfoCircle} className="text-gray-400 cursor-pointer" />

            <Transition
              show={isHintVisible}
              as={React.Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1">
              <div className="absolute z-10 bottom-full right-0 mb-2 w-64 p-3 bg-gray-800 text-white text-xs text-center rounded-md shadow-lg">
                Password must be 8+ characters, include uppercase, number, and special character.
                <div className="absolute top-full right-1 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
              </div>
            </Transition>
          </div>
        </div>
      )}
      <TextField
        type={showConfirmPwd ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(e) => dispatch({ type: 'SET_CONFIRM_PASSWORD', payload: e.target.value })}
        placeholder="Confirm Password"
        required
        disabled={!isEmailVerified}
        label="Confirm Password *"
        endAdornment={
          <button disabled={!isEmailVerified} onClick={() => setShowConfirmPwd((prev) => !prev)}>
            <FontAwesomeIcon icon={showConfirmPwd ? faEyeSlash : faEye} />
          </button>
        }
      />
      {confirmPassword && (
        <p
          className={`mt-1 text-xs ${
            confirmPassword === password ? 'text-green-600' : 'text-red-600'
          }`}>
          {confirmPassword === password ? (
            <div className="">
              <FontAwesomeIcon icon={faCheck} className="mr-2" />
              Passwords match
            </div>
          ) : (
            <div className="">
              <FontAwesomeIcon icon={faX} className="mr-2" />
              Passwords do not match
            </div>
          )}
        </p>
      )}
    </div>
  );
};

// =====================================================================================================

export const Step2 = () => {
  const { state, dispatch, dropdowns, loadings } = useRegisterForm();
  const handleChange = (e) => dispatch({ type: 'SET_FIELD', payload: e.target });
  const { formData } = state;
  const handleDropdownChange = (name, value) => {
    dispatch({ type: 'SET_FIELD', payload: { name, value } });
  };
  const { domicileOptions } = dropdowns;
  const { domicileLoading } = loadings;

  const genderOptions = [
    { label: 'Male', value: 'L' },
    { label: 'Female', value: 'P' }
  ];

  return (
    <div className="space-y-4">
      <TextField
        name="name"
        value={state.formData.name}
        onChange={handleChange}
        placeholder="Enter your full name"
        label="Full Name *"
        required
      />
      <TextField
        name="phone"
        value={state.formData.phone}
        onChange={handleChange}
        placeholder="Enter your phone number"
        label="Phone Number *"
        required
      />
      <RadioGroup
        title="Gender *"
        name="gender"
        options={genderOptions}
        value={formData.gender}
        onChange={handleChange}
      />
      <TextField
        name="birthday"
        type="date"
        value={state.formData.birthday}
        onChange={handleChange}
        placeholder="Select your birthday"
        label="Birthday *"
        required
        onFocus={(e) => (e.target.type = 'date')}
        onBlur={(e) => (e.target.type = 'text')}
      />
      <Dropdown
        label="Domisili *"
        options={domicileOptions}
        loading={domicileLoading}
        value={formData.domisili_id}
        onValueChange={(v) => handleDropdownChange('domisili_id', v)}
        placeholder="Select Domisili"
        disabled={domicileLoading}
      />
      {formData.domisili_id === 'other' && (
        <TextField
          name="domisili_name"
          value={formData.domisili_name}
          onChange={(e) => dispatch({ type: 'SET_FIELD', payload: e.target })}
          placeholder="Enter your domicile name"
          label="Domicile Name *"
          required
        />
      )}
    </div>
  );
};

// =====================================================================================================

export const Step3 = () => {
  const { state, dispatch, dropdowns, loadings } = useRegisterForm();
  const { formData } = state;
  const { alumniOptions, chapterOptions, campusOptions, majorOptions, statusOptions } = dropdowns;
  const { alumniLoading, chapterLoading, campusLoading, majorLoading } = loadings;

  const handleDropdownChange = (name, value) => {
    dispatch({ type: 'SET_FIELD', payload: { name, value } });
  };

  return (
    <div className="space-y-4">
      <Dropdown
        label="Program Alumni"
        options={alumniOptions}
        loading={alumniLoading}
        value={formData.program_alumni_id}
        onValueChange={(v) => handleDropdownChange('program_alumni_id', v)}
        placeholder="Select Program Alumni"
        disabled={alumniLoading}
      />

      <Dropdown
        label="Chapter "
        options={chapterOptions}
        loading={chapterLoading}
        value={formData.student_chapter_id}
        onValueChange={(v) => handleDropdownChange('student_chapter_id', v)}
        placeholder="Select Chapter"
        disabled={chapterLoading}
      />

      <Dropdown
        label="Status *"
        options={statusOptions}
        // loading={}
        value={formData.status}
        onValueChange={(v) => handleDropdownChange('status', v)}
        placeholder="Select Status"
        // disabled={}
      />
     
      <Dropdown
        label="Institute / Campus *"
        options={campusOptions}
        loading={campusLoading}
        value={formData.student_campus_id}
        onValueChange={(v) => handleDropdownChange('student_campus_id', v)}
        placeholder="Select Institute / Campus"
        disabled={campusLoading}
      />

      {formData.student_campus_id === 'other' && (
        <TextField
          name="student_campus_name"
          value={formData.student_campus_name}
          onChange={(e) => dispatch({ type: 'SET_FIELD', payload: e.target })}
          placeholder="Enter your campus name"
          label="Campus Name *"
          required
        />
      )}

      <Dropdown
        label="Major *"
        options={majorOptions}
        loading={majorLoading}
        value={formData.major_campus_id}
        onValueChange={(v) => handleDropdownChange('major_campus_id', v)}
        placeholder="Select Major"
        disabled={majorLoading}
      />

      {formData.major_campus_id === 'other' && (
        <TextField
          name="major_campus_name"
          value={formData.major_campus_name}
          onChange={(e) => dispatch({ type: 'SET_FIELD', payload: e.target })}
          placeholder="Enter your major name"
          label="Major Name *"
          required
        />
      )}
    </div>
  );
};

// =====================================================================================================

export const Step4 = () => {
  const { state, dispatch } = useRegisterForm();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch({
      type: 'SET_FIELD',
      payload: { name, value: type === 'checkbox' ? checked : value }
    });
  };

  const [isTaCModalOpen, setIsTaCModalOpen] = useState(false);

  const handleAgree = () => {
    dispatch({ type: 'SET_FIELD', payload: { name: 'terms', value: true } });
    setIsTaCModalOpen(false);
  };

  const handleClose = () => {
    setIsTaCModalOpen(false);
  };

  return (
    <React.Fragment>
      <div className="space-y-4">
        <TextField
          name="instagram"
          value={state.formData.instagram}
          onChange={handleChange}
          placeholder="Enter your Instagram Username"
          label="Instagram Username"
          startAdornment={<FontAwesomeIcon icon={faInstagram} className="text-pink-500" />}
        />
        <TextField
          name="linkedin"
          value={state.formData.linkedin}
          onChange={handleChange}
          placeholder="Enter your LinkedIn profile URL"
          label="LinkedIn Profile URL"
          startAdornment={<FontAwesomeIcon icon={faLinkedin} className="text-blue-700" />}
        />
        <TextField
          name="telegram"
          value={state.formData.telegram}
          onChange={handleChange}
          placeholder="Enter your Telegram Id"
          label="Telegram Id"
          startAdornment={<FontAwesomeIcon icon={faTelegram} className="text-blue-500" />}
        />
        <div className="flex items-center space-x-2">
          <input
            id="terms"
            type="checkbox"
            name="terms"
            checked={state.formData.terms}
            onChange={handleChange}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the{' '}
            <button
              type="button"
              onClick={() => setIsTaCModalOpen(true)}
              className="text-secondary hover:underline">
              Terms and Conditions
            </button>{' '}
            *
          </label>
        </div>
      </div>

      <TaCModal open={isTaCModalOpen} onClose={handleClose} onAgree={handleAgree} />
    </React.Fragment>
  );
};
