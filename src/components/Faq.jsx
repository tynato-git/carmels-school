import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  GraduationCap, 
  BookOpen, 
  Bus, 
  Trophy,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import './Faq.css';

export default function Faq({ onOpenEnquire }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  const faqData = [
    {
      category: 'admissions',
      question: "What are the age criteria for Pre-KG, LKG, and UKG admissions?",
      answer: "For Pre-KG, the child should be 2.5 to 3 years old by April 30th of the academic year. For LKG, 3.5 to 4 years, and for UKG, 4.5 to 5 years. Parents can submit online applications or visit the admissions desk."
    },
    {
      category: 'admissions',
      question: "What documents are required during admission registration?",
      answer: "Key documents include: 1) Child's original Birth Certificate, 2) Aadhaar Card copy, 3) Transfer Certificate (TC) from previous school for Std II and above, 4) Passport-size photographs, and 5) Community Certificate copy."
    },
    {
      category: 'academics',
      question: "Which educational boards are offered at Carmel's Group of Schools?",
      answer: "Carmel's offers both Tamil Nadu State Board (Matriculation Hr. Sec. Stream) and Central Boards (CBSE & ICSE), covering pre-primary Montessori through Std XII science and commerce groups."
    },
    {
      category: 'academics',
      question: "What Higher Secondary (Std XI & XII) group streams are available?",
      answer: "We offer 6 stream combinations: Group 1 (Physics, Chemistry, Maths, Biology), Group 2 (Physics, Chemistry, Maths, Computer Science), Group 3 (Biology Specialization), Group 4 (Commerce, Accountancy, Economics, Computer Applications), and specialized NEET/JEE coaching streams."
    },
    {
      category: 'facilities',
      question: "Is school transport available across Trichy?",
      answer: "Yes, Carmel's operates a fleet of GPS-tracked buses equipped with speed governors, CCTV cameras, and trained lady attendants covering all major residential routes across Tiruchirappalli."
    },
    {
      category: 'sports',
      question: "Tell us about the National Judo Training Arena.",
      answer: "Carmel's houses a dedicated martial arts training facility featuring international-grade tatami mats and black-belt national coaches. Our student judokas regularly compete in state and national tournaments."
    },
    {
      category: 'facilities',
      question: "What safety protocols are maintained on campus?",
      answer: "Our campus is equipped with 24/7 CCTV surveillance, biometric access points, professional security personnel at all gates, and a structured dispersal system with parental ID verification cards."
    },
    {
      category: 'academics',
      question: "Are remedial and extra guidance classes conducted for board students?",
      answer: "Yes, we conduct dedicated zero-period revision sessions, weekend doubt-clearing workshops, and personalized mentoring for Std X and Std XII students to achieve top district and state ranks."
    }
  ];

  const filteredFaqs = faqData.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page-container">
      
      {/* 1. Hero Showcase */}
      <section className="faq-hero-section">
        <div className="container text-center">
          <span className="sub-badge">Help & Support</span>
          <h1 className="section-title">Frequently Asked Questions (FAQs)</h1>
          <p className="section-subtitle">
            Find quick answers to common queries regarding admissions, academic streams, campus facilities, transport, and sports.
          </p>

          {/* Search Box */}
          <div className="faq-search-box">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search questions (e.g., admissions, transport, judo, streams)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 2. Category Filter Pills */}
      <section className="faq-content-section">
        <div className="container">
          <div className="faq-categories-row">
            <button 
              className={`faq-cat-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Questions
            </button>
            <button 
              className={`faq-cat-btn ${activeCategory === 'admissions' ? 'active' : ''}`}
              onClick={() => setActiveCategory('admissions')}
            >
              Admissions
            </button>
            <button 
              className={`faq-cat-btn ${activeCategory === 'academics' ? 'active' : ''}`}
              onClick={() => setActiveCategory('academics')}
            >
              Academics & Boards
            </button>
            <button 
              className={`faq-cat-btn ${activeCategory === 'facilities' ? 'active' : ''}`}
              onClick={() => setActiveCategory('facilities')}
            >
              Transport & Safety
            </button>
            <button 
              className={`faq-cat-btn ${activeCategory === 'sports' ? 'active' : ''}`}
              onClick={() => setActiveCategory('sports')}
            >
              Judo & Sports
            </button>
          </div>

          {/* 3. Accordion List */}
          <div className="faq-accordion-list">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div key={idx} className={`faq-accordion-item ${isOpen ? 'open' : ''}`}>
                    <button 
                      className="faq-question-btn" 
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                    >
                      <span className="q-text">{faq.question}</span>
                      <span className="q-icon">{isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</span>
                    </button>

                    {isOpen && (
                      <div className="faq-answer-content">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="faq-no-results text-center">
                <HelpCircle size={40} className="no-res-icon" />
                <h3>No matching questions found</h3>
                <p>Try refining your search terms or contact our admissions help desk directly.</p>
              </div>
            )}
          </div>

          {/* 4. Still Have Questions CTA */}
          <div className="faq-contact-cta text-center">
            <MessageSquare size={32} className="cta-icon" />
            <h2>Still Have Questions?</h2>
            <p>Our admissions counselor team is here to assist you with any specific queries.</p>
            <button className="btn-primary-action" onClick={() => { if (onOpenEnquire) onOpenEnquire(); }}>
              Contact Admissions Help Desk <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
