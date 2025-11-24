import React from 'react';
import { HiOutlineInbox } from 'react-icons/hi';

const NotFoundCard = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center ">
      <HiOutlineInbox className="w-16 h-16 text-gray-600" />
      <h3 className="mt-4 text-xl font-semibold text-gray-300">Data Empty</h3>
      <p className="mt-2 text-gray-400">{message}</p>
    </div>
  );
};

export default NotFoundCard;
