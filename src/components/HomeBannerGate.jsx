import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import ToppersModal from './ToppersModal';
import PosterBanner from './PosterBanner';

// Controlled component: parent (App.jsx) owns isOpen/onClose + sessionStorage
// gating, exactly like it did for <ToppersModal>. Shows all active poster
// banners as a mini carousel, or falls back to the toppers announcement.
export default function HomeBannerGate({ isOpen, onClose, onViewResults }) {
  const [rows, setRows] = useState([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isOpen || checked) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase
          .from('home_banners')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        if (!cancelled) {
          setRows(data || []);
          setChecked(true);
        }
      } catch (err) {
        console.error('HomeBannerGate fetch error:', err);
        if (!cancelled) setChecked(true);
      }
    })();
    return () => { cancelled = true; };
  }, [isOpen, checked]);

  if (!isOpen || !checked) return null;

  const posters = rows.filter((r) => r.banner_type === 'poster' && r.image_url);
  const showToppers = rows.some((r) => r.banner_type === 'toppers') || posters.length === 0;

  if (showToppers) {
    return <ToppersModal isOpen={isOpen} onClose={onClose} onViewResults={onViewResults} />;
  }

  return <PosterBanner banners={posters} onClose={onClose} />;
}
