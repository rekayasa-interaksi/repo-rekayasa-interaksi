import React from 'react';
import Navbar from '../components/core/Navbar';
import Footer from '../components/core/Footer';
import Header from '../components/core/Header';
import AllEvent from '../components/event/AllEvent';
import Faq from '../components/core/Faq';
import { images } from '../constants/imageConstant';

const Event = () => {
  return (
    <div>
      <Navbar buttonColor="white" pt="md:pt-9" />
      <Header
        title="Explore"
        highlight="All Events"
        subtitle="Join for our latest event and unlock a world of exciting opportunities for growth and connection!"
        imageMain={images.line}
      />
      <AllEvent />
      <Faq />
      <Footer />
    </div>
  );
};

export default Event;
