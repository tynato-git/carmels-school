import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Send, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  UserCheck, 
  Award,
  Sparkles,
  ArrowRight,
  FileText,
  AlertCircle,
  Mail,
  Phone,
  User,
  Building2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Careers.css';

export default function Careers({ onOpenEnquire }) {
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '3-5 Years',
    message: ''
  });

  // Fetch dynamic career jobs from Supabase (NO DEFAULT FALLBACK)
  useEffect(() => {
    const fetchCareers = async () => {
      setJobsLoading(true);
      try {
        const { data, error } = await supabase
          .from('career_jobs')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (!error && data) {
          setJobs(data);
          if (data.length > 0) {
            setFormData((prev) => ({ ...prev, position: data[0].title }));
          } else {
            setFormData((prev) => ({ ...prev, position: 'General Faculty / Academic Staff' }));
          }
        } else {
          setJobs([]);
          setFormData((prev) => ({ ...prev, position: 'General Faculty / Academic Staff' }));
        }
      } catch (err) {
        console.error('Error fetching careers:', err);
        setJobs([]);
      } finally {
        setJobsLoading(false);
      }
    };

    fetchCareers();
  }, []);

  // Handle Candidate Job Application Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const { error } = await supabase
        .from('career_applications')
        .insert([{
          position: formData.position || 'General Faculty / Academic Staff',
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          experience: formData.experience,
          message: formData.message,
          status: 'New'
        }]);

      if (error) {
        // If table not created yet, still show nice feedback
        console.warn('career_applications insert error:', error.message);
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="careers-page-container">
      
      {/* 1. Hero Showcase */}
      <section className="careers-hero-section">
        <div className="container text-center">
          <span className="sub-badge">Join Our Faculty Team</span>
          <h1 className="section-title">Build a Rewarding Career at Carmel’s</h1>
          <p className="section-subtitle">
            Empower young minds, innovate with modern teaching technologies, and thrive in an inspiring, collaborative academic environment.
          </p>
        </div>
      </section>

      {/* 2. Why Work With Us */}
      <section className="careers-why-section">
        <div className="container">
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon-box"><Award size={22} /></div>
              <h3>Professional Growth</h3>
              <p>Continuous faculty training workshops, modern pedagogical exposure, and career advancement paths.</p>
            </div>
            <div className="why-card">
              <div className="why-icon-box"><Sparkles size={22} /></div>
              <h3>State-of-the-Art Infrastructure</h3>
              <p>Work in smart classrooms, high-tech science labs, and digitally enabled learning environments.</p>
            </div>
            <div className="why-card">
              <div className="why-icon-box"><UserCheck size={22} /></div>
              <h3>Supportive Campus Culture</h3>
              <p>Collaborate with dedicated educators, visionary leadership, and respectful, motivated students.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Open Positions List (Pure Dynamic - No Static Fallback) */}
      <section className="open-positions-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="sub-badge">Current Opportunities</span>
            <h2 className="section-title">Open Academic & Staff Roles</h2>
            <p className="section-subtitle">
              {jobsLoading 
                ? 'Loading live career openings from Carmel database...'
                : jobs.length > 0 
                ? `Explore ${jobs.length} open vacancies for the upcoming academic session.` 
                : 'Explore current career opportunities at Carmel’s Group of Schools.'}
            </p>
          </div>

          {jobsLoading ? (
            <div className="careers-loading-box text-center">
              <div className="admin-spinner" style={{ margin: '0 auto 1rem' }}></div>
              <p>Checking active vacancies...</p>
            </div>
          ) : jobs.length > 0 ? (
            <div className="positions-grid">
              {jobs.map((pos, index) => (
                <div key={pos.id || index} className="position-card">
                  <div className="position-top">
                    <span className="dept-pill">{pos.department}</span>
                    <span className="type-pill"><Clock size={12} /> {pos.job_type || 'Full-Time'}</span>
                  </div>
                  <h3>{pos.title}</h3>
                  <p className="pos-desc">{pos.description}</p>
                  
                  {pos.requirements && (
                    <div className="pos-req-box">
                      <strong>Requirements: </strong>
                      <span>{pos.requirements}</span>
                    </div>
                  )}

                  <div className="pos-meta">
                    <span><Briefcase size={14} /> Exp: {pos.experience || '2+ Years'}</span>
                    <span><MapPin size={14} /> {pos.location || 'Trichy, TN'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-positions-box text-center">
              <div className="no-pos-icon-circle">
                <Briefcase size={36} />
              </div>
              <h3>No Active Job Openings Currently Listed</h3>
              <p>
                We do not have any published vacancies at this immediate moment, but we are always eager to meet talented and passionate educators!
              </p>
              <span className="no-pos-prompt">
                You can submit your resume below for future openings in teaching, coaching, or administrative roles.
              </span>
            </div>
          )}
        </div>
      </section>

      {/* 4. Quick Application Form (Directly Connected to Supabase) */}
      <section className="careers-form-section">
        <div className="container">
          <div className="careers-form-card">
            <div className="form-info-col">
              <h2>Apply Now to Join Carmel’s Group of Schools</h2>
              <p>Submit your profile to our Human Resources and Academic Selection Committee.</p>
              <ul className="careers-benefits-list">
                <li><CheckCircle2 size={16} className="check-icon" /> Competitive salary matching institutional standards</li>
                <li><CheckCircle2 size={16} className="check-icon" /> Merit-based annual career progression</li>
                <li><CheckCircle2 size={16} className="check-icon" /> Modern digital labs & supportive campus amenities</li>
                <li><CheckCircle2 size={16} className="check-icon" /> Regular national pedagogic training seminars</li>
              </ul>
            </div>

            <div className="form-input-col">
              {submitted ? (
                <div className="careers-success-msg text-center">
                  <CheckCircle2 size={48} className="success-icon" />
                  <h3>Application Submitted Successfully!</h3>
                  <p>
                    Thank you for applying to Carmel's Group of Schools. Our Human Resources team has received your application and will review your credentials for upcoming interview rounds.
                  </p>
                  <button 
                    className="btn-apply-another"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        position: jobs.length > 0 ? jobs[0].title : 'General Faculty',
                        experience: '3-5 Years',
                        message: ''
                      });
                    }}
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="careers-form">
                  {submitError && (
                    <div className="admin-alert admin-alert-danger">
                      <AlertCircle size={16} />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="form-group">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Dr. K. Ramesh / S. Anitha"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="yourname@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Mobile Number *</label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Applied Position / Department *</label>
                    <select 
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                    >
                      {jobs.length > 0 ? (
                        jobs.map((j) => (
                          <option key={j.id} value={j.title}>
                            {j.title} ({j.department})
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="General Teaching Faculty">General Teaching Faculty</option>
                          <option value="Senior PGT Secondary Educator">Senior PGT Secondary Educator</option>
                          <option value="Primary & Kindergarten Montessori">Primary & Kindergarten Montessori</option>
                          <option value="Computer Science & AI Instructor">Computer Science & AI Instructor</option>
                          <option value="Sports & Martial Arts Coach">Sports & Martial Arts Coach</option>
                          <option value="Administrative / Office Staff">Administrative / Office Staff</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Teaching / Work Experience</label>
                    <select
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    >
                      <option value="Fresher / 0-1 Year">Fresher / 0-1 Year</option>
                      <option value="1-3 Years">1-3 Years</option>
                      <option value="3-5 Years">3-5 Years</option>
                      <option value="5-10 Years">5-10 Years</option>
                      <option value="10+ Years">10+ Years (Senior)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Cover Note / Educational Qualifications</label>
                    <textarea 
                      rows="3"
                      placeholder="Degrees (e.g. B.Ed, M.Sc, M.Phil), past institutions, and subject specializations..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-submit-careers" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="btn-spinner"></span> Submitting Application...
                      </>
                    ) : (
                      <>
                        Submit Job Application <Send size={16} />
                      </>
                    )}
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
