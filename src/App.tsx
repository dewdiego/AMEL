import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Cotizador from '@/components/Cotizador';
import Honorarios from '@/components/Honorarios';
import Promo from '@/components/Promo';
import Blog from '@/components/Blog';
import Faq from '@/components/Faq';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Services />
      <Cotizador />
      <Honorarios />
      <Promo />
      <Blog />
      <Faq />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
