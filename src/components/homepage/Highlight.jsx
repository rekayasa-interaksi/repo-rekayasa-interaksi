import React, { Suspense } from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const LoadingSpinner = React.lazy(() => import("../core/Loader"));
const ReactPlayer = React.lazy(() => import("react-player"));
const Slider = React.lazy(() => import("react-slick"));

const PrevArrow = ({ onClick }) => {
  return (
    <button
      className="absolute right-14 -top-20 px-4 py-2 text-lg text-primary bg-gray-300 font-medium rounded-full hover:bg-primary hover:text-light z-10"
      onClick={onClick}
    >
      {"<"}
    </button>
  );
};

const NextArrow = ({ onClick }) => {
  return (
    <button
      className="absolute right-0 -top-20 px-4 py-2 text-lg text-primary bg-gray-300 font-medium rounded-full hover:bg-primary hover:text-light z-10"
      onClick={onClick}
    >
      {">"}
    </button>
  );
};

const items = [
  {
    id: 1,
    title: "Digitaler Club by LivinginTelkom | Profile Video - 2024 Edition",
    subtitle: "And Become Part of DIGISTER CLUB",
    cta: "Watch on YouTube",
    url: "https://www.youtube.com/watch?v=8MpnKv5yEtw&pp=ygUMZGlnaXN0YXJjbHVi",
  },
  {
    id: 2,
    title: "Digitaler Club Event | Tech Conference 2024",
    subtitle: "Join Our Next Digital Transformation",
    cta: "Watch on YouTube",
    url: "https://www.youtube.com/watch?v=8MpnKv5yEtw&pp=ygUMZGlnaXN0YXJjbHVi",
  },
  {
    id: 3,
    title: "Digitaler Club Workshop | AI Integration",
    subtitle: "Learn Cutting Edge Technologies",
    cta: "Watch on YouTube",
    url: "https://www.youtube.com/watch?v=8MpnKv5yEtw&pp=ygUMZGlnaXN0YXJjbHVi",
  },
  {
    id: 4,
    title: "Member Spotlight | Success Stories",
    subtitle: "Be Inspired By Our Community",
    cta: "Watch on YouTube",
    url: "https://www.youtube.com/watch?v=8MpnKv5yEtw&pp=ygUMZGlnaXN0YXJjbHVi",
  },
];

const Highlight = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerMode: false,
          nextArrow: null,
          prevArrow: null,
        },
      },
    ],
  };

  return (
    <div className="py-10 sm:py-20 bg-gray-50">
      <div className="md:max-w-[85vw] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl 2xl:text-6xl font-medium tracking-tight text-gray-900 ">
            Get the Hightlight.
          </h1>
        </div>

        <div className="relative">
          <Suspense fallback={<LoadingSpinner />}>
            <Slider {...settings}>
              {items.map((item) => (
                <div key={item.id} className="focus:outline-none">
                  <div className="flex flex-col md:flex-row gap-0 md:gap-8">
                    <div className="w-[80vw] h-[40vh] md:h-[80vh] rounded-xl overflow-hidden bg-gray-200">
                      <ReactPlayer
                        url={item.url}
                        width="100%"
                        height="100%"
                        controls
                        playing={false}
                        light={true}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Highlight;
