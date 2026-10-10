import { I18nProvider } from '@/i18n/I18nContext';
import Preloader from '@/components/Preloader';
import CustomCursor from '@/components/CustomCursor';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HeroScroll from '@/components/HeroScroll';
import About from '@/components/About';
import Advantages from '@/components/Advantages';
import Audience from '@/components/Audience';
import Curriculum from '@/components/Curriculum';
import Results from '@/components/Results';
import Videos from '@/components/Videos';
import FAQ from '@/components/FAQ';
import ApplicationForm from '@/components/ApplicationForm';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';

function App() {
  return (
    <I18nProvider>
      <Preloader />
      <CustomCursor />
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <HeroScroll />
        <Advantages />
        <Audience />
        <Curriculum />
        <Results />
        <Videos />
        <FAQ />
        <ApplicationForm />
      </main>
      <Footer />
      <FloatingButtons />
    </I18nProvider>
  );
}

export default App;
