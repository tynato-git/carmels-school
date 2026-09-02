import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Send,
  CheckCircle2,
  Youtube,
  Play
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Alumni.css';
 
const extractYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^?&\s]+)/
  );
  return match ? match[1] : null;
};
 
function TestimonialVideoCard({ data, fallbackTitle, fallbackSubtitle }) {
  const videoId = extractYouTubeId(data?.youtube_url);
  const [playing, setPlaying] = useState(false);
 
  return (
    <div className="story-card testimonial-video-card">
      <div className="story-header">
        <div className="avatar-placeholder"><GraduationCap size={24} /></div>
        <div>
          <h3>{data?.title || fallbackTitle}</h3>
          <span className="batch-pill">{data?.subtitle || fallbackSubtitle}</span>
        </div>
      </div>
 
      <div className="testimonial-video-frame">
        {videoId ? (
          playing ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={data?.title || fallbackTitle}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button className="testimonial-video-thumb" onClick={() => setPlaying(true)}>
              <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt={data?.title} />
              <span className="play-badge"><Play size={22} fill="#fff" /></span>
            </button>
          )
        ) : (
          <div className="testimonial-video-placeholder">
            <Youtube size={32} />
            <span>Video coming soon</span>
          </div>
        )}
      </div>
    </div>
  );
}
 
export default function Alumni({ onOpenEnquire }) {
  const [registered, setRegistered] = useState(false);
  const [alumniData, setAlumniData] = useState({
    name: '',
    email: '',
    phone: '',
    passoutYear: '2020',
    occupation: '',
    company: '',
    message: ''
  });
 
  const [testimonials, setTestimonials] = useState({ alumni: null, parent: null });
 
  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase.from('testimonial_videos').select('*');
      if (!error && data) {
        const map = {};
        data.forEach((row) => { map[row.type] = row; });
        setTestimonials(map);
      }
    };
    fetchTestimonials();
  }, []);
 
  const handleSubmit = (e) => {
    e.preventDefault();
    setRegistered(true);
  };
 
  return (
    <div className="alumni-page-container">
 
      {/* 1. Hero Showcase */}
      <section className="alumni-hero-section">
        <div className="container text-center">
          <span className="sub-badge">Carmel’s Legacy</span>
          <h1 className="section-title">Global Alumni Network</h1>
          <p className="section-subtitle">
            Over 20+ years of nurturing leaders, doctors, engineers, civil servants, and entrepreneurs serving across India and worldwide.
          </p>
        </div>
      </section>
 
      {/* 2. Testimonials (Alumni + Parent video testimonials) */}
      <section className="alumni-stories-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="sub-badge">Testimonials</span>
            <h2 className="section-title">In Their Own Words</h2>
          </div>
 
          <div className="stories-grid testimonials-grid">
            {(!testimonials.alumni || testimonials.alumni.is_active !== false) && (
              <TestimonialVideoCard
                data={testimonials.alumni}
                fallbackTitle="Alumni Testimonial"
                fallbackSubtitle="Hear from our graduates"
              />
            )}
            {(!testimonials.parent || testimonials.parent.is_active !== false) && (
              <TestimonialVideoCard
                data={testimonials.parent}
                fallbackTitle="Parent Testimonial"
                fallbackSubtitle="Hear from our parents"
              />
            )}
          </div>
        </div>
      </section>
 
      {/* 3. Alumni Registration Form */}
      <section className="alumni-form-section">
        <div className="container">
          <div className="alumni-form-card">
            <div className="form-info-col">
              <h2>Join the Carmel’s Alumni Association</h2>
              <p>Stay connected with your alma mater, mentor current students, and attend annual alumni reunions.</p>
              <ul className="alumni-benefits-list">
                <li><CheckCircle2 size={16} className="check-icon" /> Annual Alumni Meet invitations</li>
                <li><CheckCircle2 size={16} className="check-icon" /> Mentorship & guest lecture opportunities</li>
                <li><CheckCircle2 size={16} className="check-icon" /> Carmel's global alumni directory access</li>
              </ul>
            </div>
 
            <div className="form-input-col">
              {registered ? (
                <div className="alumni-success-msg text-center">
                  <CheckCircle2 size={48} className="success-icon" />
                  <h3>Registration Complete!</h3>
                  <p>Welcome to the Carmel's Alumni Network. We will keep you updated on upcoming reunions and events.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="alumni-form">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. S. Karthik"
                      value={alumniData.name}
                      onChange={(e) => setAlumniData({...alumniData, name: e.target.value})}
                    />
                  </div>
 
                  <div className="form-row">
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="yourname@gmail.com"
                        value={alumniData.email}
                        onChange={(e) => setAlumniData({...alumniData, email: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Passout Year *</label>
                      <input
                        type="text"
                        required
                        placeholder="2018"
                        value={alumniData.passoutYear}
                        onChange={(e) => setAlumniData({...alumniData, passoutYear: e.target.value})}
                      />
                    </div>
                  </div>
 
                  <div className="form-row">
                    <div className="form-group">
                      <label>Occupation / Role</label>
                      <input
                        type="text"
                        placeholder="Software Engineer, Doctor, etc."
                        value={alumniData.occupation}
                        onChange={(e) => setAlumniData({...alumniData, occupation: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Company / University</label>
                      <input
                        type="text"
                        placeholder="Organization or City"
                        value={alumniData.company}
                        onChange={(e) => setAlumniData({...alumniData, company: e.target.value})}
                      />
                    </div>
                  </div>
 
                  <button type="submit" className="btn-submit-alumni">
                    Register as Alumni <Send size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
 
    </div>
  );
}
 








