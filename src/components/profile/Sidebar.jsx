import React from 'react';
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineAcademicCap,
  HiOutlineLibrary,
  HiOutlineBookmark,
  HiOutlineLocationMarker,
  HiOutlineIdentification,
  HiOutlineBriefcase,
  HiOutlinePencil,
  HiOutlineUser
} from 'react-icons/hi';
import { FaLinkedin, FaInstagram, FaTelegram } from 'react-icons/fa';

const getBioItems = (user = {}) => [
  {
    icon: <HiOutlineMail />,
    label: 'Email',
    value: user?.email || 'email not provided'
  },
  {
    icon: <HiOutlinePhone />,
    label: 'Telepon',
    value: user?.phone || 'phone not provided'
  },
  {
    icon: <HiOutlineUser />,
    label: 'Gender',
    value: user?.gender === 'L' ? 'Man' : 'Woman' || 'gender not provided'
  },
  {
    icon: <HiOutlineUser />,
    label: 'Birth Date',
    value: user?.birthday || 'birth date not provided'
  },
  {
    icon: <HiOutlineIdentification />,
    label: 'Status',
    value: user?.status || 'Status not provided'
  },
  {
    icon: <HiOutlineLibrary />,
    label: 'Institute/Universitas',
    value: user?.student_campus?.institute || 'university not provided'
  },
  {
    icon: <HiOutlineAcademicCap />,
    label: 'Jurusan',
    value: user?.major_campus?.major || 'major not provided'
  },
  {
    icon: <HiOutlineBookmark />,
    label: 'Chapter',
    value: user?.student_chapter?.institute || 'chapter not provided'
  },
  {
    icon: <HiOutlineBriefcase />,
    label: 'Program Alumni',
    value: user?.program_alumni?.name || 'program alumni not provided'
  },
  {
    icon: <HiOutlineLocationMarker />,
    label: 'Domisili',
    value: user?.domisili?.domisili || 'Domisili not provided'
  }
];

const getSocialItems = (user = {}) =>
  [
    {
      icon: <FaLinkedin size={20} />,
      label: user?.social_media?.linkedin || 'Linkedin not provided'
    },
    {
      icon: <FaInstagram size={20} />,
      label: user?.social_media?.instagram || 'Instagram not provided'
    },
    {
      icon: <FaTelegram size={20} />,
      label: user?.social_media?.telegram || 'Telegram not provided'
    }
  ];

const BioItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <span className="text-gray-400 mt-1">{React.cloneElement(icon, { size: 20 })}</span>
    <div className='min-w-0'>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-800 break-words">{value}</p>
    </div>
  </div>
);

const Sidebar = ({ user, onEditBio, onEditSosmed }) => {
  const bioItems = getBioItems(user);
  const socialItems = getSocialItems(user);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Bio</h2>
          <button
            onClick={onEditBio}
            className="text-gray-500 hover:text-primary hover:scale-110 transition-colors"
            aria-label="Edit Bio">
            <HiOutlinePencil size={20} />
          </button>
        </div>
        <div className="space-y-5 ">
          {bioItems.map((item) => (
            <BioItem key={item.label} icon={item.icon} label={item.label} value={item.value} />
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Social Media</h2>
          <button
            onClick={onEditSosmed}
            className="text-gray-500 hover:text-primary hover:scale-110 transition-colors"
            aria-label="Edit Social Media">
            <HiOutlinePencil size={20} />
          </button>
        </div>
        <div className="space-y-4 ">
          {socialItems.map((item) => (
            <div
              key={item.label}
              // href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 group">
              <span className="text-gray-400 group-hover:text-secondary transition-colors">
                {item.icon}
              </span>
              <p className="font-medium text-gray-600 group-hover:text-secondary w-96 truncate transition-colors">
                {item.label }
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
