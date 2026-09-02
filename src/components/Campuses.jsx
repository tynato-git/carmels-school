import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Sparkles, 
  BookOpen, 
  Microscope, 
  Cpu, 
  Trophy, 
  ShieldCheck, 
  Bus, 
  HeartPulse, 
  Palette, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  School,
  GraduationCap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import carousel1 from '../assets/Carousel1.jpg';
import carousel2 from '../assets/Carousel2.jpg';
import carousel3 from '../assets/Carousel3.jpg';
import carmelGardensImg from '../assets/Carmel Gardens.jpeg';
import schoolLogo from '../assets/Logo.png';


// Import 10 Gallery Images
import gallery1 from '../assets/gallery1.jpg';
import smartclass from '../assets/smartclass.jpg';
import judo from '../assets/judo.jpg';
import sportsground from '../assets/sportsground.jpg';
import kg from '../assets/kg.jpg';
import kgschool from '../assets/kgschool.jpeg';
import matricschool from '../assets/matricschool.jpeg';
import school from '../assets/school.jpeg';
import gallery6 from '../assets/cs-lab.jpeg';
import gallery7 from '../assets/gallery7.jpg';
import stage from '../assets/stage.jpg';
import library from '../assets/library.jpeg';
import gallery10 from '../assets/gallery10.jpg';


// Import 6 Lab Photos
import physicsLab from '../assets/physics-lab.jpeg';
import chemistryLab from '../assets/chemistry_lab.jpeg';
import bioLab from '../assets/bio-lab.jpeg';
import biologyLab from '../assets/biology-lab.jpeg';
import botanyLab from '../assets/botany-lab.jpeg';
import csLab from '../assets/cs-lab.jpeg';

import SilverJubileeCarousel from './SilverJubileeCarousel';
import YouTubeSection from './YouTubeSection';
import { supabase } from '../lib/supabase';
import './Campuses.css';

