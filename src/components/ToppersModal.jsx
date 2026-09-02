import React, { useEffect, useState } from 'react';
import { X, Trophy, Award, ArrowRight, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import schoolLogo from '../assets/Logo.png';
import './ToppersModal.css';

export default function ToppersModal({ isOpen, onClose, onViewResults }) {
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState(null);
  const [toppersXII, setToppersXII] = useState([]);
  const [toppersX, setToppersX] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const [annRes, toppersRes] = await Promise.all([
          supabase.from('results_announcement').select('*').limit(1).maybeSingle(),
          supabase
            .from('academic_toppers')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true })
        ]);

        if (cancelled) return;

        if (annRes.data) setAnnouncement(annRes.data);

        const rows = toppersRes.data || [];
        setToppersXII(rows.filter((t) => (t.class_level || 'XII') === 'XII'));
        setToppersX(rows.filter((t) => t.class_level === 'X'));
      } catch (err) {
        // Fail silently — popup simply won't show if data can't load
        console.error('ToppersModal fetch error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [isOpen]);

  if (!isOpen || loading) return null;

  // Self-hide: nothing to announce, or admin turned the banner off
  const hasAnyToppers = toppersXII.length > 0 || toppersX.length > 0;
  if (!hasAnyToppers) return null;
  if (announcement && announcement.is_active === false) return null;

  const handleViewResults = () => {
    onClose();
    if (onViewResults) onViewResults();
  };

  const rankInfo = (idx) => {
    const labels = ['I PLACE', 'II PLACE', 'II PLACE', 'III PLACE', 'III PLACE'];
    const borders = ['gold-border', 'silver-border', 'silver-border', 'bronze-border', 'bronze-border'];
    const badges = ['gold-rank', 'silver-rank', 'silver-rank', 'bronze-rank', 'bronze-rank'];
    const i = Math.min(idx, labels.length - 1);
    return { label: labels[i], border: borders[i], badge: badges[i] };
  };

  const renderTopperCard = (topper, idx) => {
    const { label, border, badge } = rankInfo(idx);
    return (
      <div className={`topper-card ${border}`} key={topper.id || idx}>
        <div className="topper-photo-holder">
          {topper.photo_url ? (
            <img src={topper.photo_url} alt={topper.name} className="topper-photo" />
          ) : (
            <div className="topper-photo topper-photo-placeholder">
              <User size={26} />
            </div>
          )}
          <span className={`rank-badge ${badge}`}>{label}</span>
        </div>
        <h4 className="topper-name">{topper.name}</h4>
        <p className="topper-mark-line">{topper.total_score}</p>
        <span className="topper-stream-tag">{topper.stream}</span>
      </div>
    );
  };

  return (
    <div className="toppers-modal-overlay" onClick={onClose}>
      <div className="toppers-modal-card" onClick={(e) => e.stopPropagation()}>

        <button className="toppers-modal-close-btn" onClick={onClose} aria-label="Close Announcement">
          <X size={18} />
        </button>

        {announcement?.ribbon_text && (
          <div className="ribbon-100-percent">
            <span className="ribbon-text">{announcement.ribbon_text}</span>
            <span className="ribbon-sub">{announcement.ribbon_sub}</span>
          </div>
        )}

        <div className="toppers-modal-header text-center">
          <div className="toppers-brand-row">
            <img src={schoolLogo} alt="Carmel School Logo" className="toppers-logo" />
            <div className="toppers-school-info">
              <h2 className="toppers-school-title">CARMEL'S MATRICULATION & ICSE SCHOOLS</h2>
              <p className="toppers-school-sub">Ramalinga Nagar West Extn., Woraiyur, Trichy - 620003</p>
            </div>
          </div>
          <p className="toppers-announcement-lead">
            The Management, Principal & Staff are proud to announce our <strong>School Board Toppers</strong>
          </p>
        </div>

        <div className="toppers-congrats-banner">
          <h1 className="congrats-heading">{announcement?.congrats_heading || 'Congratulations!'}</h1>
          <p className="congrats-sub">
            {announcement?.congrats_sub || 'ACADEMIC BOARD TOPPERS'} {announcement?.academic_year ? `– ${announcement.academic_year}` : ''}
          </p>
        </div>

        {toppersXII.length > 0 && (
          <div className="toppers-section-block">
            <div className="section-title-pill xii-pill">
              <Trophy size={15} /> SCHOOL TOPPERS – XII STD
            </div>

            <div className="toppers-grid dynamic-grid">
              {toppersXII.map((t, idx) => renderTopperCard(t, idx))}
            </div>

            {announcement?.centums_xii && (
              <div className="centums-highlight-strip">
                <span><strong>Centum Scores (100/100):</strong> {announcement.centums_xii}</span>
              </div>
            )}
          </div>
        )}

        {toppersX.length > 0 && (
          <div className="toppers-section-block">
            <div className="section-title-pill x-pill">
              <Award size={15} /> SCHOOL TOPPERS – X STD (SSLC BOARD)
            </div>

            <div className="toppers-grid dynamic-grid">
              {toppersX.map((t, idx) => renderTopperCard(t, idx))}
            </div>

            {announcement?.centums_x && (
              <div className="centums-highlight-strip">
                <span><strong>Std X Centums:</strong> {announcement.centums_x}</span>
              </div>
            )}
          </div>
        )}

        <div className="toppers-modal-footer text-center">
          <p className="motto-p">
            “{announcement?.motto_text || 'Your hard work, dedication and perseverance have made us proud.'}”
          </p>
          <p className="motto-bold">{announcement?.motto_bold || 'KEEP STRIVING FOR EXCELLENCE!'}</p>

          <div className="motto-stars-row">
            <span>Aspire</span> ★ <span>Achieve</span> ★ <span>Excel</span>
          </div>

          <div className="toppers-actions-row">
            <button className="btn-toppers-full-results" onClick={handleViewResults}>
              View Complete Board Results <ArrowRight size={15} />
            </button>
            <button className="btn-toppers-close" onClick={onClose}>
              Continue to Website
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
