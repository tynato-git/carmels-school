import React from 'react';
import { 
  Sparkles, 
  HeartPulse, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  ExternalLink,
  Smile,
  Palette,
  Sun,
  Baby
} from 'lucide-react';

import kgschool from '../assets/kgschool.jpeg';
import kg from '../assets/kg.jpg';
import gallery2 from '../assets/gallery2.jpg';
import gallery10 from '../assets/gallery10.jpg';

import './PlaySchool.css';

export default function PlaySchool({ onOpenEnquire, onNavigate }) {
  const pillars = [
    { title: "Montessori Activity Zone", icon: <Sparkles size={22} />, desc: "Child-centered activity kits, fine motor tools, puzzles, and sensory learning modules." },
    { title: "Toddler Safety & Hygiene", icon: <ShieldCheck size={22} />, desc: "CCTV monitored play areas, rounded safety furniture, and continuous hygienic sanitation." },
    { title: "Creative Arts & Music", icon: <Palette size={22} />, desc: "Finger painting, rhythm, rhymes, storytelling, and imaginative play zones." },
    { title: "Caring Toddler Mentors", icon: <Smile size={22} />, desc: "Dedicated, highly qualified pre-school teachers offering individual warmth and care." },
  ];

  return (
    <div className="school-page-container">
      
      {/* 1. Hero Section */}
      <section className="school-hero-section">
        <div className="container">
          <div className="school-hero-card">
            <div className="school-hero-img-col">
              <img src={kgschool} alt="Carmel's Play School Activity Zone" className="school-hero-img" />
              <span className="school-badge-pill badge-gold">
                <Sparkles size={16} /> Playgroup, Pre-KG, LKG & UKG
              </span>
            </div>
            <div className="school-hero-info-col">
              <span className="location-pill">WORAIYUR, TRICHY</span>
              <h1 className="school-main-heading">Carmel’s Play School</h1>
              <p className="school-lead-text">
                A warm, safe, and joyful early learning haven for young toddlers. Blending Montessori play-and-learn activities, sensory discovery, and caring mentorship to build lifelong curiosity.
              </p>
              
              <div className="school-stats-row">
                <div className="stat-box">
                  <span className="stat-number stat-gold">Pre-KG to UKG</span>
                  <span className="stat-label">Levels Offered</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number stat-gold">Montessori</span>
                  <span className="stat-label">Activity Method</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number stat-gold">100% Safe</span>
                  <span className="stat-label">CCTV Monitored</span>
                </div>
              </div>

              <div className="school-hero-actions">
                <button className="btn-primary-action btn-gold" onClick={() => { if (onOpenEnquire) onOpenEnquire(); }}>
                  Enquire Admission 2026-27 <ArrowRight size={16} />
                </button>
                <a href="https://maps.app.goo.gl/CvAP2GwhALXCewoH8" target="_blank" rel="noopener noreferrer" className="btn-secondary-action">
                  <MapPin size={15} /> Play School Location <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Pillars Section */}
      <section className="play-pillars-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="sub-badge badge-gold-sub">Early Foundation</span>
            <h2 className="section-title">Nurturing Every Child's First Steps</h2>
            <p className="section-subtitle">
              Our kindergarten program is built on love, discovery, physical agility, and social emotional growth.
            </p>
          </div>

          <div className="play-pillars-grid">
            {pillars.map((item, index) => (
              <div key={index} className="play-card">
                <div className="play-icon-box">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Safety & Dispersal Security */}
      <section className="play-safety-section">
        <div className="container">
          <div className="safety-split-card">
            <div className="safety-info-col">
              <span className="sub-badge badge-gold-sub">Student Security</span>
              <h2 className="section-title">Safe Dispersal & Toddler Security</h2>
              <p className="safety-desc">
                We prioritize child safety above all. Carmel’s Play School utilizes a strict safe transport card system during student dispersal, GPS-monitored buses, and dedicated security personnel.
              </p>
              <ul className="safety-list">
                <li><CheckCircle2 size={16} className="check-icon gold-icon" /> Mandatory parent dispersal authorization cards</li>
                <li><CheckCircle2 size={16} className="check-icon gold-icon" /> GPS tracking & female attendants on school transport</li>
                <li><CheckCircle2 size={16} className="check-icon gold-icon" /> Clean, child-friendly rest zones and dining facilities</li>
              </ul>
              <button className="btn-primary-action btn-gold" onClick={() => { if (onOpenEnquire) onOpenEnquire(); }}>
                Book a Toddler Campus Tour <ArrowRight size={16} />
              </button>
            </div>
            <div className="safety-img-col">
              <img src={kg} alt="Safe Dispersal Transport" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bottom CTA */}
      <section className="school-cta-section">
        <div className="container">
          <div className="school-cta-card">
            <h2>Enroll Your Child in Carmel’s Play School</h2>
            <p>Give your toddler a head start with joyful Montessori learning, caring educators, and a safe play environment.</p>
            <div className="cta-button-row">
              <button className="btn-cta-gold" onClick={() => { if (onOpenEnquire) onOpenEnquire(); }}>
                Apply For Admission 2026-27 <ArrowRight size={16} />
              </button>
              {onNavigate && (
                <button className="btn-cta-outline" onClick={() => onNavigate('campuses')}>
                  Back to All Campuses
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
