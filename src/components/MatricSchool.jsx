import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Microscope, 
  Cpu, 
  Trophy, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink,
  Sparkles,
  School,
  Building2,
  Users
} from 'lucide-react';

import carmelGardensImg from '../assets/Carmel Gardens.jpeg';
import physicsLab from '../assets/physics-lab.jpeg';
import chemistryLab from '../assets/chemistry_lab.jpeg';
import bioLab from '../assets/bio-lab.jpeg';
import csLab from '../assets/cs-lab.jpeg';
import matricschool from '../assets/matricschool.jpeg';
import gallery1 from '../assets/gallery1.jpg';
import gallery3 from '../assets/gallery3.jpg';
import gallery4 from '../assets/gallery4.jpg';
import gallery7 from '../assets/gallery7.jpg';

import './MatricSchool.css';

export default function MatricSchool({ onOpenEnquire, onNavigate }) {
  const streamGroups = [
    { code: "Group 1", title: "Mathematics, Physics, Chemistry, Computer Science", desc: "For students aspiring for Engineering, Computer Science & Tech careers.", medium: "ENGLISH" },
    { code: "Group 2", title: "Mathematics, Physics, Chemistry, Biology", desc: "Ideal for Medical, Dental, Pharmacy & Life Science aspirants.", medium: "ENGLISH" },
    { code: "Group 3", title: "Botany, Physics, Chemistry, Zoology", desc: "Focused on Pure Science research, Bio-technology & Agricultural studies.", medium: "ENGLISH" },
    { code: "Group 4", title: "Commerce, Accountancy, Economics, Computer Application", desc: "Designed for CA, Business Management, Fintech & IT Applications.", medium: "ENGLISH" },
    { code: "Group 5", title: "Commerce, Accountancy, Economics, Business Maths", desc: "Perfect for Chartered Accountancy, Finance, Economics & Analytics.", medium: "ENGLISH" },
    { code: "Group 6", title: "History, Geography, Economics, Political Science", desc: "Tailored for Civil Services (UPSC/TNPSC), Law & Humanities.", medium: "ENGLISH" },
  ];

  const labs = [
    { title: "Physics Experimental Lab", img: physicsLab, desc: "Optics, mechanics, circuit boards, and advanced experimental apparatus." },
    { title: "Advanced Chemistry Lab", img: chemistryLab, desc: "Chemical analysis, titration setups, reagent stores, and safety fume hoods." },
    { title: "Biology & Life Science Lab", img: bioLab, desc: "High-precision compound microscopes, preserved specimens, and slide preparation." },
    { title: "High-Tech AI & Computer Lab", img: csLab, desc: "High-speed workstations, coding IDEs, AI educational modules, and gigabit fiber internet." },
  ];

  return (
    <div className="school-page-container">
      
      {/* 1. Hero Section */}
      <section className="school-hero-section">
        <div className="container">
          <div className="school-hero-card">
            <div className="school-hero-img-col">
              <img src={matricschool} alt="Carmel's Matriculation Hr. Sec. School Campus" className="school-hero-img" />
              <span className="school-badge-pill">
                <GraduationCap size={16} /> Tamil Nadu State Board Affiliated
              </span>
            </div>
            <div className="school-hero-info-col">
              <span className="location-pill">WORAIYUR, TRICHY</span>
              <h1 className="school-main-heading">Carmel’s Matriculation Hr. Sec. School</h1>
              <p className="school-lead-text">
                Nurturing academic excellence, critical thinking, and moral values since 2002. Offering comprehensive State Board education from Standards I through XII with specialized Higher Secondary streams.
              </p>
              
              <div className="school-stats-row">
                <div className="stat-box">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Board Pass Record</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">6+</span>
                  <span className="stat-label">Hr. Sec. Streams</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">4</span>
                  <span className="stat-label">Advanced Science Labs</span>
                </div>
              </div>

              <div className="school-hero-actions">
                <button className="btn-primary-action" onClick={() => { if (onOpenEnquire) onOpenEnquire(); }}>
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

      {/* 2. Academic Philosophy & Streams */}
      <section className="school-details-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="sub-badge">Higher Secondary Education</span>
            <h2 className="section-title">Specialized Higher Secondary Streams</h2>
            <p className="section-subtitle">
              Students in Classes XI and XII choose from six curated academic groups to prepare for top professional entrance exams and university degrees.
            </p>
          </div>

          <div className="streams-cards-grid">
            {streamGroups.map((group, index) => (
              <div key={index} className="stream-card">
                <div className="stream-header">
                  <span className="group-code">{group.code}</span>
                  <span className="medium-badge">{group.medium} MEDIUM</span>
                </div>
                <h3 className="stream-title">{group.title}</h3>
                <p className="stream-desc">{group.desc}</p>
                <div className="stream-footer">
                  <CheckCircle2 size={16} className="check-icon" /> State Board Syllabus & Board Exam Guidance
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Laboratories & Academic Facilities */}
      <section className="school-labs-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="sub-badge">State-of-the-Art Labs</span>
            <h2 className="section-title">Laboratories & Practical Learning</h2>
            <p className="section-subtitle">
              Equipped with modern experimental apparatus and individual workstation setups for hands-on research and discovery.
            </p>
          </div>

          <div className="labs-grid">
            {labs.map((lab, index) => (
              <div key={index} className="lab-card">
                <div className="lab-img-wrapper">
                  <img src={lab.img} alt={lab.title} />
                </div>
                <div className="lab-content">
                  <h3>{lab.title}</h3>
                  <p>{lab.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Sports & Co-Curricular Excellence */}
      <section className="school-sports-section">
        <div className="container">
          <div className="sports-split-card">
            <div className="sports-content-col">
              <span className="sub-badge">National Level Honors</span>
              <h2 className="section-title">Sports Complex & National Judo Arena</h2>
              <p className="sports-desc">
                Physical education is integral to student development at Carmel's. Our campus features a specialized Judo training arena where students have won state and national tournament medals, alongside outdoor athletic fields.
              </p>
              <ul className="sports-highlights-list">
                <li><CheckCircle2 size={16} className="check-icon" /> National and State level Judo Champions</li>
                <li><CheckCircle2 size={16} className="check-icon" /> Dedicated sports coaches & fitness instructors</li>
                <li><CheckCircle2 size={16} className="check-icon" /> Annual Sports Day & Inter-School Athletic competitions</li>
              </ul>
              <button className="btn-know-more" onClick={() => { if (onOpenEnquire) onOpenEnquire(); }}>
                Schedule a Campus Visit <ArrowRight size={16} />
              </button>
            </div>
            <div className="sports-img-col">
              <img src={gallery3} alt="National Judo Arena" className="sports-img" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom Call to Action Banner */}
      <section className="school-cta-section">
        <div className="container">
          <div className="school-cta-card">
            <h2>Join Carmel’s Matriculation Hr. Sec. School</h2>
            <p>Admissions are now open for the Academic Year 2026-27. Secure your child's seat for bright academic prospects.</p>
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
