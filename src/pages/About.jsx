import React from 'react';
import Navbar from '../components/core/Navbar';
import Footer from '../components/core/Footer';
import Header from '../components/core/Header';
import HightlightVideo from '../components/about/HighlightVideo';
import HightlightYear from '../components/about/HighlightYear';
import Tagline from '../components/about/Tagline';
import Galery from '../components/about/Galery';
import Faq from '../components/core/Faq';
import Ranger from '../components/core/Ranger';
import { images } from '../constants/imageConstant';

const About = () => {
  return (
    <div>
      <Navbar buttonColor="white" pt="md:pt-9" />
      <Header
        title="Get to Know"
        highlight="About Digistar Club"
        subtitle="A vibrant community awaits those ready for a new adventure!"
        imageMain={images.line}
      />
      <HightlightVideo />
      <Tagline />
      <HightlightYear />
      <Galery />
      <Ranger />
      <Faq />
      <Footer />
    </div>
  );
};

export default About;
