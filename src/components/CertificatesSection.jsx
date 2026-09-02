import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import cert1 from '../assets/certificate_1.jpg';
import cert2 from '../assets/certificate_2.jpg';
import cert4 from '../assets/certificate_4.jpg';
import cert5 from '../assets/certificate_5.jpg';
import './CertificatesSection.css';

export default function CertificatesSection() {
  const [selectedCertIndex, setSelectedCertIndex] = useState(null);

  const certificates = [
    {
      id: 1,
      image: cert1,
      tag: "GOVERNMENT OF INDIA",
      title: "FIT INDIA Certificate of Recognition",
      authority: "Ministry of Youth Affairs and Sports, Govt. of India",
      desc: "Officially declared as a designated FIT INDIA School for championing physical education, fitness training, and student well-being."
    },
    {
      id: 2,
      image: cert2,
      tag: "STATE BOARD RECOGNITION",
      title: "School Recognition & Affiliation Certificate",
      authority: "Directorate of School Education, Tamil Nadu",
      desc: "Formal statutory recognition granted for maintaining high educational standards, qualified faculty, and top-tier infrastructure."
    },
    {
      id: 4,
      image: cert4,
      tag: "QUALITY & SAFETY",
      title: "Campus Safety & Structural Compliance",
      authority: "Municipal & Health Authority Certifications",
      desc: "Certified compliance with sanitary standards, fire safety protocols, clean campus hygiene, and child-safe physical amenities."
    },
    {
      id: 5,
      image: cert5,
      tag: "SPORTS & WELLNESS",
      title: "Excellence in Physical Fitness & Sports",
      authority: "National Sports & Martial Arts Federation",
      desc: "Honored for outstanding performance in national-level judo championships, state sports meets, and holistic physical training."
    }
  ];

  const handleOpenModal = (index) => {
    setSelectedCertIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedCertIndex(null);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedCertIndex((prev) => (prev === 0 ? certificates.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedCertIndex((prev) => (prev === certificates.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="certificates-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="certificates-header text-center">
          <span className="certificates-badge">
            <ShieldCheck size={16} /> ACCREDITATIONS & RECOGNITION
          </span>
          <h2 className="certificates-title">Official Certifications & Recognitions</h2>
          <p className="certificates-subtitle">
            Carmel’s Group of Schools holds prestigious certifications from national sports authorities, educational boards, and government ministries, reflecting our uncompromising dedication to quality, fitness, and safety.
          </p>
        </div>

        {/* 4 Clean Certificate Cards Grid */}
        <div className="certificates-grid">
          {certificates.map((cert, index) => (
            <div 
              key={cert.id} 
              className="certificate-card-pure"
              onClick={() => handleOpenModal(index)}
              title="Click to view certificate"
            >
              <div className="cert-pure-frame">
                <img 
                  src={cert.image} 
                  alt={cert.title} 
                  className="cert-pure-img" 
                />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Split Modal (Left Image, Right Title & Content) */}
      {selectedCertIndex !== null && (
        <div className="cert-lightbox-overlay" onClick={handleCloseModal}>
          <div className="cert-split-popup-modal" onClick={(e) => e.stopPropagation()}>
            
            {/* Close Button */}
            <button className="cert-modal-close" onClick={handleCloseModal} aria-label="Close">
              <X size={22} />
            </button>

            {/* Left Navigation Chevron */}
            <button className="cert-modal-nav prev" onClick={handlePrev} aria-label="Previous Certificate">
              <ChevronLeft size={28} />
            </button>

            {/* Left Side: Certificate Image */}
            <div className="cert-split-image-col">
              <img 
                src={certificates[selectedCertIndex].image} 
                alt={certificates[selectedCertIndex].title} 
                className="cert-split-full-img"
              />
            </div>

            {/* Right Side: Title & Content Details */}
            <div className="cert-split-content-col">
              <span className="modal-cert-badge">{certificates[selectedCertIndex].tag}</span>
              <h3 className="modal-cert-title">{certificates[selectedCertIndex].title}</h3>
              <p className="modal-cert-auth">
                <strong>Issued by:</strong> {certificates[selectedCertIndex].authority}
              </p>
              <p className="modal-cert-desc">{certificates[selectedCertIndex].desc}</p>
            </div>

            {/* Right Navigation Chevron */}
            <button className="cert-modal-nav next" onClick={handleNext} aria-label="Next Certificate">
              <ChevronRight size={28} />
            </button>

          </div>
        </div>
      )}

    </section>
  );
}
