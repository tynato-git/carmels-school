import React from 'react';
import { 
  Trophy, 
  Sparkles, 
  Palette, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Music,
  Users,
  Compass
} from 'lucide-react';

import gallery1 from '../assets/gallery1.jpg';
import gallery3 from '../assets/gallery3.jpg';
import gallery6 from '../assets/gallery6.jpg';
import gallery7 from '../assets/gallery7.jpg';

import './CampusLife.css';

export default function CampusLife({ onOpenEnquire }) {
  const clubs = [
    { title: "Science & Robotics Guild", icon: <Compass size={22} />, desc: "Hands-on robotics kits, IoT experiments, and annual state innovation fairs." },
    { title: "National Judo & Sports Complex", icon: <Trophy size={22} />, desc: "State & National level championship training in Judo, Athletics, Basketball, and Fitness." },
    { title: "Literary & Debating Society", icon: <Users size={22} />, desc: "Model UN sessions, public speaking, creative writing, and inter-school debates." },
    { title: "Fine Arts & Performing Guild", icon: <Music size={22} />, desc: "Vocal music, classical dance, theatrical plays, and visual arts exhibitions." },
  ];

  return (
    <div className="life-page-container">
      
      {/* 1. Hero Showcase */}
      <section className="life-hero-section">
        <div className="container text-center">
          <span className="sub-badge">Holistic Student Growth</span>
          <h1 className="section-title">Vibrant Campus Life at Carmel’s</h1>
          <p className="section-subtitle">
            Beyond academic rigor, our students explore leadership, athletic honors, artistic pursuits, and lifelong friendships.
          </p>
        </div>
      </section>

      {/* 2. Student Clubs Grid */}
      <section className="life-clubs-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="sub-badge">Co-Curricular Activities</span>
            <h2 className="section-title">Clubs & Student Societies</h2>
          </div>

          <div className="clubs-grid">
            {clubs.map((club, idx) => (
              <div key={idx} className="club-card">
                <div className="club-icon-box">{club.icon}</div>
                <h3>{club.title}</h3>
                <p>{club.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. National Judo Spotlight */}
      <section className="life-spotlight-section">
        <div className="container">
          <div className="spotlight-card">
            <div className="spotlight-img-col">
              <img src={gallery3} alt="National Judo Training Arena" />
            </div>
            <div className="spotlight-info-col">
              <span className="sub-badge">Sports Excellence</span>
              <h2>National Level Judo Arena</h2>
              <p>
                Carmel's is home to a dedicated, professional Judo training academy. Our student athletes regularly represent Tamil Nadu at National Tournaments, winning gold medals and university sports scholarships.
              </p>
              <ul className="spotlight-list">
                <li><CheckCircle2 size={16} className="check-icon" /> Certified Black-Belt national coaches</li>
                <li><CheckCircle2 size={16} className="check-icon" /> Dedicated martial arts mats & safety gear</li>
                <li><CheckCircle2 size={16} className="check-icon" /> Annual Inter-School Sports Tournament host</li>
              </ul>
              <button className="btn-primary-action" onClick={() => { if (onOpenEnquire) onOpenEnquire(); }}>
                Schedule Campus Sports Visit <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
