import React from 'react';
import Navbar from '../components/core/Navbar';
import Footer from '../components/core/Footer';
import Header from '../components/core/Header';
import Faq from '../components/core/Faq';
import HelpForm from '../components/help/HelpForm';
import { images } from '../constants/imageConstant';

const Help = () => {
  return (
    <div>
        <Navbar buttonColor="white" pt="md:pt-9" />
        <Header
          title="Need"
          highlight="Help?"
            subtitle="We're here to assist you. Find answers to common questions or reach out for support."
            imageMain={images.line}
        />
        <HelpForm />
        <Faq />
        <Footer />
    </div>
  );
};

export default Help;