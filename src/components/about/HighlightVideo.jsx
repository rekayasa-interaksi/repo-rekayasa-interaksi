import React from 'react';
import { images } from '../../constants/imageConstant';

const HighlightVideo = () => {
  return (
    <div className="bg-accent m-6 rounded-3xl overflow-hidden relative h-[80vh]">
      <img src={images.img_about_3} alt="highlight" className="w-full h-full object-cover" />
      <div className="absolute bottom-6 left-6 text-white px-4 py-2 rounded-lg max-w-[80%] ">
        <p className="text-xl md:text-2xl">#DigistarCLub</p>
        <p className="text-5xl md:text-6xl font-semibold">
          Learn, Grow & <br /> Contribute to Indonesia
        </p>
      </div>
    </div>
  );
};

export default HighlightVideo;
