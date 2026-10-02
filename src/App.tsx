import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Promo from '@/components/Promo';
import Blog from '@/components/Blog';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Services />
      <Promo />
      <Blog />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
