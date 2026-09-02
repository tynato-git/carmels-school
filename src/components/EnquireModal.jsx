import React, { useState } from 'react';
import { X, Send, CheckCircle2, Sparkles, GraduationCap } from 'lucide-react';
import schoolLogo from '../assets/Logo.png';
import { useSchoolInfo } from '../context/SchoolInfoContext';
import './EnquireModal.css';
import { supabase } from '../lib/supabase';

export default function EnquireModal({ isOpen, onClose }) {
  const { schoolInfo } = useSchoolInfo();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    stream: 'Matriculation Hr. Sec. School',
    grade: 'Grade 1',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('enquiries').insert([{
        full_name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        stream: formData.stream,
        grade: formData.grade,
        message: formData.message
      }]);
      if (error) throw error;
      setIsSuccess(true);
      setFormData({ fullName: '', phone: '', email: '', stream: 'Matriculation Hr. Sec. School', grade: 'Grade 1', message: '' });
    } catch (err) {
      alert('Error submitting enquiry: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="enquire-modal-overlay" onClick={handleModalClose}>
      <div className="enquire-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="modal-close-btn" onClick={handleModalClose} aria-label="Close Modal">
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="modal-header">
          <img src={schoolLogo} alt="Carmel Logo" className="modal-logo" />
          <div className="modal-header-text">
            <span className="modal-badge">
              <Sparkles size={13} /> Admission Enquiry {schoolInfo.admission_year || '2026-27'}
            </span>
            <h3 className="modal-title">Enquire Now - {schoolInfo.school_name || "Carmel's School"}</h3>
            <p className="modal-subtitle">Fill out your details below and our admissions team will contact you directly.</p>
          </div>
        </div>

        {/* Modal Content / Form */}
        {isSuccess ? (
          <div className="modal-success-state">
            <CheckCircle2 size={54} className="modal-success-icon" />
            <h4>Enquiry Submitted Successfully!</h4>
            <p>Thank you for your interest in Carmel's School. Our admissions counselor will call you back within 24 hours.</p>
            <button className="btn-modal-done" onClick={handleModalClose}>
              Done & Close
            </button>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            
            <div className="modal-form-row">
              <div className="modal-field-group">
                <label htmlFor="modal-fullName">Full Name *</label>
                <input 
                  type="text" 
                  id="modal-fullName" 
                  name="fullName"
                  placeholder="Parent / Student Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="modal-field-group">
                <label htmlFor="modal-phone">Contact Phone *</label>
                <input 
                  type="tel" 
                  id="modal-phone" 
                  name="phone"
                  placeholder="10-digit Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="modal-form-row">
              <div className="modal-field-group">
                <label htmlFor="modal-email">Email Address *</label>
                <input 
                  type="email" 
                  id="modal-email" 
                  name="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="modal-field-group">
                <label htmlFor="modal-stream">Preferred Stream *</label>
                <select 
                  id="modal-stream" 
                  name="stream"
                  value={formData.stream}
                  onChange={handleChange}
                  required
                >
                  <option value="Matriculation Hr. Sec. School">Matriculation Hr. Sec. School</option>
                  <option value="ICSE & ISC School">ICSE & ISC School</option>
                </select>
              </div>
            </div>

            <div className="modal-field-group">
              <label htmlFor="modal-grade">Seeking Grade / Class *</label>
              <select 
                id="modal-grade" 
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
              >
                <option value="Kindergarten / LKG / UKG">Kindergarten (LKG / UKG)</option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11 (Hr. Sec.)</option>
                <option value="Grade 12">Grade 12 (Hr. Sec.)</option>
              </select>
            </div>

            <div className="modal-field-group">
              <label htmlFor="modal-message">Additional Notes / Questions</label>
              <textarea 
                id="modal-message" 
                name="message" 
                rows="3"
                placeholder="Any specific questions regarding admissions, transport, or hostel..."
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>

            <button 
              type="submit" 
              className={`btn-modal-submit ${isSubmitting ? 'submitting' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Submitting Enquiry...</span>
              ) : (
                <>
                  <span>Submit Enquiry</span>
                  <Send size={16} />
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
