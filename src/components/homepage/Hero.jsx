import React from 'react';
import powerRanger from '../../assets/images/Hero-Images.png';
import { images } from '../../constants/imageConstant';
import { ArrowUpRightIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="h-[80vh] 2xl:h-[95vh] md:h-[70vh] relative bg-primary md:m-6 md:rounded-3xl bg-[url('../../assets/images/pattern-biru.png')] overflow-hidden flex items-center">
      <div className="px-10 md:px-24 text-white">
        <h1 className="text-4xl md:text-5xl 2xl:text-7xl font-semibold ">
          Join with more <br />
          than <span className="text-secondary">5000+ </span> <br />
          <span className="text-orange-500">Digital Talent</span> in <br />
          Indonesia
        </h1>
        <img
          loading="lazy"
          src={images.line}
          alt="line"
          className="w-[55%] max-w-[25rem] object-cover mt-2"
        />
        <p className="mt-6 text-base lg:text-lg/relaxed md:max-w-[40vw] text-gray-300 max-w-md">
          A vibrant community awaits those ready for a new adventure! Join us to discover endless
          opportunities for growth and connection.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/about')}
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white text-white hover:bg-white hover:text-primary transition flex items-center justify-center gap-2">
            <span>Learn More</span>
            <ArrowUpRightIcon className="h-3 sm:h-4 w-3 sm:w-4" strokeWidth={6} />
          </button>
          {!isAuthenticated ? (
          <button
            onClick={() => navigate('/login')}
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition">
            Get Started
          </button>
          ) : null}
        </div>
      </div>

      <div className="hidden lg:inline-block">
        <div className="absolute z-20 -bottom-20 -right-12 -rotate-[30deg] scale-[1.6]">
          <img
            loading="lazy"
            src={images.star_1}
            alt="Power Ranger Dino Thunder"
            className="w-[50vw] max-w-[45vw] object-contain"
          />
        </div>
        <div className="absolute z-10 -bottom-32 -right-24 rotate-[10deg] scale-[1.7]">
          <img
            loading="lazy"
            src={images.star_2}
            alt="Power Ranger Dino Thunder"
            className="w-[50vw] max-w-[45vw] object-contain"
          />
        </div>
        <div className="absolute z-30 bottom-0 right-0">
          <img
            loading="lazy"
            src={powerRanger}
            alt="Power Ranger Dino Thunder"
            className="w-[45vw] max-w-[40vw] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
