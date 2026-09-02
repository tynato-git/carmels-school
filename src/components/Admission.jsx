import React, { useState } from 'react';
import { GraduationCap, ArrowLeft, School, BookOpen, ArrowRight } from 'lucide-react';
import AdmissionICSE from './Admissionicse';
import AdmissionMatric from './Admissionmatric';
import './Admission.css';
 
export default function Admission({ onNavigateHome }) {
  const [selectedSchool, setSelectedSchool] = useState(null); // null | 'icse' | 'matric'
 
  if (selectedSchool === 'icse') {
    return <AdmissionICSE onBack={() => setSelectedSchool(null)} onNavigateHome={onNavigateHome} />;
  }
 
  if (selectedSchool === 'matric') {
    return <AdmissionMatric onBack={() => setSelectedSchool(null)} onNavigateHome={onNavigateHome} />;
  }
 
  return (
    <div className="admission-page-container">
      <header className="admission-topbar">
        <div className="admission-topbar-inner">
          <button className="admission-back-link" onClick={onNavigateHome}>
            <ArrowLeft size={16} /> Back to Website
          </button>
        </div>
      </header>
 
      <section className="admission-hero-section">
        <div className="admission-container text-center">
          <span className="sub-badge">Admissions {new Date().getFullYear()}-{String(new Date().getFullYear() + 1).slice(-2)}</span>
          <h1 className="admission-title">
            <GraduationCap size={34} className="admission-title-icon" />
            Start Your Admission
          </h1>
          <p className="admission-subtitle">
            Carmel's runs two schools under one campus group. Choose which school
            you're applying to below — the enrollment form and syllabus details differ for each.
          </p>
          <div className="admission-hero-divider">
            <span className="divider-line" />
            <span className="divider-seal"><GraduationCap size={14} /></span>
            <span className="divider-line" />
          </div>
        </div>
      </section>
 
      <section className="admission-form-section">
        <div className="admission-container">
          <div className="school-select-grid">

            <button
              type="button"
              className="school-select-card card-icse"
              onClick={() => setSelectedSchool('icse')}
              aria-label="Apply to Carmel's English School"
            >
              <span className="card-accent-bar" />
              <span className="card-glow" />
              <div className="school-card-top">
                <div className="school-select-icon">
                  <BookOpen size={25} strokeWidth={2.2} />
                </div>
                <span className="card-seal">CES</span>
              </div>

              <div className="school-card-content">
                <span className="school-card-kicker">Carmel English School</span>
                <h3>Carmel's English School</h3>
                <span className="school-select-tag">
                  Montessori <i /> ICSE <i /> ISC Syllabus
                </span>
                <p className="school-select-address">
                  Carmel Gardens, RamalingaNagar West Extn, Woraiyur, Trichy-3
                </p>
              </div>

              <span className="card-divider" />
              <span className="school-select-cta">
                <span>Apply to ICSE School</span>
                <span className="cta-arrow-circle">
                  <ArrowRight size={16} />
                </span>
              </span>
            </button>

            <button
              type="button"
              className="school-select-card card-matric"
              onClick={() => setSelectedSchool('matric')}
              aria-label="Apply to Carmel's Matriculation School"
            >
              <span className="card-accent-bar" />
              <span className="card-glow" />
              <div className="school-card-top">
                <div className="school-select-icon">
                  <School size={25} strokeWidth={2.2} />
                </div>
                <span className="card-seal">CMS</span>
              </div>

              <div className="school-card-content">
                <span className="school-card-kicker">Carmel Matriculation School</span>
                <h3>Carmel's Matriculation School</h3>
                <span className="school-select-tag">
                  TN State Board <i /> Matriculation Syllabus
                </span>
                <p className="school-select-address">
                  Carmel Gardens, Ramalinganagar West Extn., Woraiyur, Trichy-03
                </p>
              </div>

              <span className="card-divider" />
              <span className="school-select-cta">
                <span>Apply to Matric School</span>
                <span className="cta-arrow-circle">
                  <ArrowRight size={16} />
                </span>
              </span>
            </button>

          </div>
        </div>
      </section>
    </div>
  );
}