import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { images } from '../../constants/imageConstant';

const PrevArrow = ({ onClick }) => {
  return (
    <div className="absolute right-14 sm:right-20 -top-12" onClick={onClick}>
      <button className="px-4 sm:px-6 py-2 text-xs sm:text-sm text-primary ring-1 ring-primary font-medium rounded-lg hover:bg-primary hover:text-white">
        <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-3" strokeWidth={1.5} />{' '}
      </button>
    </div>
  );
};

const NextArrow = ({ onClick }) => {
  return (
    <div className="absolute right-0 -top-12" onClick={onClick}>
      <button className="px-4 sm:px-6 py-2 text-xs sm:text-sm text-primary ring-1 ring-primary font-medium rounded-lg hover:bg-primary hover:text-white">
        <FontAwesomeIcon icon={faArrowRight} className="h-4 w-3" strokeWidth={4} />{' '}
      </button>
    </div>
  );
};

const showcases = [
  {
    title: 'Digistar Connect Goes to Telkom University',
    date: '1 April 2024',
    time: '13:00 - selesai',
    category: 'Umum',
    club: 'Digital Application Club',
    image: images.showcase1
  },
  {
    title: 'Personalized Marketing with CRM: Optimizing Digital Strategies',
    date: '1 April 2024',
    time: '13:00 - selesai',
    category: 'Member DigiClub',
    club: 'Digital Application Club',
    image: images.showcase2
  },
  {
    title: 'Design Class #4: Mastering Figma for Rapid Web Design',
    date: '1 April 2024',
    time: '13:00 - selesai',
    category: 'Member DigiClub',
    club: 'Digital Application Club',
    image: images.showcase3
  },
  {
    title: 'Developer Series #2: Deployment Transformation',
    date: '1 April 2024',
    time: '13:00 - selesai',
    category: 'Umum',
    club: 'Digital Application Club',
    image: images.showcase4
  },
  {
    title: 'Digistar Connect Goes to Telkom University',
    date: '1 April 2024',
    time: '13:00 - selesai',
    category: 'Umum',
    club: 'Digital Application Club',
    image: images.showcase1
  },
  {
    title: 'Personalized Marketing with CRM: Optimizing Digital Strategies',
    date: '1 April 2024',
    time: '13:00 - selesai',
    category: 'Member DigiClub',
    club: 'Digital Application Club',
    image: images.showcase2
  },
  {
    title: 'Design Class #4: Mastering Figma for Rapid Web Design',
    date: '1 April 2024',
    time: '13:00 - selesai',
    category: 'Member DigiClub',
    club: 'Digital Application Club',
    image: images.showcase3
  },
  {
    title: 'Developer Series #2: Deployment Transformation',
    date: '1 April 2024',
    time: '13:00 - selesai',
    category: 'Umum',
    club: 'Digital Application Club',
    image: images.showcase4
  }
];

const Showcase = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: '35px',
          nextArrow: null,
          prevArrow: null
        }
      }
    ]
  };
  return (
    <div className="pb-20">
      <div className="mx-auto max-w-7xl px-0 lg:px-8">
        <div className="px-6 lg:px-0">
          <div className="mx-auto sm:mx-5 max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Member Showcase
            </h2>
          </div>
        </div>
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4 px-6 lg:px-0">
            <button href="#" className="text-red-500 font-medium">
              View All &gt;
            </button>
          </div>
          <Slider {...settings}>
            {showcases.map((showcase, index) => (
              <div key={index} className="px-3 pb-3">
                <div className="flex flex-col border rounded-lg shadow-lg overflow-hidden min-h-[340px] relative">
                  <div className="relative">
                    <img
                      loading="lazy"
                      src={showcase.image}
                      alt={showcase.title}
                      className="w-full h-52 object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-grow p-3">
                    <h3 className="font-semibold text-base">{showcase.title}</h3>

                    <div className="mt-auto">
                      <p className="text-sm font-medium text-gray-600">
                        {showcase.date} | {showcase.time}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Showcase;
