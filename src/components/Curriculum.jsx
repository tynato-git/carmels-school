import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Microscope, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Target,
  Award,
  Globe,
  Users,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Curriculum.css';
 
export default function Curriculum({ onOpenEnquire, initialSubTab = 'curriculum' }) {
  const [academicsTab, setAcademicsTab] = useState('curriculum'); // 'curriculum' | 'faculty'
 
  const [facultyList, setFacultyList] = useState([]);
  const [facultyLoading, setFacultyLoading] = useState(false);
  const [facultyError, setFacultyError] = useState(null);
 
  // Same neutral placeholder avatar used in the admin dashboard,
  // shown whenever a teacher has no photo_url set (or the image fails to load).
  const DEFAULT_FACULTY_AVATAR = `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#f1f5f9"/><circle cx="50" cy="38" r="18" fill="#cbd5e1"/><path d="M20 90c0-18 13-30 30-30s30 12 30 30" fill="#cbd5e1"/></svg>`
  )}`;
 
  useEffect(() => {
    if (academicsTab === 'faculty') {
      fetchFaculty();
    }
  }, [academicsTab]);
 
  useEffect(() => {
    setAcademicsTab(initialSubTab);
  }, [initialSubTab]);
 
  const fetchFaculty = async () => {
    setFacultyLoading(true);
    setFacultyError(null);
    try {
      const { data, error } = await supabase
        .from('faculty')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
 
      if (error) {
        setFacultyError('Faculty list is temporarily unavailable.');
      } else {
        setFacultyList(data || []);
      }
    } catch (err) {
      setFacultyError('Faculty list is temporarily unavailable.');
    } finally {
      setFacultyLoading(false);
    }
  };
 
  const stages = [
    {
      level: "Early Childhood (Pre-KG to UKG)",
      board: "Montessori & Play-Based Framework",
      desc: "Fostering gross & fine motor skills, sensory play, phonics, number sense, and social emotional foundations in a caring environment.",
      icon: <Sparkles size={24} />
    },
    {
      level: "Primary Education (Std I to V)",
      board: "Foundational Literacy & Inquiry",
      desc: "Building strong language skills in English and Tamil, conceptual mathematics, environmental studies, and digital interactive learning.",
      icon: <BookOpen size={24} />
    },
    {
      level: "Middle School (Std VI to VIII)",
      board: "Analytical & Experiential Learning",
      desc: "Introducing experimental science practicals, computer coding, history, geography, second/third languages, and club activities.",
      icon: <Target size={24} />
    },
    {
      level: "High School & Hr. Sec. (Std IX to XII)",
      board: "TN State Board, CBSE & ICSE Streams",
      desc: "Specialized academic streams (Physics, Chemistry, Maths, Biology, Computer Science, Commerce, Accountancy) with intensive board exam and competitive entrance guidance.",
      icon: <GraduationCap size={24} />
    }
  ];
 
  return (
    <div className="curriculum-page-container">
      
      {/* 1. Hero Showcase */}
      <section className="curriculum-hero-section">
        <div className="container text-center">
          <span className="sub-badge">Academics</span>
          <h1 className="section-title">Nurturing Minds with Academic Excellence</h1>
          <p className="section-subtitle">
            Our curriculum blends rigorous academic standards, practical laboratory discovery, digital smart learning, and moral character building — guided by a dedicated, qualified faculty.
          </p>
        </div>
      </section>
 
      {/* Academics Sub-Tabs */}
      <section className="academics-subtabs-section">
        <div className="container">
          <div className="academics-subtabs-bar">
            <button
              className={`academics-subtab-btn ${academicsTab === 'curriculum' ? 'active' : ''}`}
              onClick={() => setAcademicsTab('curriculum')}
            >
              <BookOpen size={16} /> Curriculum
            </button>
            <button
              className={`academics-subtab-btn ${academicsTab === 'faculty' ? 'active' : ''}`}
              onClick={() => setAcademicsTab('faculty')}
            >
              <Users size={16} /> Faculty
            </button>
          </div>
        </div>
      </section>
 
      {/* ===================== CURRICULUM SUB-TAB ===================== */}
      {academicsTab === 'curriculum' && (
        <>
          <section className="curriculum-stages-section">
            <div className="container">
              <div className="stages-grid">
                {stages.map((stage, idx) => (
                  <div key={idx} className="stage-card">
                    <div className="stage-icon">{stage.icon}</div>
                    <span className="board-tag">{stage.board}</span>
                    <h3>{stage.level}</h3>
                    <p>{stage.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
 
          <section className="curriculum-pillars-section">
            <div className="container">
              <div className="section-header text-center">
                <span className="sub-badge">Learning Pillars</span>
                <h2 className="section-title">Core Principles of Carmel's Education</h2>
              </div>
 
              <div className="pillars-grid">
                <div className="pillar-box">
                  <div className="pillar-num">01</div>
                  <h3>Smart Digital Classrooms</h3>
                  <p>Audio-visual interactive boards and multimedia modules to render abstract concepts clear and memorable.</p>
                </div>
                <div className="pillar-box">
                  <div className="pillar-num">02</div>
                  <h3>Hands-On Science Labs</h3>
                  <p>Individual workstations in Physics, Chemistry, Biology, and AI & Computer labs for empirical research.</p>
                </div>
                <div className="pillar-box">
                  <div className="pillar-num">03</div>
                  <h3>English Fluency & Debate</h3>
                  <p>Dedicated phonics, Model United Nations, literature clubs, and public speaking development.</p>
                </div>
                <div className="pillar-box">
                  <div className="pillar-num">04</div>
                  <h3>Values & Leadership</h3>
                  <p>Rooted in moral ethics, discipline, sportsmanship, and community service initiatives.</p>
                </div>
              </div>
 
              <div className="curriculum-cta text-center">
                <button className="btn-primary-action" onClick={() => { if (onOpenEnquire) onOpenEnquire(); }}>
                  Enquire Academic Syllabus <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </section>
        </>
      )}
 
      {/* ===================== FACULTY SUB-TAB ===================== */}
      {academicsTab === 'faculty' && (
        <section className="faculty-table-section">
          <div className="container">
            <div className="section-header text-center">
              <span className="sub-badge">Our Educators</span>
              <h2 className="section-title">Meet Our Faculty</h2>
              <p className="section-subtitle">
                Our qualified and experienced teaching staff dedicated to student growth and academic excellence.
              </p>
            </div>
 
            {facultyLoading && (
              <div className="faculty-loading-state">
                <RefreshCw size={22} className="spin-icon" />
                <span>Loading faculty list...</span>
              </div>
            )}
 
            {facultyError && !facultyLoading && (
              <div className="faculty-empty-state">
                <p>{facultyError}</p>
              </div>
            )}
 
            {!facultyLoading && !facultyError && facultyList.length === 0 && (
              <div className="faculty-empty-state">
                <Users size={40} />
                <p>Faculty list will be updated shortly.</p>
              </div>
            )}
 
            {!facultyLoading && facultyList.length > 0 && (
              <div className="faculty-table-wrapper">
                <table className="faculty-table">
                  <thead>
                    <tr>
                      <th>S.NO</th>
                      <th>PHOTO</th>
                      <th>NAME OF THE TEACHER</th>
                      <th>QUALIFICATION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facultyList.map((f, idx) => (
                      <tr key={f.id}>
                        <td>{f.s_no || idx + 1}</td>
                        <td>
                          <img
                            src={f.photo_url || DEFAULT_FACULTY_AVATAR}
                            alt={f.name}
                            loading="lazy"
                            className="faculty-table-avatar"
                            onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_FACULTY_AVATAR; }}
                          />
                        </td>
                        
                        <td>{f.name}</td>
                        <td>{f.qualification}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}
 
    </div>
  );
}
 
