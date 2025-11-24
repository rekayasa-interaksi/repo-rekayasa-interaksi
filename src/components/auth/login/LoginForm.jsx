import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useLogin } from '../../../hooks/auth.hook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { TextField } from '../../ui/Textfield';

const LoginForm = () => {
  const navigate = useNavigate();
  const { executeLogin, isLoading, error } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const payload = { email, password, remember_me: rememberMe };
      
      const data = await executeLogin(payload);

      if (data) {
        toast.success('Login Successful');
        navigate(-1);
      }
    } catch (err) {
      toast.error('Login Failed. ' + (err.data?.message || 'Please check your credentials.'));
    }
  };

  return (
    <div className="w-full border px-8 py-12 rounded-2xl shadow-lg bg-white">
      <div className="flex justify-start items-start flex-col">
        <h2 className="text-xl md:text-2xl font-semibold text-primary mb-1">Hello, Sobat   MinClub!</h2>
        <h4 className="text-xs text-gray-500 mb-8">
          Please enter your details to log in to your account.
        </h4>
      </div>
      <form onSubmit={handleLogin} noValidate className="space-y-5">
        <TextField
          id="email"
          type="email"
          label="Email or Digistar ID"
          placeholder="e.g., you@example.com or digistar-123"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          color="default"
          required
        />

        <TextField
          id="password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          color="default"
          required
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 text-sm hover:text-gray-700"
              title={showPassword ? 'Hide password' : 'Show password'}>
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </button>
          }
        />

        {error && (
          <p className="text-red-500 text-sm text-center !mt-4">
            Login failed. Please check your credentials.
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-3 w-3 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-500">
              Keep me signed in
            </label>
          </div>
          <div className="text-xs font-semibold">
            <Link to="/forgot-password" className="font-medium text-secondary hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading || !email || !password}
          className="w-full bg-secondary text-white text-sm font-medium py-2.5 rounded-full hover:bg-secondary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 !mt-6">
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <p className="text-xs text-start text-gray-500 ">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-secondary text-xs font-semibold hover:underline">
            Register
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
