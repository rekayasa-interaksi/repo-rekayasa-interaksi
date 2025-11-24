import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useAllEvents } from '../../hooks/event.hooks';
import EventCard from '../core/EventCard';
import ErrorCard from '../ui/ErrorCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { SkeletonCard } from '../ui/SkeletonLoad';
import NotFoundCard from '../ui/NotFoundCard';

const PrevArrow = ({ onClick }) => {
  return (
    <div className="absolute right-14 sm:right-16 -bottom-10" onClick={onClick}>
      <button className="text-lg text-primary bg-gray-300 px-3.5 py-2 rounded-full hover:bg-primary hover:text-white">
        <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
      </button>
    </div>
  );
};

const NextArrow = ({ onClick }) => {
  return (
    <div className="absolute right-0 -bottom-10" onClick={onClick}>
      <button className="text-lg text-primary bg-gray-300 px-3.5 py-2 rounded-full hover:bg-primary hover:text-white">
        <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
      </button>
    </div>
  );
};

const EventCarousel = () => {
  const { events, isLoading: loading, error, refetch } = useAllEvents(1, 10);

  if (loading)
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <SkeletonCard count={4} />
      </div>
    );
  if (error) return <ErrorCard message="Error loading events" onRetry={refetch} />;
  if (!events || events.length === 0) return <NotFoundCard />;

  const desktopSlides = 4;
  let slides = [...events];
  if (events.length < desktopSlides) {
    slides.push(...Array(desktopSlides - events.length).fill(null));
  }

  const canSlideDesktop = events.length > 4;
  const canSlideTablet = events.length > 2;
  const canSlideMobile = events.length > 1;

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    draggable: canSlideDesktop,
    nextArrow: canSlideDesktop ? <NextArrow /> : null,
    prevArrow: canSlideDesktop ? <PrevArrow /> : null,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          draggable: canSlideTablet,
          nextArrow: canSlideTablet ? <NextArrow /> : null,
          prevArrow: canSlideTablet ? <PrevArrow /> : null
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          draggable: canSlideMobile,
          centerMode: true,
          centerPadding: '35px',
          nextArrow: null,
          prevArrow: null
        }
      }
    ]
  };

  return (
    <div className="py-10 sm:py-20">
      <div className="md:max-w-[85vw] mx-auto">
        <div className="mx-auto sm:mx-5 lg:mx-0">
          <div className="flex justify-between items-center px-6 md:px-0">
            <h1 className="text-3xl md:text-4xl 2xl:text-5xl font-medium tracking-tight text-gray-900">
              Latest Events.
            </h1>
            <Link
              to="/event"
              className="text-accent hover:text-accent/70 hover:text-primary-dark font-medium text-base sm:text-lg transition-colors">
              See All Events &gt;
            </Link>
          </div>
        </div>
        <div className="mt-12 justify-start">
          <div>
            <Slider {...settings}>
              {slides.map((event, index) => {
                if (!event) {
                  return <div key={`placeholder-${index} `} />;
                }

                return <EventCard key={event.id} event={event} />;
              })}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCarousel;
