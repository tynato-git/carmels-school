import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  GraduationCap,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useSchoolInfo } from '../context/SchoolInfoContext';
import './Contact.css';

export default function Contact() {
  const { schoolInfo } = useSchoolInfo();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    schoolStream: 'Matriculation Hr. Sec. School',
    grade: 'Grade 1',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        schoolStream: 'Matriculation Hr. Sec. School',
        grade: 'Grade 1',
        subject: '',
        message: ''
      });
    }, 1200);
  };

  return (
    <section className="contact-page-section" id="contact">
      <div className="contact-header-container">
        <span className="contact-badge">
          Contact Us
        </span>
        <h2 className="contact-section-title">Get In Touch With Carmel's</h2>
        <p className="contact-section-subtitle">
          Have questions regarding admissions, curriculum, or campus visits? Send us a message or visit our campus. We are here to assist you.
        </p>
      </div>

      <div className="contact-main-grid-container">
        <div className="contact-grid">
          
          {/* Left Column: Contact Form */}
          <div className="contact-form-card">
            <div className="form-header">
              <h3 className="form-title">Send Us a Message</h3>
              <p className="form-desc">Fill out the form below and our admissions office will respond within 24 hours.</p>
            </div>

            {isSuccess ? (
              <div className="form-success-box">
                <CheckCircle2 size={48} className="success-icon" />
                <h3>Thank You for Contacting Us!</h3>
                <p>Your message has been sent successfully to Carmel's School admissions office. We will get back to you shortly.</p>
                <button className="btn-reset-form" onClick={() => setIsSuccess(false)}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                
                {/* Full Name & Phone */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name *</label>
                    <input 
                      type="text" 
                      id="fullName" 
                      name="fullName"
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.fullName}
                      onChange={handleChange}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>

                {/* Email Address & Stream */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      placeholder="e.g. parent@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="schoolStream">School Stream *</label>
                    <select 
                      id="schoolStream" 
                      name="schoolStream"
                      value={formData.schoolStream}
                      onChange={handleChange}
                      required
                    >
                      <option value="Matriculation Hr. Sec. School">Matriculation Hr. Sec. School</option>
                      <option value="ICSE & ISC School">ICSE & ISC School</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>
                </div>

                {/* Grade Seeking & Subject */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="grade">Grade Seeking Admission</label>
                    <select 
                      id="grade" 
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                    >
                      <option value="Kindergarten / LKG / UKG">Kindergarten (KG / LKG / UKG)</option>
                      <option value="Primary (Grades 1 - 5)">Primary (Grades 1 - 5)</option>
                      <option value="Middle School (Grades 6 - 8)">Middle School (Grades 6 - 8)</option>
                      <option value="High School (Grades 9 - 10)">High School (Grades 9 - 10)</option>
                      <option value="Higher Secondary (Grades 11 - 12)">Higher Secondary (Grades 11 - 12)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject / Inquiry Title</label>
                    <input 
                      type="text" 
                      id="subject" 
                      name="subject"
                      placeholder="e.g. Admission Procedure 2026-27"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div className="form-group">
                  <label htmlFor="message">Your Message / Question *</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="4"
                    placeholder="Write your query or details here..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className={`btn-submit-contact ${isSubmitting ? 'submitting' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Submitting Message...</span>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <Send size={16} />
                    </>
                  )}
                </button>

              </form>
            )}
          </div>

          {/* Right Column: Contact Details */}
          <div className="contact-info-panel">
            <h3 className="info-panel-title">Contact Details</h3>

            {/* Phone Numbers Card */}
            <div className="info-card">
              <div className="card-icon-box">
                <Phone size={22} />
              </div>
              <div className="card-text-box">
                <h4>Contact Numbers</h4>
                <p>Call our office for instant help & inquiries:</p>
                <div className="phone-numbers-row">
                  <a href={`tel:${schoolInfo.phone_primary}`} className="contact-link-pill">{schoolInfo.phone_primary}</a>
                  <a href={`tel:${schoolInfo.phone_secondary}`} className="contact-link-pill">{schoolInfo.phone_secondary}</a>
                </div>
              </div>
            </div>

            {/* Email Addresses Card */}
            <div className="info-card">
              <div className="card-icon-box">
                <Mail size={22} />
              </div>
              <div className="card-text-box">
                <h4>Official Email Addresses</h4>
                <div className="email-rows">
                  <div className="email-item">
                    <span className="email-label">Matric School:</span>
                    <a href={`mailto:${schoolInfo.email_matric}`} className="email-link">{schoolInfo.email_matric}</a>
                  </div>
                  <div className="email-item">
                    <span className="email-label">ICSE School:</span>
                    <a href={`mailto:${schoolInfo.email_icse}`} className="email-link">{schoolInfo.email_icse}</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Hours Card */}
            <div className="info-card">
              <div className="card-icon-box">
                <Clock size={22} />
              </div>
              <div className="card-text-box">
                <h4>School Office Hours</h4>
                <p>{schoolInfo.office_hours}</p>
                <span className="info-note">Visitors are welcome during office hours.</span>
              </div>
            </div>

            {/* School Campus Address Card */}
            <div className="info-card">
              <div className="card-icon-box">
                <MapPin size={22} />
              </div>
              <div className="card-text-box">
                <h4>Campus Address</h4>
                <p className="address-text">
                  {schoolInfo.address_line}
                </p>
                <a 
                  href={schoolInfo.google_maps_link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-open-maps-link"
                >
                  Open in Google Maps <ExternalLink size={14} />
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Satellite View Map Card Section Matching Reference Layout */}
        <div className="satellite-map-section">
          <div className="satellite-map-card">
            
            {/* Left Side: Satellite View Google Map */}
            <div className="satellite-map-container">
              <iframe
                title="Carmel's School Satellite Map View"
                src={schoolInfo.map_embed_url}
                width="100%"
                height="340"
                style={{ border: 0, borderRadius: '16px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Right Side: Campus & Address Details */}
            <div className="satellite-address-details">
              <h3 className="office-title">School Campus & Office</h3>
              <span className="office-location-tag">{schoolInfo.city?.toUpperCase() || 'WORAIYUR, TRICHY'}</span>

              <div className="office-address-row">
                <MapPin size={20} className="office-icon" />
                <div className="office-address-text">
                  <strong>Address:</strong>
                  <p>{schoolInfo.address_line}</p>
                </div>
              </div>

              <div className="office-contact-row">
                <Phone size={18} className="office-icon" />
                <div className="office-contact-text">
                  <strong>Enquiries:</strong>
                  <p>
                    <a href={`tel:${schoolInfo.phone_primary}`}>{schoolInfo.phone_primary}</a> / <a href={`tel:${schoolInfo.phone_secondary}`}>{schoolInfo.phone_secondary}</a>
                  </p>
                </div>
              </div>

              <a 
                href={schoolInfo.google_maps_link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-satellite-directions"
              >
                <MapPin size={16} /> Get Directions on Google Maps <ExternalLink size={14} />
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
