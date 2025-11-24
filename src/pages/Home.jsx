import Hero from '../components/homepage/Hero';
import Navbar from '../components/core/Navbar';
import Jobs from '../components/homepage/Jobs';
import About from '../components/homepage/About';
import Club from '../components/homepage/Club';
import Chapter from '../components/homepage/Chapter';
import Event from '../components/homepage/Event';
import Faq from '../components/core/Faq';
import Footer from '../components/core/Footer';
import Ranger from '../components/core/Ranger';

const Home = () => {
  return (
    <div className="overflow-x-hidden">
      <Navbar pt="md:pt-9" />
      <Hero />
      <Jobs />
      <Club />
      <About />
      <Chapter />
      <Event />
      <Ranger />
      <Faq />
      <Footer />
    </div>
  );
};

export default Home;
