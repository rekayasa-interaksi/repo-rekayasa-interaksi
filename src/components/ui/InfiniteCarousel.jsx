import React from "react";
import Marquee from "react-fast-marquee";

const InfiniteCarousel = ({ items }) => {
  return (
    <div className="my-auto w-full ">
      <Marquee direction="right" speed={100} delay={5} gradient={false}>
        {items.map((item, index) =>
          item.src ? (
            <img
              loading="lazy"
              key={index}
              src={item.src}
              alt={item.alt}
              className="mx-4 grayscale w-8 sm:w-12 lg:w-16 xl:mx-6"
            />
          ) : (
            <div key={index} className="inline-flex text-sm mx-2">
              <span className="font-medium px-3 py-1 rounded-l">
                {item.name}
              </span>
              <span className="font-normal bg-gray-200 px-3 py-1 rounded-r">
                {item.role}
              </span>
            </div>
          )
        )}
      </Marquee>
    </div>
  );
};

export default InfiniteCarousel;
