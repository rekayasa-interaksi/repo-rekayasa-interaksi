import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import LoginForm from '../components/auth/login/LoginForm';
import RegisterForm from '../components/auth/register/RegisterForm';
import ForgotPasswordForm from '../components/auth/forgot/ForgotPasswordForm';
import { images } from '../constants/imageConstant';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

const Auth = ({ mode = 'login' }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated === true) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const renderForm = () => {
    switch (mode) {
      case 'register':
        return <RegisterForm />;
      case 'forgotPassword':
        return <ForgotPasswordForm />;
      case 'login':
      default:
        return <LoginForm />;
    }
  };

  return (
    <div className="relative h-screen flex bg-white">
      <div className="w-full lg:w-2/5 flex flex-col justify-center items-center p-10 bg-white z-10">
        <div className="w-full max-w-lg flex flex-col justify-center items-center">
          {renderForm()}
        </div>
      </div>

      <div className="hidden lg:block w-3/5 relative m-6 ">
        <img
          src={images.img_login}
          loading="lazy"
          alt="workspace"
          className="rounded-3xl w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-28 h-14 bg-white rounded-tr-xl z-20 flex justify-end items-start pr-10 pt-4">
          <div className="absolute -top-8 -left-2 w-10 h-10 border-b-8 border-l-8 border-white rounded-bl-3xl"></div>
          <div className="absolute -bottom-2 -right-6 w-8 h-8 border-b-8 border-l-8 border-white rounded-bl-3xl"></div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-28 h-16 bg-white rounded-bl-xl z-20 flex justify-end items-start pr-10 pt-4">
        <div className="absolute -bottom-8 right-4 w-10 h-10 border-t-8 border-r-8 border-white rounded-tr-3xl"></div>
        <div className="absolute top-4 -left-6 w-8 h-8 border-t-8 border-r-8 border-white rounded-tr-3xl"></div>
        <Link
          to="/"
          className="flex text-xl h-10 w-12 rounded-lg items-center justify-center rounded-fulltext-black hover:scale-125 transition-all"
          aria-label="Back to Home">
          <FontAwesomeIcon icon={faHome} />
        </Link>
      </div>
    </div>
  );
};

export default Auth;
