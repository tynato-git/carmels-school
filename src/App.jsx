import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Contact from './components/Contact';
import About from './components/About';
import Campuses from './components/Campuses';
import Results from './components/Results';
import MediaBlog from './components/MediaBlog';
import Footer from './components/Footer';
import EnquireModal from './components/EnquireModal';
import HomeBannerGate from './components/HomeBannerGate';
import AdminDashboard from './components/AdminDashboard';
import silverj from './assets/silverj.jpg';
import carousel2 from './assets/Carousel2.jpg';
import carousel3 from './assets/Carousel3.jpg';
import Admission from './components/Admission';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  Home as HomeIcon,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';
import './App.css';

import MatricSchool from './components/MatricSchool';
import EnglishSchool from './components/EnglishSchool';
import PlaySchool from './components/PlaySchool';
import Careers from './components/Careers';
import Curriculum from './components/Curriculum';
import Faq from './components/Faq';
import Alumni from './components/Alumni';
import Events from './components/Events';
import CertificatesSection from './components/CertificatesSection';
import { supabase } from './lib/supabase';
import { SchoolInfoProvider } from './context/SchoolInfoContext';

const DEFAULT_SLIDES = [
  {
    image: silverj,
    tag: "Welcome to Carmel's School",
    title: "Shaping Leaders of Tomorrow",
    subtitle: "Carmel's Matriculation Higher Secondary School & ICSE School provides world-class education rooted in strong moral values, academic rigor, and holistic student development.",
    button_text: "Contact Us",
    button_link: "contact"
  },
  {
    image: carousel2,
    tag: "Excellence in Education",
    title: "Empowering Young Minds",
    subtitle: "State-of-the-art facilities, modern laboratories, and dedicated educators fostering creativity, critical thinking, and innovation.",
    button_text: "Contact Us",
    button_link: "contact"
  },
  {
    image: carousel3,
    tag: "Holistic Development",
    title: "Nurturing Talent & Character",
    subtitle: "Comprehensive co-curricular activities, leadership clubs, sports programs, and artistic pursuits for complete student growth.",
    button_text: "Contact Us",
    button_link: "contact"
  }
];

