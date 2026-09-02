import React, { useState } from 'react';
import { 
  Sparkles, 
  Eye, 
  Target, 
  Award, 
  BookOpen, 
  Users, 
  ShieldCheck, 
  HeartHandshake, 
  CheckCircle2, 
  ArrowRight,
  GraduationCap,
  Globe,
  Compass,
  Cpu,
  Layers
} from 'lucide-react';
import carousel1 from '../assets/Carousel1.jpg';
import carousel2 from '../assets/Carousel2.jpg';
import school from '../assets/school.jpeg';
import carousel5 from '../assets/Carousel5.jpg';
import schoolLogo from '../assets/Logo.png';
import leaders1 from '../assets/corresspondent.jpg';
import principal from '../assets/principal.jpeg';
import chairman from '../assets/chairman.jpeg';
import leaders3 from '../assets/leaders3.jpeg';
import campusImg from '../assets/campus.jpeg';
import './About.css';

export default function About({ onOpenEnquire }) {
  const [activeTab, setActiveTab] = useState('intro');

  return (
    <div className="about-redesign-container">
      
      {/* SECTION 1: Top Motto & 3-Image Showcase Gallery */}
      <section className="about-hero-showcase">
        <div className="container">
          
          {/* Centered Motto Banner */}
          <div className="hero-motto-wrapper">
            <span className="motto-lead">“Where Tradition Meets Global Excellence.”</span>
            <h2 className="motto-heading">
              Blending heritage with innovation to shape <strong>future-ready leaders</strong>
            </h2>
          </div>

          {/* 3-Image Gallery Row */}
          <div className="gallery-three-row">
            <div className="gallery-card card-left">
              <img src={leaders1} alt="Carmel Leadership 1" />
            </div>
            <div className="gallery-card card-center">
              <img src={carousel5} alt="Carmel Leadership 2" />
            </div>
            <div className="gallery-card card-right">
              <img src={leaders3} alt="Carmel Leadership 3" />
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: Carmel's An Introduction (Motto Card Layout) */}
      <section className="intro-motto-section">
        <div className="container">
          <div className="motto-split-card">
            <div className="motto-image-col">
              <img src={school} alt="Carmel School Campus" className="motto-main-img" />
            </div>
            <div className="motto-content-col">
              <span className="section-badge-tag">CARMEL’S PHILOSOPHY</span>
              <h2 className="motto-card-title">Carmel’s – An Introduction</h2>
              <p className="motto-card-desc">
                Carmel Public Charitable trust founded in the year 1994, started its venture as a small play school and a crèche for working parents on June 26th, 1999. This was expanded with great zeal and dedication into Carmel’s Nursery and Primary School. The new building in its own big campus was inaugurated on October 21st, 2002.
              </p>
              <p className="motto-card-desc">
                Carmel’s Nursery and Primary School was upgraded into Carmel’s Matriculation School in the year 2006. Devoted and dedicated faculty, highly qualified, caring staff with modern facilities and amenities geared the school to the top.
              </p>
              <p className="motto-card-desc highlighted">
                In Carmel’s Matriculation Hr. Sec. School, students are moulded into reflective learners and critical thinkers. The emphasis is on being visually creative, developing the right study habits, and acquiring in-depth conceptual knowledge.
              </p>
              <button 
                className="btn-know-more" 
                onClick={() => { if (onOpenEnquire) onOpenEnquire(); }}
              >
                Know More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: "Our Promise" Honeycomb / Hexagon Hive Layout */}
      <section className="our-promise-section">
        <div className="container">
          
          <div className="promise-header text-center">
            <h2 className="promise-title">Our Promise</h2>
            <p className="promise-subtitle">
              What makes a student a complete individual? At Carmel’s, we have identified a set of values that define, refine, and build an individual. Because we believe it’s not just quality academics or top-ranks, but an ecosystem of these values that makes a student stand out in a crowd of commons. Carmel’s considers itself as every student’s second home.
            </p>
          </div>

          {/* Exact Honeycomb Hexagonal Cluster Matching Reference Image */}
          <div className="honeycomb-wrapper-bg">
            <div className="honeycomb-cluster">
              
              {/* Row 1: Top 2 Nodes */}
              <div className="hex-row hex-row-top">
                <div className="hex-card">
                  <div className="hex-card-inner">
                    <div className="hex-icon"><Users size={24} /></div>
                    <h4>Diversity and Inclusion</h4>
                    <p>Every student finds a welcoming space at Carmel’s. We celebrate unity in diversity, fostering a sense of oneness and communal harmony.</p>
                  </div>
                </div>

                <div className="hex-card">
                  <div className="hex-card-inner">
                    <div className="hex-icon"><ShieldCheck size={24} /></div>
                    <h4>Integrity & Character</h4>
                    <p>Emphasizing the earnest acceptance of values, honesty, and discipline. A cornerstone value taught and practiced within our campus.</p>
                  </div>
                </div>
              </div>

              {/* Row 2: Middle 3 Nodes (Left Node, Center Core Hexagon, Right Node) */}
              <div className="hex-row hex-row-middle">
                <div className="hex-card">
                  <div className="hex-card-inner">
                    <div className="hex-icon"><Compass size={24} /></div>
                    <h4>Environmental Stewardship</h4>
                    <p>We discourage any form of wastage, teaching our students to respect and care for the environment to become responsible custodians.</p>
                  </div>
                </div>

                {/* Central Pointed Vertical Core Hexagon */}
                <div className="hex-card hex-core-card">
                  <div className="hex-core-inner">
                    <img src={schoolLogo} alt="Carmel Logo" className="hex-core-logo" />
                    <h3>CARMEL’S</h3>
                    <span>SCHOOL TRICHY</span>
                  </div>
                </div>

                <div className="hex-card">
                  <div className="hex-card-inner">
                    <div className="hex-icon"><Sparkles size={24} /></div>
                    <h4>Self-Belief & Morals</h4>
                    <p>Fostering strong self-belief and moral values, encouraging students to stand firm in their convictions and principles in all circumstances.</p>
                  </div>
                </div>
              </div>

              {/* Row 3: Bottom 2 Nodes */}
              <div className="hex-row hex-row-bottom">
                <div className="hex-card">
                  <div className="hex-card-inner">
                    <div className="hex-icon"><HeartHandshake size={24} /></div>
                    <h4>Individual Care for Learners</h4>
                    <p>Intensive care for slow learners and special coaching programmes. We emphasize equal opportunity so every student makes outstanding progress.</p>
                  </div>
                </div>

                <div className="hex-card">
                  <div className="hex-card-inner">
                    <div className="hex-icon"><Globe size={24} /></div>
                    <h4>Equality for All</h4>
                    <p>We endorse the principle that no one stands above another. Mutual respect is cultivated, with everyone acknowledging each other as equals.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: Vision & Mission Green/Crimson Strip Banner */}
      <section className="vision-mission-banner-section">
        <div className="container">
          <div className="vision-mission-banner-card">
            
            <div className="vm-banner-image">
              <img src={campusImg} alt="Carmel School Campus Vision & Mission" />
            </div>

            <div className="vm-banner-text-side">
              
              {/* Vision Block */}
              <div className="vm-banner-block">
                <div className="vm-banner-header">
                  <div className="vm-badge-icon"><Eye size={24} /></div>
                  <h3 className="vm-banner-title">Vision</h3>
                </div>
                <p className="vm-banner-desc">
                  “Strengthening for excellence, creating an inner beauty to achieve victory in all walks of life.”
                </p>
              </div>

              {/* Mission Block */}
              <div className="vm-banner-block">
                <div className="vm-banner-header">
                  <div className="vm-badge-icon"><Target size={24} /></div>
                  <h3 className="vm-banner-title">Mission</h3>
                </div>
                <p className="vm-banner-desc">
                  “Our Carmel’s Matriculation Hr. Sec. School is a diverse learning organization comprising of educators, students, and parents who share mutual trust and high expectations and together strive to achieve high standards of holistic education and learning for life.”
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: Management & Correspondent Leadership Section */}
      <section className="management-leadership-section">
        <div className="container">
          
          <div className="management-header text-center">
            <h2 className="management-main-title">Management – Visionary Leadership Behind Carmel’s</h2>
            <span className="management-quote">“Carmel’s: Powered by Vision, Driven by Purpose”</span>
            <p className="management-subdesc">
              Every great institution has a heartbeat—and at Carmel’s, it beats with passion and dedication. They didn't just dream of a school; they envisioned a launchpad for leaders, innovators, and change-makers. From chalkboards to smart boards, from tradition to transformation—their leadership is the driving force behind Carmel’s rise.
            </p>
            <span className="management-tagline font-bold">“Not just building minds. Building legacies.”</span>
          </div>

          {/* Featured Correspondent Card with Overlay Text */}
          <div className="correspondent-feature-card">
            <div className="correspondent-image-holder">
              <img src={leaders1} alt="Carmel Correspondent Leadership" className="correspondent-bg-photo" />
              
              {/* Green/Crimson Overlay Text Card */}
              <div className="correspondent-overlay-box">
                <span className="overlay-role-tag">CORRESPONDENT</span>
                <h3 className="overlay-name">Correspondent Message</h3>
                <p className="overlay-quote-line">“Education is not a preparation for life. Education is life itself.”</p>
                <p className="overlay-paragraph">
                  Dear Parents, We are delighted to welcome you to Carmel’s Matriculation Hr. Sec. School, Trichy. Our purpose is to educate today’s children with an enriching education to take their place as future citizens and leaders in the global community.
                </p>
                <p className="overlay-paragraph">
                  We offer a comprehensive education with a secure academic environment from Pre-KG to Std. XII. Carmel’s is dedicated to providing the best learning opportunities for each student by a team of qualified teaching professionals.
                </p>
                <button className="btn-overlay-readmore" onClick={() => { if (onOpenEnquire) onOpenEnquire(); }}>
                  Read Full Message <ArrowRight size={14} />
                </button>
              </div>

            </div>
          </div>

          {/* Leadership Cards Row */}
          <div className="leadership-cards-grid">
  
  <div className="leader-card">
    <div className="leader-photo-box">
      <img src={chairman} alt="Carmel Founder" className="leader-img" />
    </div>
    <span className="leader-role">CHAIRMAN</span>
    <h4 className="leader-name">Carmel's Chairman</h4>
    <p className="leader-bio">
      Laid the foundation of Carmel's in 1994, envisioning an institution rooted in strong values, academic excellence, and holistic student growth.
    </p>
  </div>

  <div className="leader-card">
    <div className="leader-photo-box">
      <img src={leaders1} alt="Carmel Correspondent" className="leader-img" />
    </div>
    <span className="leader-role">CORRESPONDENT</span>
    <h4 className="leader-name">Carmel's Correspondent</h4>
    <p className="leader-bio">
      Steering the school's vision forward, ensuring every student receives an enriching education rooted in discipline and global-readiness.
    </p>
  </div>

  <div className="leader-card">
    <div className="leader-photo-box">
      <img src={principal} alt="Carmel School Principal" className="leader-img" />
    </div>
    <span className="leader-role">SCHOOL PRINCIPAL</span>
    <h4 className="leader-name">Carmel Administration</h4>
    <p className="leader-bio">
      Ensuring individual care, discipline, child protection, and regular upgradation in educational systems and technology.
    </p>
  </div>

</div>

        </div>
      </section>

    </div>
  );
}
