import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  X
} from 'lucide-react';
import barathamImg from '../assets/baratham.jpg';
import groupPhotoImg from '../assets/group photo.jpg';
import knNeehruImg from '../assets/kn neehru.jpg';
import staffImg from '../assets/staff.jpg';
import './SilverJubileeCarousel.css';

export default function SilverJubileeCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedZoomImg, setSelectedZoomImg] = useState(null);

  // Exact 4 Silver Jubilee photos in requested order:
  // 1. baratham -> 2. group photo -> 3. kn neehru -> 4. staff
  const jubileeSlides = [
    {
      id: 1,
      image: barathamImg,
      tag: "CULTURAL EXTRAVAGANZA",
      title: "Classical Bharatanatyam & Traditional Stage Performance",
      desc: "A grand cultural performance by our talented students showcasing traditional Bharatanatyam dance, cultural heritage, and stage artistry at the Silver Jubilee celebrations."
    },
    {
      id: 2,
      image: groupPhotoImg,
      tag: "SILVER JUBILEE COMMEMORATION",
      title: "Grand Silver Jubilee Commemorative Group Gathering",
      desc: "Management, dignitaries, esteemed correspondent, principals, teachers, and student representatives coming together to mark 25 glorious years of Carmel's educational journey."
    },
    {
      id: 3,
      image: knNeehruImg,
      tag: "CHIEF GUEST FELICITATIONS",
      title: "Inauguration & Honors with Hon'ble Minister K.N. Nehru",
      desc: "Hon'ble Minister for Municipal Administration Thiru K.N. Nehru gracing Carmel's 25th Silver Jubilee as Chief Guest, addressing the gathering and honoring the institution's achievements."
    },
    {
      id: 4,
      image: staffImg,
      tag: "FACULTY & STAFF HONORS",
      title: "Honoring 25 Years of Dedicated Teachers & Staff",
      desc: "Special felicitation of Carmel's committed educators, faculty, and administrative staff whose dedication, passion, and excellence have shaped thousands of successful alumni."
    }
  ];

  // Auto slide transition every 4 seconds
  useEffect(() => {
    if (!isAutoPlaying || selectedZoomImg !== null) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % jubileeSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, selectedZoomImg, jubileeSlides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? jubileeSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % jubileeSlides.length);
  };

  const activeSlide = jubileeSlides[currentSlide];

  return (
    <section className="silver-jubilee-section">
      <div className="container">
        
        {/* Section Heading & Subtitle */}
        <div className="jubilee-header text-center">
          <div className="jubilee-badge-pill">
            <Sparkles size={16} /> 25 GLORIOUS YEARS • 1999–2024
          </div>
          <h2 className="jubilee-section-title">Silver Jubilee Celebrations (25 Years)</h2>
          <p className="jubilee-section-subtitle">
            Commemorating a quarter-century of academic rigor, holistic grooming, and values with esteemed dignitaries, beloved faculty, and student celebrations.
          </p>
        </div>

        {/* Mini Carousel Split Container */}
        <div 
          className="jubilee-carousel-card"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          
          {/* Left Column: Visual Showcase & Active Image Frame */}
          <div className="jubilee-image-stage">
            <img 
              src={activeSlide.image} 
              alt={activeSlide.title} 
              className="jubilee-main-photo"
            />

            {/* Carousel Arrow Navigation */}
            <button className="jubilee-nav-arrow arrow-left" onClick={(e) => { e.stopPropagation(); handlePrev(); }} aria-label="Previous Slide">
              <ChevronLeft size={24} />
            </button>
            <button className="jubilee-nav-arrow arrow-right" onClick={(e) => { e.stopPropagation(); handleNext(); }} aria-label="Next Slide">
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Right Column: Title, Content, and Thumbnail Switchers */}
          <div className="jubilee-info-stage">
            <span className="jubilee-tag-chip">{activeSlide.tag}</span>
            <h3 className="jubilee-info-title">{activeSlide.title}</h3>
            <p className="jubilee-info-desc">{activeSlide.desc}</p>

            {/* 4 Interactive Thumbnail Cards */}
            <div className="jubilee-thumbs-row">
              {jubileeSlides.map((slide, idx) => {
                const isSelected = idx === currentSlide;
                return (
                  <button 
                    key={slide.id}
                    className={`jubilee-thumb-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                    title={slide.title}
                  >
                    <img src={slide.image} alt={slide.title} className="thumb-mini-img" />
                    <span className="thumb-index-num">{idx + 1}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Progress Bar */}
            <div className="jubilee-progress-track">
              {jubileeSlides.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`progress-bar-segment ${idx === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(idx)}
                />
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* Lightbox Zoom Modal for Silver Jubilee Photos */}
      {selectedZoomImg && (
        <div className="jubilee-lightbox-overlay" onClick={() => setSelectedZoomImg(null)}>
          <div className="jubilee-lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <button className="jubilee-modal-close" onClick={() => setSelectedZoomImg(null)} aria-label="Close">
              <X size={24} />
            </button>
            <img src={selectedZoomImg} alt="Silver Jubilee Celebration" className="jubilee-modal-img" />
          </div>
        </div>
      )}

    </section>
  );
}
