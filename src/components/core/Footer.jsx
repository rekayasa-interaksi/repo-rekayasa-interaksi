import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMedium,
  faYoutube,
  faTiktok,
  faLinkedin,
  faInstagram
} from '@fortawesome/free-brands-svg-icons';
import { images } from '../../constants/imageConstant';
import InfiniteCarousel from '../ui/InfiniteCarousel';

const credit = [
  { name: 'Ilham Adi Pratama', role: 'Product Lead' },
  { name: 'Nugroho Adi', role: 'Frontend Developer' },
  { name: "Ilham Adi Pratama", role: "Backend Developer" },
  { name: "Ilham Adi Pratama & Nugroho Adi", role: "Quality Assurance" },
  // { name: "Fitrotin Nadzilah", role: "UI/UX Designer" },
  // { name: "Yuliana", role: "Quality Assurance" },
  // { name: "Raihan Abdurrahman", role: "Backend Developer" },
  // { name: "Naufal Rizqullah Firdaus", role: "Frontend Developer" },
  // { name: "Lutfi Sirajs", role: "UI/UX Designer" },
  // { name: "Fitrotin Nadzilah", role: "UI/UX Designer" },
  // { name: "Endika Satrio Wibowo", role: "Scrum Master" },
];

const Footer = () => {
  return (
    <footer className="pt-12 bg-gray-100 bg-opacity-50 rounded-3xl m-8">
      <div className="max-w-[90vw] mx-auto px-4 mb-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
          <div className="space-y-4">
            <img loading="lazy" src={images.logo_digistar} alt="logo digistar" className="h-16" />
            <p className="text-sm md:text-base max-w-96">
              Lantai 29, Telkom Landmark Tower, Jl. Gatot Subroto No.Kav 52, RT.6/RW.1, Kuningan
              Barat, Mampang Prapatan, Jakarta Selatan
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="font-light text-gray-500">Powered by:</h2>
              <div className="flex gap-6 mt-2">
                <img loading="lazy" src={images.logo_telkom} alt="logo telkom" className="h-8" />
                <img loading="lazy" src={images.logo_lit} alt="logo lit" className="h-8" />
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4 shrink-0">Credit:</span>
              <div className="flex-grow overflow-hidden">
                <InfiniteCarousel items={credit} />
              </div>
            </div>
          </div>
        </div>

        {/*
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 md:gap-12 mt-10">
          <div className="gap-6">
            <ul className="space-y-2 text-sm md:text-base">
              <h3 className=" text-gray-500">Discover</h3>
              <li>Digistar Icon</li>
              <li>Digistar Club Committee</li>
              <li>Digistar Class</li>
              <li>Digistar Internship</li>
            </ul>
          </div>

          <div className="gap-6">
            <ul className="space-y-2 text-sm md:text-base">
              <h3 className="text-gray-500">Digistar Club</h3>
              {clubs.map((club, index) => (
                <li key={index}>{club.title}</li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 gap-6">
            <ul className="space-y-2 text-sm md:text-base">
              <h3 className="text-base text-gray-500">Chapter Club</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="space-y-2">
                  {chapters
                    .slice(0, chapters.length * 0.5)
                    .map((chapter, index) => (
                      <button key={index} className="text-start">
                        {chapter.name}
                      </button>
                    ))}
                </div>
                <div className="space-y-2">
                  {chapters
                    .slice(chapters.length * 0.5 + 1, chapters.length)
                    .map((chapter, index) => (
                      <button key={index} className="text-start">
                        {chapter.name}
                      </button>
                    ))}
                </div>
              </div>
            </ul>
          </div>
        </div>
        */}
      </div>

      {/* Bottom social & copyright */}
      <div className="border-t flex flex-col-reverse sm:flex-row justify-between items-center text-center text-xs sm:text-sm py-4 px-4 md:px-8 lg:px-16 mt-2 text-dark">
        <p className="text-gray-500 mt-2 sm:mt-0">
          © {new Date().getFullYear()} Digistar Club by Telkom Indonesia. All Rights Reserved
        </p>
        <div className="flex justify-center sm:justify-start space-x-3 md:space-x-4">
          {[
            { icon: faLinkedin, href: 'https://www.linkedin.com/company/digistar-club/' },
            { icon: faInstagram, href: 'https://www.instagram.com/digistarclub/' },
            { icon: faTiktok, href: 'https://www.tiktok.com/@digistarclub' },
            { icon: faMedium, href: 'https://medium.com/digistarclub' },
            { icon: faYoutube, href: 'https://www.youtube.com/@RangerDigiClub' }
          ].map((social, index) => (
            <button
              key={index}
              onClick={() => social.href && window.open(social.href, '_blank')}
              className="text-primary hover:text-primary-dark hover:scale-110 transition"
              aria-label={social.icon.iconName}>
              <FontAwesomeIcon icon={social.icon} className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
