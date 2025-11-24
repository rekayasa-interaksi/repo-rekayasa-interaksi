import React from 'react';
import { images } from '../../constants/imageConstant';

const Galery = () => {
  return (
    <div className="col-span-6 row-span-9 bg-gray-200 rounded-2xl">
      <img
        src={images.img_login}
        alt="highlight"
        className="w-full h-full object-cover rounded-xl ]"
      />
    </div>
  );
};

export default Galery;
