import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Award, 
  Sparkles, 
  GraduationCap, 
  CheckCircle2, 
  Star, 
  Medal, 
  BookOpen, 
  TrendingUp, 
  ArrowRight, 
  ShieldCheck, 
  Crown, 
  FileText,
  User
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import schoolLogo from '../assets/Logo.png';
import './Results.css';

export default function Results({ onOpenEnquire }) {
  // 1. Key Academic Marks Performance Highlights (Static Default Fallback)
  const DEFAULT_MARK_STATS = [
    { number: '100%', label: 'Board Pass Percentage', sub: '100% Pass Rate in Std X & Std XII Examinations' },
    { number: '588 / 600', label: 'Std XII Highest Mark', sub: 'Top School Score in Higher Secondary Board' },
    { number: '494 / 500', label: 'Std X Highest Mark', sub: 'Top School Score in SSLC Board Examination' },
    { number: '50+', label: 'Centums Scored (100/100)', sub: 'Full Marks Scored in Maths, Physics, CS & Commerce' }
  ];

  // 2. Top Student Mark Achievers List (Static Default Fallback - Limit: 5)
  const DEFAULT_MARK_ACHIEVERS = [
    {
      rank: 'Rank 1',
      name: 'Std XII Biology Stream Topper',
      totalScore: '588 / 600',
      percentage: '98.0%',
      stream: 'Biology & Physics Stream',
      centums: ['Mathematics: 100/100', 'Biology: 100/100', 'Chemistry: 100/100'],
      badgeColor: 'gold',
      photoUrl: ''
    },
    {
      rank: 'Rank 2',
      name: 'Std XII Computer Science Topper',
      totalScore: '585 / 600',
      percentage: '97.5%',
      stream: 'Computer Science & Maths Stream',
      centums: ['Computer Science: 100/100', 'Mathematics: 100/100'],
      badgeColor: 'silver',
      photoUrl: ''
    },
    {
      rank: 'Rank 3',
      name: 'Std XII Commerce Stream Topper',
      totalScore: '582 / 600',
      percentage: '97.0%',
      stream: 'Commerce & Accountancy Stream',
      centums: ['Accountancy: 100/100', 'Economics: 100/100'],
      badgeColor: 'bronze',
      photoUrl: ''
    },
    {
      rank: 'Rank 1',
      name: 'Std X SSLC Board School Topper',
      totalScore: '494 / 500',
      percentage: '98.8%',
      stream: 'Matriculation Board Std X',
      centums: ['Mathematics: 100/100', 'Science: 100/100', 'Social Science: 100/100'],
      badgeColor: 'gold',
      photoUrl: ''
    }
  ];

  const [markStats, setMarkStats] = useState(DEFAULT_MARK_STATS);
  const [markAchievers, setMarkAchievers] = useState(DEFAULT_MARK_ACHIEVERS);

  // Fetch dynamic stats and toppers from Supabase with robust safe parsing
  useEffect(() => {
    let isMounted = true;

    const fetchDynamicResults = async () => {
      try {
        // Fetch 4 Result Stats
        const { data: statsData, error: statsErr } = await supabase
          .from('result_stats')
          .select('*')
          .order('display_order', { ascending: true });

        if (!statsErr && statsData && statsData.length > 0 && isMounted) {
          setMarkStats(
            statsData.map((s) => ({
              number: s.stat_number || '',
              label: s.label || '',
              sub: s.subtitle || ''
            }))
          );
        }

        // Fetch Topper Cards (Limit: 5)
        const { data: toppersData, error: toppersErr } = await supabase
          .from('academic_toppers')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .limit(5);

        if (!toppersErr && toppersData && toppersData.length > 0 && isMounted) {
          setMarkAchievers(
            toppersData.map((ach) => {
              let parsedCentums = [];
              if (Array.isArray(ach.centums)) {
                parsedCentums = ach.centums;
              } else if (typeof ach.centums === 'string') {
                parsedCentums = ach.centums.split('\n').map((c) => c.trim()).filter(Boolean);
              }

              return {
                rank: ach.rank || 'Rank 1',
                name: ach.name || '',
                totalScore: ach.total_score || '',
                percentage: ach.percentage || '',
                stream: ach.stream || '',
                centums: parsedCentums,
                badgeColor: ach.badge_color || 'gold',
                photoUrl: ach.photo_url || ''
              };
            })
          );
        }
      } catch (err) {
        console.log('Using default static results fallback');
      }
    };

    fetchDynamicResults();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="results-page-container">
      
      {/* 1. Header Banner */}
      <section className="results-header-section">
        <div className="container">
          <div className="results-header-box">
            <span className="results-badge">
              Board Examination Achievements
            </span>
            <h1 className="results-main-title">Academic Marks & Board Results</h1>
            <p className="results-subtitle">
              Showcasing the outstanding academic mark performance, centum scores (100/100), and top board examination rank holders of Carmel’s School.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Key Academic Mark Stat Cards */}
      <section className="stats-cards-section">
        <div className="container">
          <div className="stats-grid">
            {(markStats || DEFAULT_MARK_STATS).map((st, idx) => (
              <div key={idx} className="stat-box-card">
                <div className="stat-icon-circle">
                  {idx === 0 && <TrendingUp size={28} />}
                  {idx === 1 && <Crown size={28} />}
                  {idx === 2 && <Trophy size={28} />}
                  {idx === 3 && <Star size={28} />}
                </div>
                <h2 className="stat-number">{st.number}</h2>
                <h4 className="stat-label">{st.label}</h4>
                <p className="stat-sub">{st.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Top Student Mark Rank Holders */}
      <section className="achievers-showcase-section">
        <div className="container">
          
          <div className="section-header text-center">
            <span className="section-badge-pill">
              <Crown size={14} /> Board Rank Holders
            </span>
            <h2 className="section-title">Top Academic Mark Achievers</h2>
            <p className="section-subtitle">Consistently securing distinction, school first ranks, and centums across all academic streams.</p>
          </div>

          <div className="achievers-cards-grid">
            {(markAchievers || DEFAULT_MARK_ACHIEVERS).map((ach, idx) => (
              <div key={idx} className={`achiever-card ${ach.badgeColor || 'gold'}`}>

  {/* Top Box: photo circle with rank badge overlapping the bottom edge */}
  <div className="achiever-photo-wrap">
    {ach.photoUrl ? (
      <img src={ach.photoUrl} alt={ach.name || 'Topper'} className="achiever-photo" />
    ) : (
      <div className="achiever-photo-placeholder">
        <User size={36} />
      </div>
    )}
    <div className="achiever-rank-badge">
      <Medal size={13} /> {ach.rank}
    </div>
  </div>

  {/* Bottom Box: text details below the photo */}
  <div className="achiever-details">
    <h3 className="achiever-name">{ach.name}</h3>
    <div className="achiever-score-pill">
      <span className="score-val">{ach.totalScore}</span>
      <span className="score-percentage">{ach.percentage}</span>
    </div>
    <p className="achiever-stream">{ach.stream}</p>
  </div>
                
                {Array.isArray(ach.centums) && ach.centums.length > 0 && (
                  <div className="achiever-centums-box">
                    <span className="centums-header-label">Centum Scores (100/100):</span>
                    {ach.centums.map((c, cIdx) => (
                      <span key={cIdx} className="centum-tag">
                        <Star size={12} /> {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Bottom Call to Action Banner */}
      <section className="results-cta-section">
        <div className="container">
          <div className="results-cta-card">
            <h2>Join Our Legacy of High Academic Marks</h2>
            <p>Give your child the academic guidance, individual care, and rigorous training needed to achieve top marks in Board Exams.</p>
            <button className="btn-results-apply" onClick={() => { if (onOpenEnquire) onOpenEnquire(); }}>
              Enquire For Admission 2026-27 <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
