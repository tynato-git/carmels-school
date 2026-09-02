import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  Facebook, 
  Instagram, 
  Youtube, 
  GraduationCap,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import schoolLogo from '../assets/Logo.png';
import { useSchoolInfo } from '../context/SchoolInfoContext';
import './Footer.css';

export default function Footer({ onOpenEnquire }) {
  const { schoolInfo } = useSchoolInfo();

  return (
    <footer className="footer-section">
      {/* Main Dark Crimson Footer */}
      <div className="footer-main-content">
        <div className="footer-container">
          
          {/* School Center Branding */}
          <div className="footer-branding">
            <a href="#" className="footer-brand-link">
              <img src={schoolLogo} alt="Carmel School Logo" className="footer-logo" />
              <div className="footer-brand-titles">
                <span className="footer-brand-title">{schoolInfo.school_name || "CARMEL'S SCHOOLS"}</span>
                <span className="footer-brand-sub">{schoolInfo.tagline || "Matriculation Hr. Sec. School & ICSE School • Trichy"}</span>
              </div>
            </a>
            <p className="footer-about-text">
  {schoolInfo.about_summary}
</p>

{/* Social Media Buttons (Centered) */}
<div className="footer-social-wrapper footer-social-centered">
  <span className="social-label">Follow Us:</span>
  <div className="footer-social-icons">
    <a 
      href={schoolInfo.facebook_url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="social-btn" 
      aria-label="Facebook"
    >
      <Facebook size={15} />
    </a>
    <a 
      href={schoolInfo.instagram_url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="social-btn" 
      aria-label="Instagram"
    >
      <Instagram size={15} />
    </a>
    <a 
      href={schoolInfo.youtube_url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="social-btn" 
      aria-label="YouTube"
    >
      <Youtube size={15} />
    </a>
  </div>
</div>
</div>

<hr className="footer-divider" />

          {/* Footer Multi-Column Grid Layout */}
          <div className="footer-grid">
            
            {/* Column 1: Quick Links */}
            <div className="footer-col">
              <h4 className="footer-col-title">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#campuses">Campuses</a></li>
                <li><a href="#results">Results</a></li>
                <li><a href="#media">Media & News</a></li>
                <li><a href="#contact">Contact Us</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#alumni">Alumni</a></li>
              </ul>
            </div>

            {/* Column 2: Affiliations */}
            <div className="footer-col">
              <h4 className="footer-col-title">Affiliations & Boards</h4>
              <ul className="footer-affiliation-list">
                <li>
                  <GraduationCap size={16} className="col-icon" />
                  <div>
                    <strong>Matriculation Hr. Sec. School</strong>
                    <span>Recognized by Govt. of Tamil Nadu</span>
                  </div>
                </li>
                <li>
                  <GraduationCap size={16} className="col-icon" />
                  <div>
                    <strong>ICSE & ISC Board</strong>
                    <span>Council for the Indian School Certificate Examinations</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div className="footer-col">
              <h4 className="footer-col-title">Contact Numbers & Emails</h4>
              <ul className="footer-contact-list">
                <li>
                  <Phone size={16} className="col-icon" />
                  <div>
                    <strong>Phone Enquiries:</strong>
                    <a href={`tel:${schoolInfo.phone_primary}`}>{schoolInfo.phone_primary}</a> & <a href={`tel:${schoolInfo.phone_secondary}`}>{schoolInfo.phone_secondary}</a>
                  </div>
                </li>
                <li>
                  <Mail size={16} className="col-icon" />
                  <div>
                    <strong>Matric School Email:</strong>
                    <a href={`mailto:${schoolInfo.email_matric}`}>{schoolInfo.email_matric}</a>
                  </div>
                </li>
                <li>
                  <Mail size={16} className="col-icon" />
                  <div>
                    <strong>ICSE School Email:</strong>
                    <a href={`mailto:${schoolInfo.email_icse}`}>{schoolInfo.email_icse}</a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 4: Address & Embedded Satellite Map */}
            <div className="footer-col footer-col-map">
              <h4 className="footer-col-title">Campus Location Map</h4>
              <div className="footer-address-box">
                <MapPin size={15} className="col-icon pin-icon" />
                <p>
                  {schoolInfo.address_line}
                </p>
              </div>

              {/* Embedded Google Satellite Map */}
              <div className="footer-map-embed">
                <iframe 
                  title="Carmel's School Location Map"
                  src={schoolInfo.map_embed_url}
                  width="100%" 
                  height="95" 
                  style={{ border: 0, borderRadius: '8px' }} 
                  allowFullScreen="" 
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

          </div>

        </div>

        {/* Copyright Bottom Bar */}
<div className="footer-bottom-bar">
  <div className="bottom-bar-container">
    <p>© {new Date().getFullYear()} {schoolInfo.school_name}. All Rights Reserved.</p>
  </div>
</div>
      </div>

      {/* Floating Bottom Right Enquire Widget Button */}
      <button 
        className="floating-enquire-widget" 
        onClick={(e) => { e.preventDefault(); if (onOpenEnquire) onOpenEnquire(); }}
        title="Enquire Now"
      >
        <MessageCircle size={20} />
        <span>Enquire Now</span>
      </button>
    </footer>
  );
}
