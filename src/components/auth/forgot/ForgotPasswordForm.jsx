import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { useForgotPassword } from '../../../hooks/auth.hook';
import { useSendOtp, useOtpTimer } from '../../../hooks/otp.hooks';
import { TextField } from '../../ui/Textfield';
import SuccessModal from './SuccessModal';

const ForgotPasswordForm = () => {
  const { executeForgotPassword, isPending: isLoading, error: apiError } = useForgotPassword();
  const { executeVerification: sendOtpApi, isPending: sendingOtp } = useSendOtp();
  const { time: otpTimer, start: startOtpTimer } = useOtpTimer();
  const { time: resendTimer, start: startResendTimer } = useOtpTimer();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const sendOtp = async () => {
    if (sendingOtp || otpTimer > 0) return;
    if (!email) {
      toast.error('Please enter your email first.');
      return;
    }

    try {
      await sendOtpApi({ email, type: 'forgot-password' });
      toast.success(`OTP has been sent to ${email}`);
      setOtpSent(true);
      startOtpTimer();
    } catch (err) {
      toast.error(err.data?.message || 'Failed to send OTP.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email first.');
      return;
    }

    if (!token) {
      toast.error('Please enter your OTP/Token.');
      return;
    }

    try {
      await executeForgotPassword({ email, token });

      setSubmittedEmail(email);
      setIsModalOpen(true);
      startResendTimer();
    } catch (err) {
      toast.error(err.data?.message || 'Failed to send email.');
    }
  };

  const handleResendSubmit = async () => {
    if (resendTimer > 0 || isLoading) return;

    try {
      await executeForgotPassword({ email: submittedEmail, token });
      toast.success('Reset link sent successfully.');
      startResendTimer();
    } catch (err) {
      toast.error(err.data?.message || 'Failed to resend email.');
    }
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
  };

  return (
    <>
      <div className="w-full max-w-md p-6 rounded-lg shadow-md border">
        <Link
          to="/login"
          className="flex items-center gap-2 text-gray-500 font-medium hover:text-primary mb-8">
          <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
          Back
        </Link>
        <h2 className="text-3xl font-bold text-gray-800">Forgot password?</h2>
        <h4 className="text-gray-500 mt-2 mb-8">
          Enter your email address and we will send you a link to reset your password.
        </h4>

        <form noValidate onSubmit={handleSubmit}>
          <div className="mb-6">
            <TextField
              id="email"
              name="email"
              type="email"
              label="Alamat Email"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={handleEmailChange}
              required
              endAdornment={
                <button
                  type="button"
                  className={`text-xs font-semibold text-secondary`}
                  onClick={sendOtp}
                  disabled={sendingOtp || otpTimer > 0 || !email}>
                  {sendingOtp ? (
                    'Sending...'
                  ) : otpTimer > 0 ? (
                    `Resend in ${otpTimer}s`
                  ) : otpSent ? (
                    <div className="flex items-center gap-1 text-secondary">
                      Resend OTP
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-secondary">
                      Send OTP
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </div>
                  )}
                </button>
              }
              error={apiError ? apiError.data?.message || apiError.message : null}
            />
          </div>
          <TextField
            value={token}
            onChange={(e) => setToken(e.target.value)}
            label="OTP / Token"
            placeholder="Enter OTP/Token"
            required
            className="mb-6"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-600 text-white font-semibold py-3 rounded-full hover:bg-orange-700 transition-colors focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed">
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>

      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        email={submittedEmail}
        onResend={handleResendSubmit}
        isResending={isLoading}
        countdown={resendTimer}
        isResendDisabled={resendTimer > 0}
      />
    </>
  );
};

export default ForgotPasswordForm;
