import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDays,
  faUser,
  faLocationDot,
  faLink,
  faTicket,
  faPlayCircle
} from '@fortawesome/free-solid-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import Breadcrumb from '../core/Breadcrumb';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { getImageUrl } from '../../utils/imagePathUrl';
import { MarkdownConvert } from '../../utils/markdownConvert';

const InfoItem = ({ icon, label, children }) => (
  <div className="flex items-start gap-3">
    <FontAwesomeIcon icon={icon} className="h-5 w-5 text-gray-500 mt-1" />
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base font-semibold text-gray-900">{children}</p>
    </div>
  </div>
);

const Content = ({ event }) => {
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const mainImageObject = event?.images?.find((img) => img.activated === true);
  const defaultMainImageUrl = mainImageObject ? `${getImageUrl(mainImageObject.image_path)}` : '';
  const mainImage = selectedThumbnail || defaultMainImageUrl;
  const eventDetails = event?.detail_events || [];
  const firstDetail = eventDetails[0] || {};
  const lastDetail = eventDetails[eventDetails.length - 1] || {};

  const formattedDate = () => {
    if (!firstDetail.date) return 'Tanggal belum ditentukan';
    const startDate = format(new Date(firstDetail.date), 'd MMM', { locale: id });
    if (eventDetails.length > 1 && firstDetail.date !== lastDetail.date) {
      const endDate = format(new Date(lastDetail.date), 'd MMM yyyy', { locale: id });
      return `${startDate} - ${endDate}`;
    }
    return format(new Date(firstDetail.date), 'd MMMM yyyy', { locale: id });
  };

  const thumbnails = event?.images?.map((img) => `${getImageUrl(img.image_path)}`) || [];

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

  const recordingLinks = eventDetails
    .map((detail) => ({
      title: detail.title,
      url: detail.recording
    }))
    .filter((detail) => detail.url);

  const absoluteUrl = (url) => {
    if (!url) return '#';

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    return `https://${url}`;
  };

  return (
    <div className="max-w-[80vw] mt-12 mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 px-2">
        <Breadcrumb />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-12">
        <div className="lg:col-span-2 lg:sticky lg:top-12 self-start">
          <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100">
            <div className="aspect-[5/6] bg-gray-100">
              <img
                loading="lazy"
                src={mainImage}
                alt={event?.name || 'Event Image'}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {thumbnails.length > 1 && (
            <div className="grid grid-cols-5 gap-3 mt-4">
              {thumbnails.map((img, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all border-2 ${
                    selectedThumbnail === img
                      ? 'ring-2 ring-primary ring-offset-2 border-transparent'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  onClick={() => setSelectedThumbnail(selectedThumbnail === img ? null : img)}>
                  <img
                    loading="lazy"
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-3 mt-8 lg:mt-0">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-6">{event?.name}</h1>

          <div className="p-6 rounded-xl border bg-gray-50 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 mb-6">
            <InfoItem icon={faCalendarDays} label="Date & Time">
              {formattedDate()}
              <span className="block text-sm text-gray-600 mt-1">
                {firstDetail.start_time?.slice(0, 5) || '--:--'} -{' '}
                {firstDetail.end_time?.slice(0, 5) || '--:--'} WIB
              </span>
            </InfoItem>
            <InfoItem icon={faUser} label="Event Type">
              {event?.type === 'exclusive' ? 'Exclusive for Member' : 'For Public'}
            </InfoItem>
            <InfoItem icon={faLocationDot} label="Location">
              {event?.place}
            </InfoItem>
            <InfoItem icon={faTicket} label="Status">
              <span className="capitalize">{event?.status || 'N/A'}</span>
            </InfoItem>
          </div>

          {event?.links?.zoom || event?.links?.instagram ? (
            <div className="flex flex-wrap gap-3 mb-6 ">
              {event?.links?.zoom && (
                <a
                  href={absoluteUrl(event.links.zoom)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg font-medium hover:scale-105 transition">
                  <FontAwesomeIcon icon={faLink} className="h-4 w-4" />
                  Join Zoom
                </a>
              )}
              {event?.links?.instagram && (
                <a
                  href={absoluteUrl(event.links.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-pink-600 text-white rounded-lg font-medium hover:scale-105 transition">
                  <FontAwesomeIcon icon={faInstagram} className="h-4 w-4" />
                  Post Instagram
                </a>
              )}

              {recordingLinks.map((rec, index) => (
                <a
                  key={index}
                  href={absoluteUrl(rec.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg font-medium hover:scale-105 transition"
                  title={rec.title}>
                  <FontAwesomeIcon icon={faPlayCircle} className="h-4 w-4" />
                  Recording {index + 1}
                </a>
              ))}
            </div>
          ) : null}

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-2xl text-gray-900 border-b pb-3 mb-4">
                About Event
              </h3>
              <div className="text-gray-700 space-y-4 leading-relaxed">
                <MarkdownConvert markdown={event?.description} />
              </div>
            </div>

            {eventDetails.length > 0 && (
              <div>
                <h3 className="font-semibold text-2xl text-gray-900 border-b pb-3 mb-4">
                  Session Schedule
                </h3>
                <ul className="list-disc pl-5 space-y-3 text-gray-700">
                  {eventDetails.map((detail) => (
                    <li key={detail.id} className="pl-2">
                      <strong className="text-gray-900">{detail.title}:</strong>
                      <br />
                      {format(new Date(detail.date), 'd MMMM yyyy', { locale: id })}
                      <span className="text-gray-600">
                        {' '}
                        pukul {detail.start_time?.slice(0, 5) || '--:--'} -{' '}
                        {detail.end_time?.slice(0, 5) || '--:--'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-2xl text-gray-900 border-b pb-3 mb-4">
                Organizers
              </h3>
              <div className="flex flex-row flex-wrap gap-3">
                {organizersList.length > 0 ? (
                  organizersList.map((organizer) => (
                    <img
                      key={organizer.name}
                      src={organizer.imageUrl}
                      alt={organizer.name}
                      title={organizer.name}
                      className="w-12 h-12 rounded-full object-cover bg-gray-200 border border-gray-100 transition-transform hover:scale-110"
                    />
                  ))
                ) : (
                  <p className="text-gray-500">Organizer not specified</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-2xl text-gray-900 border-b pb-3 mb-4">
                Rules and Policy
              </h3>
              <div className="text-gray-700 space-y-4 leading-relaxed">
                <MarkdownConvert markdown={event?.rules} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
