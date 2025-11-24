import React, { useState } from 'react';
import { TextField } from '../ui/Textfield';
import TaCModal from '../core/TaCModal';
import { useAuth } from '../../context/authContext';
import toast from 'react-hot-toast';

import { useSubmitHelpRequest } from '../../hooks/help.hooks';

const initialForm = {
  email: '',
  message: ''
};

export default function HelpForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isTaCModalOpen, setIsTaCModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const { executeSubmitHelpRequest, isLoading } = useSubmitHelpRequest();

  const handleAgree = () => {
    setIsTaCModalOpen(false);
  };

  const handleClose = () => {
    setIsTaCModalOpen(false);
  };

  const validate = () => {
    const e = {};

    if (!isAuthenticated) {
      if (!form.email.trim()) e.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format';
    }
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const dataToSend = {
        question: form.message,

        ...(!isAuthenticated && { email: form.email })
      };

      await executeSubmitHelpRequest(dataToSend);

      setForm(initialForm);
      setErrors({});
      toast.success('Message sent successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <div className="relative bg-white font-sans max-w-6xl mx-auto my-10 p-8 sm:p-12 rounded-lg shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="flex flex-col justify-start">
          <p className="text-2xl font-bold text-secondary">Contact Us</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 my-4">
            Tell us about your questions or problems
          </h2>
          <p className="text-gray-600 text-base leading-relaxed mb-6">
            Our team is ready to assist you. Whether you have questions about our services, need
            technical support, or want to provide feedback, we're here to help.
          </p>
        </div>

        <div>
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
            {!isAuthenticated && (
              <div>
                <TextField
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </div>
            )}

            <div>
              <TextField
                name="message"
                placeholder="Message"
                multiline={true}
                rows={8}
                value={form.message}
                onChange={handleChange}
                disabled={isLoading}
                error={!!errors.message}
                helperText={errors.message}
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 mt-2">
              <p className="text-xs text-gray-500 max-w-sm">
                By clicking Submit you agree to our{' '}
                <button
                  type="button"
                  onClick={() => setIsTaCModalOpen(true)}
                  className="underline hover:text-primary">
                  Privacy Policy
                </button>
                .
              </p>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto flex-shrink-0 px-8 py-3 bg-primary text-white font-semibold rounded-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50">
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <TaCModal open={isTaCModalOpen} onClose={handleClose} onAgree={handleAgree} />
    </div>
  );
}
