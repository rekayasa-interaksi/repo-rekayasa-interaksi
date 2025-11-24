import React from 'react';
import CountUp from '../../utils/counter';
import InfiniteCarousel from '../ui/InfiniteCarousel';
import { images } from '../../constants/imageConstant';

const logos = [
  { src: images.logo_binus, alt: 'logo Binus' },
  { src: images.logo_itb, alt: 'logo Itb' },
  { src: images.logo_its, alt: 'logo Its' },
  { src: images.logo_telu, alt: 'logo Telu' },
  { src: images.logo_ub, alt: 'logo Ub' },
  { src: images.logo_unair, alt: 'logo Unair' },
  { src: images.logo_undip, alt: 'logo Undip' },
  { src: images.logo_unpad, alt: 'logo Unpad' },
  { src: images.logo_unsri, alt: 'logo Unsri' }
];

const stats = [
  {
    id: 1,
    name: 'Member Joined',
    value: (
      <CountUp
        from={0}
        to={5000}
        separator=","
        direction="up"
        duration={2}
        className="count-up-text"
      />
    )
  },
  {
    id: 2,
    name: 'Chapters',
    value: (
      <CountUp
        from={0}
        to={20}
        separator=","
        direction="up"
        duration={2}
        className="count-up-text"
      />
    )
  },
  {
    id: 3,
    name: 'Universities',
    value: (
      <CountUp
        from={0}
        to={15}
        separator=","
        direction="up"
        duration={2}
        className="count-up-text"
      />
    )
  }
];

const Jobs = () => {
  return (
    <div className="my-16 mx-auto md:max-w-[85vw]">
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-3 lg:grid-rows-2 gap-8 md:gap-10 lg:gap-12 xl:gap-14 items-center">
        <div className="text-center md:text-left px-4 md:row-span-2 lg:row-span-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold">
            Build A Nation,
            <span className="text-accent">
              {' '}
              Embrace <br className="hidden sm:block" /> Your Passion{' '}
            </span>
          </h1>
        </div>

        <div className="text-center md:text-left">
          <p className="text-lg sm:text-xl">
            A vibrant community awaits those ready for a new adventure! Join us to discover endless
            opportunities for growth and connection.
          </p>
        </div>

        <div className="w-full flex justify-center md:col-start-2 lg:col-start-auto">
          <InfiniteCarousel items={logos} />
        </div>

        <div className="md:col-start-1 md:col-span-2 lg:col-span-1 md:row-start-3 lg:col-start-auto lg:row-start-auto">
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center md:text-left">
            {stats.map((stat) => (
              <div key={stat.id} className="flex flex-col justify-center items-center xl:items-start gap-y-2">
                <dt className="text-base text-gray-600">{stat.name}</dt>
                <dd className="text-4xl font-semibold text-secondary sm:text-5xl">{stat.value}+</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Jobs;