import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, ArrowUpRightIcon, ClockIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { images } from '../../constants/imageConstant';
import { useEventById } from '../../hooks/event.hooks';

const EventCard = ({ event }) => {
  const { event: eventData } = useEventById(event.id);
  const firstDetail = event.detail_events?.[0] || {};
  const formattedFirstDate = firstDetail.date
    ? format(new Date(firstDetail.date), 'd MMMM yyyy', { locale: id })
    : 'Date not set';
  const lastDetail = event.detail_events?.[event.detail_events.length - 1] || {};
  const formattedLastDate = lastDetail.date
    ? format(new Date(lastDetail.date), 'd MMMM yyyy', { locale: id })
    : 'Date not set';

  const formattedStartTime = firstDetail.start_time?.slice(0, 5) || '--:--';
  const formattedEndTime = firstDetail.end_time?.slice(0, 5) || '--:--';

  const { event_organizations } = event || {};
  const organizersList = [];

  if (event_organizations) {
    const clubs = event_organizations.student_clubs.map((club) => ({
      name: club.name,
      imageUrl: club.logo_url
    }));

    const chapters = event_organizations.student_chapters.map((chapter) => ({
      name: chapter.institute,
      imageUrl: chapter.image_url
    }));

    const externals = event_organizations.external_organizations.map((org) => ({
      name: org.name,
      imageUrl: org.logo_url || org.image_url
    }));

    organizersList.push(...clubs, ...chapters, ...externals);
  }

  return (
    <div className="h-full group">
      <div className="rounded-xl overflow-hidden relative transition-all duration-300 mx-2 h-full">
        <div
          className={`absolute inset-0 z-10 bg-gradient-to-t from-transparent via-transparent to-black/60 h-40 transition-all duration-300 group-hover:h-[90%] group-hover:to-black/60`}></div>
        <div className="relative w-full">
          <img
            src={event.image_url}
            alt={event.name}
            className="w-full aspect-[4/5] object-cover rounded-xl"
            onError={(e) => {
              e.target.src = images.event_1;
            }}
          />
          <div className="absolute top-0 left-0 z-10 m-4 flex gap-2">
            <span
              className={`px-4 py-1 text-xs border rounded-full text-white transition-all duration-300 group-hover:bg-light group-hover:text-black`}>
              {event.type === 'exclusive' ? 'Member' : 'Umum'}
            </span>
            <span
              className={`px-4 py-1 text-xs border rounded-full text-white transition-all duration-300 group-hover:bg-light group-hover:text-black`}>
              {event.status}
            </span>
            <span
              className={`px-4 py-1 text-xs border rounded-full text-white transition-all duration-300 group-hover:bg-light group-hover:text-black`}>
              {event.place}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-0 bg-gradient-to-b from-transparent to-black/70 h-[25%] rounded-b-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        </div>
        <div className="flex flex-col h-36 p-3">
          <h3
            className={`font-semibold text-lg line-clamp-2 transition-colors duration-300 group-hover:text-primary`}>
            {event.name}
          </h3>
          <div
            className={`text-xs sm:text-sm font-normal flex items-center gap-1 mt-2 text-gray-600 transition-colors duration-300 group-hover:text-primary`}>
            <CalendarIcon className="h-4 w-4" />
            <p className="text-xs">
              {formattedFirstDate}{' '}
              {formattedFirstDate !== formattedLastDate && ` - ${formattedLastDate}`}
            </p>

            <ClockIcon className="h-4 w-4 ml-4" />
            <p className="text-xs">
              {formattedStartTime} - {formattedEndTime}
            </p>
          </div>

          <div className="flex flex-row flex-wrap gap-2 mt-3">
            {organizersList.length > 0 ? (
              organizersList.map((organizer) => (
                <img
                  key={organizer.name}
                  src={organizer.imageUrl}
                  alt={organizer.name}
                  title={organizer.name}
                  className="w-8 h-8 rounded-full object-cover bg-gray-200"
                />
              ))
            ) : (
              <p className="text-xs text-gray-500 mt-1">Organizer not set</p>
            )}
          </div>
        </div>


        {event.status !== 'cancel' && (
          <Link 
            to={`/event/${event.id}`}
            className="absolute bottom-44 inset-x-4 z-10 rounded-full px-4 py-3 text-white no-underline bg-pink-600 flex lg:hidden lg:group-hover:flex">
            <div className="w-full flex justify-between items-center text-left">
              {eventData?.status === 'done' ? (
                <span className="text-sm font-normal">See Detail</span>
              ) : eventData?.is_joined === true ? (
                <span className="text-sm font-normal">Participated, See Detail</span>
              ) : event.status === 'active' && eventData?.is_registered === true ? (
                <span className="text-sm font-normal">Presence Now</span>
              ) : eventData?.is_registered === true ? (
                <span className="text-sm font-normal">Registered, See Detail</span>
              ) : (
                <span className="text-sm font-normal">Register Now</span>
              )}
              <span className="text-primary">
                <ArrowUpRightIcon className="h-3 w-3 text-white" strokeWidth={6} />
              </span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default EventCard;