export default function App() {
  const getAppPath = () => {
  const hashPath = window.location.hash.replace(/^#/, '');
  return (hashPath || window.location.pathname).toLowerCase();
};

const [currentPage, setCurrentPage] = useState(() => {
  const path = getAppPath();
  if (path.includes('/admin')) return 'admin';
  if (path.includes('/admission')) return 'admission';
  return 'home';
});
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [mediaSubTab, setMediaSubTab] = useState('blog');
  const [isEnquireModalOpen, setIsEnquireModalOpen] = useState(false);
  const [isToppersModalOpen, setIsToppersModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isScrolledHero, setIsScrolledHero] = useState(false);
  const [curriculumSubTab, setCurriculumSubTab] = useState('curriculum');

  // Sync browser back/forward buttons with admin/main pages
    // Sync browser back/forward buttons with admin/main pages
    // Sync browser back/forward buttons with admin/main pages
  useEffect(() => {
  const handleRouteChange = () => {
    const path = getAppPath();

    if (path.includes('/admin')) {
      setCurrentPage('admin');
    } else if (path.includes('/admission')) {
      setCurrentPage('admission');
    } else {
      setCurrentPage('home');
    }
  };

  window.addEventListener('popstate', handleRouteChange);
  window.addEventListener('hashchange', handleRouteChange);

  return () => {
    window.removeEventListener('popstate', handleRouteChange);
    window.removeEventListener('hashchange', handleRouteChange);
  };
}, []);

  // Fetch dynamic slides from Supabase carousel_slides table
  useEffect(() => {
    const fetchDynamicSlides = async () => {
      try {
        const { data, error } = await supabase
          .from('carousel_slides')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .limit(5);

        if (!error && data && data.length > 0) {
          const formatted = data.map((item) => ({
            image: item.image_url,
            tag: item.tag || "Welcome to Carmel's School",
            title: item.title,
            subtitle: item.subtitle,
            button_text: item.button_text || 'Contact Us',
            button_link: item.button_link || 'contact'
          }));
          setSlides(formatted);
        }
      } catch (err) {
        console.log('Using default slides fallback');
      }
    };

    fetchDynamicSlides();
  }, []);

  // Auto trigger Home Popup Banner (poster or toppers announcement) when site is loaded first time in browser session
   // Trigger Home Popup Banner (poster or toppers announcement) only on actual page load/refresh — not on in-app section navigation
  useEffect(() => {
    if (currentPage === 'admin') return;
    setIsToppersModalOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseToppersModal = () => {
    setIsToppersModalOpen(false);
  };

  // Handle page navigation
    const handleNavigate = (pageName, subTab = null) => {
  setCurrentPage(pageName);
  if (pageName === 'admin') {
  window.location.hash = '/admin/dashboard';
} else if (pageName === 'admission') {
  window.location.hash = '/admission';
} else if (
  window.location.hash.toLowerCase().includes('/admin') ||
  window.location.hash.toLowerCase().includes('/admission')
) {
  window.location.hash = '';
}

  if (pageName === 'curriculum' && subTab) {
    setCurriculumSubTab(subTab);
  } else if (pageName === 'curriculum' && !subTab) {
    setCurriculumSubTab('curriculum');
  } else if (subTab) {
    setMediaSubTab(subTab);
  } else if (pageName === 'media' && !subTab) {
    setMediaSubTab('blog');
  }
  window.scrollTo(0, 0);
};

  // Scroll listener for hero width contraction motion effect on home page
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolledHero(true);
      } else {
        setIsScrolledHero(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Automatic slide transition every 2 seconds (2000ms) on home page
  useEffect(() => {
    if (currentPage !== 'home' || isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [currentPage, isPaused]);

  const handlePrev = () => {
    setCurrentSlide((prevSlide) => 
      prevSlide === 0 ? slides.length - 1 : prevSlide - 1
    );
  };

  const handleNext = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const getPageTitle = () => {
    switch(currentPage) {
      case 'home': return 'Home';
      case 'about': return 'About Us';
      case 'campuses': return 'Our Campuses';
      case 'results': return 'Academic Results & Achievements';
      case 'media': return 'News & Media';
      case 'contact': return 'Contact Us';
      case 'careers': return 'Careers & Faculty Admissions';
      case 'curriculum': return 'Academics';
      case 'faq': return 'Frequently Asked Questions (FAQs)';
      case 'alumni': return 'Carmel’s Global Alumni Network';
      case 'events': return 'Upcoming Events & Calendar';
      case 'matric-school': return 'Carmel’s Matriculation Hr. Sec. School';
      case 'english-school': return 'Carmel’s English School (CBSE / ICSE)';
      case 'play-school': return 'Carmel’s Play School';
      default: return 'Carmel’s Group of Schools';
    }
  };

    if (currentPage === 'admin') {
    return (
      <SchoolInfoProvider>
        <AdminDashboard onNavigateHome={() => handleNavigate('home')} />
      </SchoolInfoProvider>
    );
  }

  if (currentPage === 'admission') {
    return (
      <SchoolInfoProvider>
        <Admission onNavigateHome={() => handleNavigate('home')} />
      </SchoolInfoProvider>
    );
  }

  return (
    <SchoolInfoProvider>
      <div className="app-container">
        {/* Floating Header Navbar */}
        <Navbar 
          currentPage={currentPage} 
          onNavigate={handleNavigate} 
          onOpenAdmin={() => handleNavigate('admin')}
        />

        {/* Conditionally Render Banner: Carousel on Home, Compact Subpage Banner on Other Pages */}
        {currentPage === 'home' ? (
          <section 
            className={`carousel-container ${isScrolledHero ? 'hero-scrolled-motion' : ''}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                style={{ 
                  backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.65)), url(${slide.image})` 
                }}
              >
                <div className="carousel-slide-content">
                  <span className="carousel-tag">{slide.tag}</span>
                  <h1 className="carousel-title">{slide.title}</h1>
                  <p className="carousel-subtitle">{slide.subtitle}</p>
                  <div className="carousel-btn-group">
                    <button onClick={() => handleNavigate(slide.button_link || 'contact')} className="btn-hero-primary">
                      {slide.button_text || 'Contact Us'} <ArrowRight size={18} />
                    </button>
                    <button onClick={() => handleNavigate('contact')} className="btn-hero-secondary">
                      Apply For Admission 2026-27
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Carousel Navigation Arrow Buttons */}
            <button 
              className="carousel-arrow carousel-arrow-left" 
              onClick={handlePrev}
              aria-label="Previous Slide"
            >
              <ChevronLeft size={28} />
            </button>

            <button 
              className="carousel-arrow carousel-arrow-right" 
              onClick={handleNext}
              aria-label="Next Slide"
            >
              <ChevronRight size={28} />
            </button>

            {/* Carousel Indicator Dots */}
            <div className="carousel-indicators">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`indicator-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </section>
        ) : (
          /* Subpage Compact Header Banner (For Contact, About, Campuses, etc.) */
          <section 
            className="subpage-header-banner"
            style={{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.65)), url(${carousel2})` }}
          >
            <div className="subpage-banner-content">
              <h1 className="subpage-banner-title">{getPageTitle()}</h1>
              <div className="subpage-breadcrumb">
                <button onClick={() => handleNavigate('home')} className="crumb-home-btn">
                  <HomeIcon size={14} /> Home
                </button>
                <ChevronRightIcon size={14} className="crumb-separator" />
                <span className="crumb-current">{getPageTitle()}</span>
              </div>
            </div>
          </section>
        )}

        {/* Main Page Content */}
        <main className="main-body-content">
          {currentPage === 'home' && (
            <>
              <Campuses onOpenEnquire={() => setIsEnquireModalOpen(true)} onNavigate={handleNavigate} isHomePage={true} />
              <CertificatesSection />
            </>
          )}
          {currentPage === 'contact' && <Contact />}
          {currentPage === 'about' && <About onOpenEnquire={() => setIsEnquireModalOpen(true)} />}
          {currentPage === 'campuses' && <Campuses onOpenEnquire={() => setIsEnquireModalOpen(true)} onNavigate={handleNavigate} />}
          {currentPage === 'results' && <Results onOpenEnquire={() => setIsEnquireModalOpen(true)} />}
          {currentPage === 'media' && <MediaBlog initialTab={mediaSubTab} />}
          {currentPage === 'careers' && <Careers onOpenEnquire={() => setIsEnquireModalOpen(true)} />}
          {currentPage === 'curriculum' && <Curriculum onOpenEnquire={() => setIsEnquireModalOpen(true)} initialSubTab={curriculumSubTab} />}
          {currentPage === 'faq' && <Faq onOpenEnquire={() => setIsEnquireModalOpen(true)} />}
          {currentPage === 'alumni' && <Alumni onOpenEnquire={() => setIsEnquireModalOpen(true)} />}
          {currentPage === 'events' && <Events onOpenEnquire={() => setIsEnquireModalOpen(true)} />}
          {currentPage === 'matric-school' && <MatricSchool onOpenEnquire={() => setIsEnquireModalOpen(true)} onNavigate={handleNavigate} />}
          {currentPage === 'english-school' && <EnglishSchool onOpenEnquire={() => setIsEnquireModalOpen(true)} onNavigate={handleNavigate} />}
          {currentPage === 'play-school' && <PlaySchool onOpenEnquire={() => setIsEnquireModalOpen(true)} onNavigate={handleNavigate} />}
        </main>

        {/* Main Footer Component */}
        <Footer onOpenEnquire={() => setIsEnquireModalOpen(true)} />

        {/* Global Enquire Modal Popup */}
        <EnquireModal 
          isOpen={isEnquireModalOpen} 
          onClose={() => setIsEnquireModalOpen(false)} 
        />

        {/* First Time Site Load Home Popup Banner (poster or toppers announcement, chosen in Admin) */}
        <HomeBannerGate 
          isOpen={isToppersModalOpen} 
          onClose={handleCloseToppersModal}
          onViewResults={() => handleNavigate('results')}
        />
      </div>
    </SchoolInfoProvider>
  );
}
