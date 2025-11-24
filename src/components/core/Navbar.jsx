import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { images } from '../../constants/imageConstant';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronUp,
  faUser,
  // faGear,
  faBars,
  faX,
  faQuestion,
  faPowerOff
} from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogPanel } from '@headlessui/react';
import { useAuth } from '../../context/authContext';
import { useUserProfile } from '../../hooks/member.hooks';

const navigation = [
  { name: 'Home', href: '/' },
  // {
  //   name: 'Clubs',
  //   href: '#',
  //   dropdown: [
  //     {
  //       name: 'Digital Application Club',
  //       href: '#',
  //       icon: images.logo_club_da
  //     },
  //     { name: 'Digital Business Club', href: '#', icon: images.logo_club_db },
  //     { name: 'Digital Network Club', href: '#', icon: images.logo_club_dn }
  //   ]
  // },
  // { name: 'Chapter', href: '#' },
  { name: 'Events', href: '/event' },
  // { name: 'Member', href: '/member' },
  { name: 'About Us', href: '/about' },
  { name: 'Help & Support', href: '/help' }
];

const Navbar = ({
  pt = 'mt-0',
  textColor = 'text-white',
  scrolledTextColor = 'text-dark',
  buttonColor = 'white',
  hoverButtonColor = 'hover:bg-secondary/90',
  barsColor = 'text-white',
  applyImageFilter = true
}) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { userProfile } = useUserProfile();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isClubsOpen, setIsClubsOpen] = useState(false);
  const [isClubsOpenMobile, setIsClubsOpenMobile] = useState(false);
  const menuRef = useRef(null);
  const profileMenuRef = useRef(null);

  const navigate = useNavigate();

  const getInitials = (name) => {
    if (typeof name !== 'string' || !name.trim()) {
      return '?';
    }

    const names = name.split(' ').filter(Boolean);
    if (names.length === 0) return '?';

    const initials = names.map((n) => n[0]).join('');
    return initials.slice(0, 2).toUpperCase();
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsClubsOpen(false);
      }

      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'lg:mt-4 lg:mx-[15%] lg:rounded-full shadow-xl bg-white pt-0 lg:px-2'
          : `bg-transparent ${pt} lg:px-12`
      }${hoverButtonColor}`}>
      <nav
        className={`flex items-center justify-between px-3 py-4 md:py-2 ${
          isScrolled ? 'md:px-8' : 'md:px-12'
        }`}>
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <img
              loading="lazy"
              src={images.logo_digistar}
              alt="logo digistar"
              className={`w-32 ${
                isScrolled || !applyImageFilter ? 'filter-none' : 'filter invert brightness-0'
              }`}
            />
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            onClick={() => setIsMenuOpen(true)}
            className={`-m-2.5 p-2.5 ${isScrolled ? 'text-gray-700' : barsColor}`}
            aria-label="Open menu">
            <FontAwesomeIcon icon={faBars} className="size-6" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-6" ref={menuRef}>
          {navigation.map((item) =>
            item.dropdown ? (
              <div key={item.name} className="relative">
                <button
                  className={`text-base flex items-center ${
                    isScrolled ? scrolledTextColor : textColor
                  }`}
                  onClick={() => setIsClubsOpen(!isClubsOpen)}
                  aria-expanded={isClubsOpen}
                  aria-haspopup="true">
                  {item.name}
                  {isClubsOpen ? (
                    <FontAwesomeIcon
                      icon={faChevronUp}
                      className="ml-1 w-4 h-4 transition-transform duration-300"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="ml-1 w-4 h-4 transition-transform duration-300"
                    />
                  )}
                </button>
                <AnimatePresence>
                  {isClubsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute mt-4 w-56 bg-white ring-1 ring-gray-200 shadow-md rounded-sm overflow-hidden z-50">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="flex items-center px-4 py-2 text-sm text-dark hover:bg-background transition-all duration-200"
                          onClick={() => setIsClubsOpen(false)}>
                          <img
                            loading="lazy"
                            src={subItem.icon}
                            alt={subItem.name}
                            className="w-6 h-6 object-contain rounded-full"
                          />
                          <span className="ml-2">{subItem.name}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={item.name}
                to={item.href}
                className={`text-base font-medium hover:text-secondary hover:scale-105 transition-all duration-300 ${
                  isScrolled ? scrolledTextColor : textColor
                }`}
                onClick={() => setIsMenuOpen(false)}>
                {item.name}
              </Link>
            )
          )}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end" ref={profileMenuRef}>
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-x-2 border border-primary rounded-full focus:outline-none hover:scale-105 transition-all duration-300">
                {userProfile.image_profile_path ? (
                  <img
                    src={`${process.env.REACT_APP_IMG_PATH}/${userProfile.image_profile_path}`}
                    alt={userProfile.name}
                    className="w-10 h-10 rounded-full object-cover "
                  />
                ) : (
                  <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-white font-semibold">
                    {getInitials(userProfile.name)}
                  </div>
                )}
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}>
                    <div className="flex items-center gap-3 px-3 py-4">
                      {userProfile.image_profile_path ? (
                        <img
                          src={`${process.env.REACT_APP_IMG_PATH}/${userProfile.image_profile_path}`}
                          alt={userProfile.name}
                          className="w-10 h-10 rounded-full object-cover border border-primary"
                        />
                      ) : (
                        <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-white font-semibold">
                          {getInitials(userProfile.name)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{userProfile.name}</p>
                        <p className="text-xs text-gray-500">{userProfile.unique_number}</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 " />

                    <div className="px-2 py-2 space-y-1 text-sm text-gray-700">
                      <Link
                        to={'/profile'}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center w-full gap-3 px-2 py-2 rounded-md hover:bg-gray-100 transition">
                        <span className="text-lg">
                          <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                        </span>
                        Account Details
                      </Link>

                      {/* <button className="flex items-center w-full gap-3 px-2 py-2 rounded-md hover:bg-gray-100 transition">
                        <span className="text-lg">
                          <FontAwesomeIcon icon={faGear} className="h-4 w-4" />
                        </span>
                        Settings
                      </button> */}
                      <Link
                        to="/help"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center w-full gap-3 px-2 py-2 rounded-md hover:bg-gray-100 transition">
                        <span className="text-lg">
                          <FontAwesomeIcon icon={faQuestion} className="h-4 w-4" />
                        </span>
                        Help & Support
                      </Link>
                    </div>

                    <div className="border-t border-gray-200 mt-2" />

                    <div className="px-4 py-3">
                      <button
                        onClick={() => {
                          logout();
                          navigate('/login');
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center gap-3 font-medium text-sm text-red-600 hover:text-red-700 transition">
                        <span className="text-lg">
                          <FontAwesomeIcon icon={faPowerOff} className="h-4 w-4" />
                        </span>
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className={`text-sm font-medium px-6 py-3 rounded-full transition-all duration-200 ${
                isScrolled
                  ? 'bg-secondary text-white hover:bg-secondary/90'
                  : `bg-transparent hover:bg-secondary hover:text-white ring-1 hover:ring-0 ${
                      buttonColor
                        ? `text-${buttonColor} ring-${buttonColor}`
                        : 'text-white ring-white'
                    }`
              }`}>
              Login
            </button>
          )}
        </div>
      </nav>
      <AnimatePresence>
        {isMenuOpen && (
          <Dialog open={isMenuOpen} onClose={setIsMenuOpen} className="lg:hidden">
            <DialogPanel
              as={motion.div}
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto shadow-lg bg-white px-6 py-6 sm:max-w-sm">
              <div className="flex items-center justify-between">
                <Link to="/" className="-m-1.5 p-1.5">
                  <img
                    loading="lazy"
                    src={images.logo_digistar}
                    alt="logo digistar"
                    className="w-32"
                  />
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="-m-2.5 p-2.5 text-gray-700"
                  aria-label="Close menu">
                  <FontAwesomeIcon icon={faX} className="size-6" />
                </button>
              </div>
              <div className="mt-6">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) =>
                      item.dropdown ? (
                        <div key={item.name} className="relative">
                          <button
                            className="w-full text-left px-3 py-2 text-base text-gray-900 hover:text-secondary font-medium flex items-center justify-between"
                            onClick={() => setIsClubsOpenMobile(!isClubsOpenMobile)}
                            aria-expanded={isClubsOpenMobile}
                            aria-haspopup="true">
                            {item.name}
                            {isClubsOpenMobile ? (
                              <FontAwesomeIcon icon={faChevronUp} className="w-4 h-4" />
                            ) : (
                              <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4" />
                            )}
                          </button>
                          <AnimatePresence>
                            {isClubsOpenMobile && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="pl-5 space-y-1 overflow-hidden">
                                {item.dropdown.map((subItem) => (
                                  <Link
                                    key={subItem.name}
                                    to={subItem.href}
                                    className="flex items-center px-3 py-2 text-gray-900 hover:bg-gray-50 transition-all duration-200"
                                    onClick={() => setIsClubsOpenMobile(false)}>
                                    <img
                                      loading="lazy"
                                      src={subItem.icon}
                                      alt={subItem.name}
                                      className="w-6 h-6 object-contain rounded-full"
                                    />
                                    <span className="ml-2">{subItem.name}</span>
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="block px-3 py-2 text-base text-gray-900 hover:bg-gray-50 transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}>
                          {item.name}
                        </Link>
                      )
                    )}
                  </div>
                  <div className="py-6">
                    {isAuthenticated && user ? (
                      <div className="flex items-center justify-between">
                        <Link
                          to={'/profile'}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-x-3">
                          <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-white font-semibold">
                            {userProfile.image_profile_path ? (
                              <img
                                src={`${process.env.REACT_APP_IMG_PATH}/${userProfile.image_profile_path}`}
                                alt={userProfile.name}
                                className="w-10 h-10 rounded-full object-cover border border-primary"
                              />
                            ) : (
                              <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-white font-semibold">
                                {getInitials(userProfile.name)}
                              </div>
                            )}
                          </div>
                          <span className="text-base text-dark">{userProfile.name}</span>
                        </Link>

                        <button
                          onClick={() => {
                            logout();
                            setIsMenuOpen(false);
                          }}
                          className="text-sm font-medium text-red-600">
                          Logout
                        </button>
                        
                      </div>
                      
                    ) : (
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate('/login');
                        }}
                        className={`text-sm px-6 py-3 rounded-full transition-all duration-200 bg-secondary text-white hover:bg-secondary/90`}>
                        Login
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </DialogPanel>
          </Dialog>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
