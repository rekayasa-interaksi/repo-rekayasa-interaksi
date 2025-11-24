import React from 'react';
import { useParams } from 'react-router-dom';
import { useEventById } from '../hooks/event.hooks';
import Banner from '../components/detail.event/Banner';
import Content from '../components/detail.event/Content';
import Navbar from '../components/core/Navbar';
import Footer from '../components/core/Footer';
import { DetailEventSkeleton } from '../components/ui/SkeletonLoad';
import ErrorCard from '../components/ui/ErrorCard';

const DetailEvent = () => {
  const { id } = useParams();
  const { event, isLoading, refetch, error } = useEventById(id);

  if (isLoading) {
    return (
      <div className="text-center items-center py-20 w-[90%] mx-auto">
        <DetailEventSkeleton />
      </div>
    );
  }

  if (error) {
    return <ErrorCard message={`Error: ${error.message}`} onRetry={refetch} />;
  }

  return (
    <div>
      <Navbar
        textColor="text-dark"
        buttonColor="secondary"
        barsColor="text-gray-700"
        applyImageFilter={false}
      />
      {event?.status !== 'done' && event?.status !== 'cancel' && (
        <Banner event={event} onRefresh={refetch} />
      )}
      <Content event={event} />
      <Footer />
    </div>
  );
};

export default DetailEvent;
