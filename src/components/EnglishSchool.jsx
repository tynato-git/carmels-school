import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  ExternalLink,
  Globe,
  Cpu,
  Layers,
  Users
} from 'lucide-react';

import carousel3 from '../assets/Carousel3.jpg';
import gallery2 from '../assets/gallery2.jpg';
import gallery4 from '../assets/gallery4.jpg';
import gallery6 from '../assets/gallery6.jpg';
import gallery7 from '../assets/gallery7.jpg';
import school from '../assets/school.jpeg';
import smartclass from '../assets/smartclass.jpg';

import './EnglishSchool.css';

export default function EnglishSchool({ onOpenEnquire, onNavigate }) {
  const highlights = [
    { title: "CBSE & ICSE Standards", icon: <Award size={22} />, desc: "Rigorous curriculum emphasizing analytical reasoning, literature, and global competencies." },
    { title: "Smart Interactive Classrooms", icon: <BookOpen size={22} />, desc: "Digital interactive smart boards, multimedia modules, and visual learning aids." },
    { title: "English Fluency & Debating", icon: <Globe size={22} />, desc: "Dedicated phonics, public speaking, model United Nations, and literature clubs." },
    { title: "STEM & Coding Labs", icon: <Cpu size={22} />, desc: "Computer education, coding workshops, and practical scientific experimentation." },
  ];

  return (
    <div className="school-page-container">
      
      {/* 1. Hero Section */}
      <section className="school-hero-section">
        <div className="container">
          <div className="school-hero-card">
            <div className="school-hero-img-col">
              <img src={school} alt="Carmel's English School CBSE / ICSE" className="school-hero-img" />
              <span className="school-badge-pill badge-accent">
                <BookOpen size={16} /> CBSE & ICSE Curricula
              </span>
            </div>
            <div className="school-hero-info-col">
              <span className="location-pill">WORAIYUR, TRICHY</span>
              <h1 className="school-main-heading">Carmel’s English School (CBSE / ICSE)</h1>
              <p className="school-lead-text">
                Fostering global educational standards with emphasis on English communication, critical thinking, interactive smart classrooms, and leadership development.
              </p>
              
              <div className="school-stats-row">
                <div className="stat-box">
                  <span className="stat-number">CBSE/ICSE</span>
                  <span className="stat-label">National Curricula</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Smart Classrooms</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">Pri - Hr. Sec</span>
                  <span className="stat-label">Classes Offered</span>
                </div>
              </div>

              <div className="school-hero-actions">
                <button className="btn-primary-action btn-accent" onClick={() => { if (onOpenEnquire) onOpenEnquire(); }}>
                  Enquire Admissions 2026-27 <ArrowRight size={16} />
                </button>
                <a href="https://maps.app.goo.gl/CvAP2GwhALXCewoH8" target="_blank" rel="noopener noreferrer" className="btn-secondary-action">
                  <MapPin size={15} /> Campus Location <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Highlights Grid */}
      <section className="english-highlights-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="sub-badge">Global Education</span>
            <h2 className="section-title">Why Choose Carmel’s English School</h2>
            <p className="section-subtitle">
              We empower learners with high conceptual clarity, expressive English communication skills, and digital technology integration.
            </p>
          </div>

          <div className="english-highlights-grid">
            {highlights.map((item, index) => (
              <div key={index} className="english-card">
                <div className="english-icon-box">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Smart Learning & AV Showcase */}
      <section className="english-showcase-section">
        <div className="container">
          <div className="showcase-split-card">
            <div className="showcase-img-col">
              <img src={smartclass} alt="Smart Classroom" />
            </div>
            <div className="showcase-info-col">
              <span className="sub-badge">Digital Pedagogy</span>
              <h2 className="section-title">Smart Interactive Classrooms</h2>
              <p className="showcase-desc">
                Every classroom is equipped with ultra-modern smart displays, interactive learning software, and high-speed multimedia connectivity to transform abstract concepts into vivid visual experiences.
              </p>
              <ul className="showcase-list">
                <li><CheckCircle2 size={16} className="check-icon" /> Audio-Visual modules for Science & Mathematics</li>
                <li><CheckCircle2 size={16} className="check-icon" /> Interactive quizzes & collaborative group projects</li>
                <li><CheckCircle2 size={16} className="check-icon" /> Individual student tracking & personalized learning paths</li>
              </ul>
              <button className="btn-primary-action btn-accent" onClick={() => { if (onOpenEnquire) onOpenEnquire(); }}>
                Schedule a Smart Class Tour <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bottom CTA Section */}
      <section className="school-cta-section">
        <div className="container">
          <div className="school-cta-card">
            <h2>Admissions Open for Carmel’s English School</h2>
            <p>Enroll your child for global curriculum standards, digital learning, and holistic personality development.</p>
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
