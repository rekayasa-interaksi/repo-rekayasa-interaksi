import React, { useRef } from 'react';
import { images } from '../../constants/imageConstant';
import '../../assets/styles/index.css';

const Card = ({ title, desc, img, reverse }) => (
  <div className="w-80 mr-6 flex-shrink-0">
    <div
      className="relative h-[60vh] rounded-2xl overflow-hidden bg-cover bg-center shadow-lg"
      style={{ backgroundImage: `url(${img})` }}>
      <div className="absolute inset-0 bg-black/30 z-0" />
      <div
        className={`absolute z-10 text-white p-6 ${reverse ? 'bottom-0 left-0' : 'top-0 left-0'}`}>
        <h3 className="text-4xl font-bold mb-1">{title}</h3>
        <p className="text-sm">{desc}</p>
      </div>
    </div>
  </div>
);

const TaglineSlider = () => {
  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleDragStart = (e) => {
    const slider = sliderRef.current;
    if (!slider) return;
    isDragging.current = true;
    const startPositionX = e.touches ? e.touches[0].pageX : e.pageX;
    startX.current = startPositionX - slider.offsetLeft;
    scrollLeft.current = slider.scrollLeft;
    slider.classList.add('is-dragging');
  };

  const handleDragEnd = () => {
    isDragging.current = false;
    if (sliderRef.current) {
      sliderRef.current.classList.remove('is-dragging');
    }
  };

  const handleDragMove = (e) => {
    if (!isDragging.current || !sliderRef.current) return;
    e.preventDefault();
    const currentPositionX = e.touches ? e.touches[0].pageX : e.pageX;
    const x = currentPositionX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const cards = [
    {
      title: 'Learn.',
      desc: 'Our workplace enable us to enhance our skills and capabilities towards formal. experimental, and social learning culture.',
      img: images.club_image_1
    },
    {
      title: 'Grow.',
      desc: 'Our workplace enable us to enhance our skills and capabilities towards formal. experimental, and social learning culture.',
      img: images.club_image_2
    },
    {
      title: 'Contribute.',
      desc: 'Our workplace enable us to enhance our skills and capabilities towards formal. experimental, and social learning culture difference.',
      img: images.club_image_3
    },
    {
      title: 'Work.',
      desc: 'Our workplace enable us to enhance our skills and capabilities towards formal. experimental, and social learning culture.',
      img: images.club_image_1
    },
    {
      title: 'Share.',
      desc: 'Our workplace enable us to enhance our skills and capabilities towards formal. experimental, and social learning culture.',
      img: images.club_image_2
    },
    {
      title: 'Explore.',
      desc: 'Our workplace enable us to enhance our skills and capabilities towards formal. experimental, and social learning culture.',
      img: images.club_image_3
    }
  ];

  return (
    <div className="my-16">
      <div className="mx-auto max-w-[85vw]">
        <h2 className="text-3xl md:text-5xl font-semibold mb-12">Powered by LivinginTelkom.</h2>
      </div>
      <div
        ref={sliderRef}
        className="flex overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing pl-6 xl:pl-24 pr-6"
        onMouseDown={handleDragStart}
        onMouseLeave={handleDragEnd}
        onMouseUp={handleDragEnd}
        onMouseMove={handleDragMove}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
        onTouchCancel={handleDragEnd}
        onTouchMove={handleDragMove}>
        {cards.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            desc={card.desc}
            img={card.img}
            reverse={index % 2 !== 0}
          />
        ))}
      </div>
    </div>
  );
};

export default TaglineSlider;