export default function Campuses({ onOpenEnquire, onNavigate, isHomePage = false }) {
  const [activeTab, setActiveTab] = useState('all');

  const facilities = [
    {
      id: 'physics-lab',
      category: 'labs',
      icon: <Microscope size={22} />,
      title: 'Physics Experimental Laboratory',
      desc: 'Equipped with optics, mechanics, circuit boards, and advanced experimental apparatus for high school practical research.',
      img: physicsLab
    },
    {
      id: 'chemistry-lab',
      category: 'labs',
      icon: <Microscope size={22} />,
      title: 'Advanced Chemistry Laboratory',
      desc: 'Modern chemical analysis lab featuring titration setups, safety fume hoods, re-agent stores, and reaction apparatus.',
      img: chemistryLab
    },
    {
      id: 'bio-lab',
      category: 'labs',
      icon: <Microscope size={22} />,
      title: 'Biology & Life Science Practical Lab',
      desc: 'High-precision compound microscopes, preserved biological specimens, slides, and human anatomical models.',
      img: bioLab
    },
    {
      id: 'biology-lab-2',
      category: 'labs',
      icon: <Microscope size={22} />,
      title: 'Microbiology & Cell Biology Lab',
      desc: 'Specialized lab space for cellular study, specimen slide preparation, dissection practice, and environmental biology.',
      img: biologyLab
    },
    {
      id: 'botany-lab',
      category: 'labs',
      icon: <BookOpen size={22} />,
      title: 'Botany & Plant Science Laboratory',
      desc: 'Plant morphology research zone, herbarium collections, plant physiology apparatus, and ecological study tools.',
      img: botanyLab
    },
    {
      id: 'cs-lab',
      category: 'labs',
      icon: <Cpu size={22} />,
      title: 'High-Tech Computer Science & AI Lab',
      desc: 'State-of-the-art computer lab with high-speed internet, coding IDEs, AI educational modules, and individual workstations.',
      img: csLab
    },
    
    {
      id: 'judo-arena',
      category: 'sports',
      icon: <Trophy size={22} />,
      title: 'National Judo Training Arena',
      desc: 'International standard padded tatami mats, martial arts coaching, and national tournament preparation facility.',
      img: judo,
    },
    {
      id: 'sports-complex',
      category: 'sports',
      icon: <Trophy size={22} />,
      title: 'Multipurpose Sports Grounds',
      desc: 'Spacious outdoor courts for athletic training, team sports, annual sports meet, and fitness drills.',
      img: sportsground,
    },
    {
      id: 'montessori-zone',
      category: 'kindergarten',
      icon: <Sparkles size={22} />,
      title: 'Montessori Toddler Play Zone',
      desc: 'Safe, rounded sensory play equipment, activity learning kits, and dedicated early childhood care.',
      img: kg,
    },
    {
      id: 'smart-classrooms',
      category: 'classrooms',
      icon: <BookOpen size={22} />,
      title: 'Digital Smart Classrooms',
      desc: 'Interactive digital whiteboards, audio-visual learning tools, and ergonomic seating setups.',
      img: smartclass,
    },
  ];

  const DEFAULT_GALLERY_IMAGES = [
    { src: carmelGardensImg, title: "Carmel Gardens Campus Entrance", sub: "Woraiyur Main Campus" },
    { src: gallery1, title: "Academic Block & Central Courtyard", sub: "Interactive Learning" },
    { src: smartclass, title: "Interactive Smart Classroom in Session", sub: "Audio-Visual Smart Boards" },
    { src: judo, title: "National Judo Arena & Champion Mats", sub: "Martial Arts Academy" },
    { src: sportsground, title: "Spacious Outdoor Athletics & Sports Field", sub: "Multipurpose Sports Complex" },
    { src: kg, title: "Montessori Early Childhood Activity Zone", sub: "Sensory Toddler Play" },
    { src: gallery6, title: "High-Tech Computer & AI Laboratory", sub: "Gigabit Fiber IT Infrastructure" },
    { src: botanyLab, title: "Advanced Science Experimental Station", sub: "Physics, Chemistry & Biology" },
    { src: stage, title: "Student Cultural Auditorium & Event Stage", sub: "Campus Celebrations" },
    { src: library, title: "Comprehensive Reference Library & Study Hall", sub: "Quiet Reading & Research" },
  ];

  const [galleryImages, setGalleryImages] = useState(DEFAULT_GALLERY_IMAGES);
  const galleryScrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Fetch dynamic campus gallery photos from Supabase
  useEffect(() => {
    const fetchDynamicGallery = async () => {
      try {
        const { data, error } = await supabase
          .from('campus_gallery')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          const formatted = data.map((item) => ({
            src: item.image_url,
            title: item.title,
            sub: item.subtitle || item.category || 'Campus View'
          }));
          setGalleryImages(formatted);
        }
      } catch (err) {
        console.log('Using default gallery fallback');
      }
    };

    fetchDynamicGallery();
  }, []);

  // Smooth Auto-Scroll Motion for Campus Gallery
  useEffect(() => {
  const scrollContainer = galleryScrollRef.current;
  if (!scrollContainer) return;

  let animationFrameId;

  const autoScrollStep = () => {
    if (!isHovered && scrollContainer) {
      scrollContainer.scrollLeft += 0.5;

      // Since content is duplicated, reset exactly at the halfway point
      // (i.e., once the original set has fully scrolled past)
      const halfwayPoint = scrollContainer.scrollWidth / 2;
      if (scrollContainer.scrollLeft >= halfwayPoint) {
        scrollContainer.scrollLeft -= halfwayPoint;
      }
    }
    animationFrameId = requestAnimationFrame(autoScrollStep);
  };

  animationFrameId = requestAnimationFrame(autoScrollStep);

  return () => cancelAnimationFrame(animationFrameId);
}, [isHovered, galleryImages]);

  const handleScrollLeft = () => {
    if (galleryScrollRef.current) {
      galleryScrollRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (galleryScrollRef.current) {
      galleryScrollRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  const filteredFacilities = activeTab === 'all'
    ? facilities
    : facilities.filter(f => f.category === activeTab);

  return (
    <div className="campuses-page-container">
      
      {/* 1. Page Header (hidden when rendered on Home page) */}
      {!isHomePage && (
        <section className="campuses-header-section">
          <div className="container">
            <div className="header-text-box">
              <h1 className="campuses-main-title">Our Campus & Facilities</h1>
              <p className="campuses-subtitle">
                At Carmel’s School, our campus is thoughtfully equipped to support every learner’s journey, blending structured academics, sports, laboratories, and safety.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 2. Carmel's Group of Schools - 1 Row 3 Columns (Image Top, Content Bottom) */}
      <section className="campus-spotlight-section">
        <div className="container">
          
          <div className="schools-cards-grid">
            
            {/* Card 1: Carmel's Matriculation Hr. Sec. School */}
            <div className="school-card-vertical">
              <div className="school-card-top-img-wrapper" onClick={() => { if (onNavigate) onNavigate('matric-school'); }} style={{ cursor: 'pointer' }}>
                <img src={matricschool} alt="Carmel's Matriculation Hr. Sec. School" className="school-card-top-img" />
                <span className="school-card-top-badge">
                  <GraduationCap size={14} /> Matriculation & Hr. Sec.
                </span>
              </div>
              <div className="school-card-bottom-content">
                <span className="location-pill">TRICHY, TAMIL NADU</span>
                <h3 className="school-card-vtitle" onClick={() => { if (onNavigate) onNavigate('matric-school'); }} style={{ cursor: 'pointer' }}>Carmel’s Matriculation Hr. Sec. School</h3>
                <p className="school-card-vdesc">
                  Providing academic excellence under the Tamil Nadu State Board curriculum with specialized Higher Secondary streams, modern science and computer laboratories, and proven academic achievements.
                </p>
                <ul className="school-vhighlights-list">
                  <li><CheckCircle2 size={16} className="list-icon" /> <strong>Board:</strong> Matriculation & Hr. Sec. Board</li>
                  <li><CheckCircle2 size={16} className="list-icon" /> <strong>Classes Offered:</strong> Standards I to XII</li>
                  <li><CheckCircle2 size={16} className="list-icon" /> <strong>Highlights:</strong> Advanced Science & Computer Labs</li>
                  <li><CheckCircle2 size={16} className="list-icon" /> <strong>Contact:</strong> 7868023528 / 7868023548</li>
                </ul>
                <div className="school-vaction-row">
                  <button className="btn-tour-request" onClick={() => { if (onNavigate) onNavigate('matric-school'); }}>
                    Explore School Page <ArrowRight size={15} />
                  </button>
                  <a 
                    href="https://maps.app.goo.gl/CvAP2GwhALXCewoH8" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-spotlight-maps"
                  >
                    <MapPin size={14} /> Location <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>

            {/* Card 2: Carmel's English School (CBSE / ICSE) */}
            <div className="school-card-vertical">
              <div className="school-card-top-img-wrapper" onClick={() => { if (onNavigate) onNavigate('english-school'); }} style={{ cursor: 'pointer' }}>
                <img src={school} alt="Carmel's English School (CBSE / ICSE)" className="school-card-top-img" />
                <span className="school-card-top-badge badge-accent">
                  <BookOpen size={14} /> CBSE / ICSE Board
                </span>
              </div>
              <div className="school-card-bottom-content">
                <span className="location-pill">TRICHY, TAMIL NADU</span>
                <h3 className="school-card-vtitle" onClick={() => { if (onNavigate) onNavigate('english-school'); }} style={{ cursor: 'pointer' }}>Carmel’s English School (CBSE / ICSE)</h3>
                <p className="school-card-vdesc">
                  Delivering progressive English-medium education following CBSE & ICSE standards, designed to foster conceptual clarity, English fluency, digital smart interactive learning, and leadership skills.
                </p>
                <ul className="school-vhighlights-list">
                  <li><CheckCircle2 size={16} className="list-icon" /> <strong>Board:</strong> CBSE & ICSE Curricula</li>
                  <li><CheckCircle2 size={16} className="list-icon" /> <strong>Classes Offered:</strong> Primary to Hr. Sec.</li>
                  <li><CheckCircle2 size={16} className="list-icon" /> <strong>Highlights:</strong> Smart Classrooms & Leadership</li>
                  <li><CheckCircle2 size={16} className="list-icon" /> <strong>Contact:</strong> 7868023528 / 7868023548</li>
                </ul>
                <div className="school-vaction-row">
                  <button className="btn-tour-request btn-accent" onClick={() => { if (onNavigate) onNavigate('english-school'); }}>
                    Explore School Page <ArrowRight size={15} />
                  </button>
                  <a 
                    href="https://maps.app.goo.gl/CvAP2GwhALXCewoH8" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-spotlight-maps"
                  >
                    <MapPin size={14} /> Location <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>

            {/* Card 3: Carmel's Play School */}
            <div className="school-card-vertical">
              <div className="school-card-top-img-wrapper" onClick={() => { if (onNavigate) onNavigate('play-school'); }} style={{ cursor: 'pointer' }}>
                <img src={kgschool} alt="Carmel's Play School" className="school-card-top-img" />
                <span className="school-card-top-badge badge-gold">
                  <Sparkles size={14} /> Early Childhood & KG
                </span>
              </div>
              <div className="school-card-bottom-content">
                <span className="location-pill">TRICHY, TAMIL NADU</span>
                <h3 className="school-card-vtitle" onClick={() => { if (onNavigate) onNavigate('play-school'); }} style={{ cursor: 'pointer' }}>Carmel’s Play School</h3>
                <p className="school-card-vdesc">
                  A vibrant, safe, and joyful foundation for young toddlers. Featuring Montessori activity zones, sensory play environments, and caring educators dedicated to early childhood cognitive growth.
                </p>
                <ul className="school-vhighlights-list">
                  <li><CheckCircle2 size={16} className="list-icon" /> <strong>Level:</strong> Pre-Primary & Kindergarten</li>
                  <li><CheckCircle2 size={16} className="list-icon" /> <strong>Classes Offered:</strong> Playgroup, Pre-KG, LKG & UKG</li>
                  <li><CheckCircle2 size={16} className="list-icon" /> <strong>Highlights:</strong> Montessori Play Zone & Care</li>
                  <li><CheckCircle2 size={16} className="list-icon" /> <strong>Contact:</strong> 7868023528 / 7868023548</li>
                </ul>
                <div className="school-vaction-row">
                  <button className="btn-tour-request btn-gold" onClick={() => { if (onNavigate) onNavigate('play-school'); }}>
                    Explore School Page <ArrowRight size={15} />
                  </button>
                  <a 
                    href="https://maps.app.goo.gl/CvAP2GwhALXCewoH8" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-spotlight-maps"
                  >
                    <MapPin size={14} /> Location <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

            {/* 2.5 Silver Jubilee 25-Years Celebration Mini Carousel (Home Page Only) */}
      {isHomePage && (
        <SilverJubileeCarousel />
      )}

      {/* 2.75 YouTube Video Section (Home Page Only) */}
      {isHomePage && (
        <YouTubeSection />
      )}

      {/* 3. Auto-Scrolling Separated Multi-Card Campus Gallery Section */}
      <section className="campus-gallery-section">
        <div className="container">
          
          <div className="facilities-header text-center">
            <h2 className="facilities-title">Campus Photo Gallery</h2>
            <p className="facilities-sub">Take a visual tour through our state-of-the-art campus learning spaces and school environment.</p>
          </div>

          {/* Separated Cards Carousel Track with Arrow Controls */}
          <div 
            className="gallery-separated-wrapper"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            
            {/* Left Chevron Arrow Button */}
            <button 
              className="gallery-nav-arrow arrow-left" 
              onClick={handleScrollLeft}
              aria-label="Scroll Gallery Left"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Auto-scrolling Continuous Floating Separated Cards Container */}
                      <div className="gallery-separated-track" ref={galleryScrollRef}>
            {[...galleryImages, ...galleryImages].map((img, idx) => (
              <div key={idx} className="gallery-separated-card">
                <img src={img.src} alt={img.title} className="separated-card-img" />
                <div className="separated-card-overlay">
                  <h4>{img.title}</h4>
                  <p>{img.sub}</p>
                </div>
              </div>
            ))}
          </div>

            {/* Right Chevron Arrow Button */}
            <button 
              className="gallery-nav-arrow arrow-right" 
              onClick={handleScrollRight}
              aria-label="Scroll Gallery Right"
            >
              <ChevronRight size={24} />
            </button>

          </div>

        </div>
      </section>
        

      
      {/* 4. Facilities Category Tabs & Grid */}
      <section className="facilities-section">
        <div className="container">
          
          <div className="facilities-header text-center">
            <h2 className="facilities-title">Explore Our School Facilities</h2>
            <p className="facilities-sub">Every facility is designed to enable growth, comfort, and all-round development for every child.</p>
          </div>

          {/* Filter Category Tabs */}
          <div className="category-filter-tabs">
            <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
              All Facilities
            </button>
            <button className={`tab-btn ${activeTab === 'academics' ? 'active' : ''}`} onClick={() => setActiveTab('academics')}>
              Academics & KG
            </button>
            <button className={`tab-btn ${activeTab === 'labs' ? 'active' : ''}`} onClick={() => setActiveTab('labs')}>
              Science & Computer Labs
            </button>
            <button className={`tab-btn ${activeTab === 'sports' ? 'active' : ''}`} onClick={() => setActiveTab('sports')}>
              Sports & Judo Arena
            </button>
            <button className={`tab-btn ${activeTab === 'safety' ? 'active' : ''}`} onClick={() => setActiveTab('safety')}>
              Safety & Transport
            </button>
          </div>

          {/* Facilities Cards Grid */}
          <div className="facilities-cards-grid">
            {filteredFacilities.map((item) => (
              <div key={item.id} className="facility-card">
                {item.img && (
                  <div className="facility-card-img-wrapper">
                    <img src={item.img} alt={item.title} className="facility-card-img" />
                    <div className="facility-icon-badge">{item.icon}</div>
                  </div>
                )}
                <div className="facility-card-content">
                  {!item.img && <div className="facility-icon-box">{item.icon}</div>}
                  <h3 className="facility-card-title">{item.title}</h3>
                  <p className="facility-card-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
