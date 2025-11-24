import React from 'react';
import { images } from '../../constants/imageConstant';

const Header = ({ title, highlight, subtitle, imageMain }) => {
  return (
    <div
      className="h-[60vh] pt-16 relative bg-primary md:m-6 md:rounded-3xl overflow-hidden flex items-center"
      style={{
        backgroundImage: `url(${require('../../assets/images/pattern-biru.png')})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}>
      <div className="px-6 md:px-20 text-white max-w-screen md:max-w-[55vw]">
        <h1 className="text-4xl md:text-5xl 2xl:text-7xl font-semibold leading-tight line-clamp-2 break-words">
          {title} <span className="text-secondary">{highlight}</span>
        </h1>
        <img
          loading="lazy"
          src={imageMain}
          alt="decorative line"
          className="w-[80%] md:w-[90%] max-w-80 object-cover mt-2"
        />
        <p className="mt-6 text-base lg:text-lg/relaxed text-gray-300">{subtitle}</p>
      </div>

      <div className="hidden lg:inline-block">
        <div className="absolute z-10 -bottom-40 right-16 rotate-[15deg] scale-[2.2]">
          <img
            loading="lazy"
            src={images.star_1}
            alt="star decoration"
            className="w-[25vw] object-contain"
          />
        </div>
        <div className="absolute z-20 -bottom-36 right-8 rotate-[55deg] scale-[2.2]">
          <img
            loading="lazy"
            src={images.star_2}
            alt="secondary star decoration"
            className="w-[25vw] object-contain"
          />
        </div>
        <div className="absolute z-30 bottom-0 right-0">
          <img
            loading="lazy"
            src={images.event_header}
            alt="event illustration"
            className="w-[40vw] max-w-[48rem] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
