import React, { useState, useEffect } from 'react';
import { Play, Youtube } from 'lucide-react';
import { supabase } from '../lib/supabase';
import './YouTubeSection.css';

function extractYouTubeId(url) {
  if (!url) return null;
  const trimmed = url.trim();

  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^?&\s]+)/,
    /(?:youtube\.com\/embed\/)([^?&\s]+)/,
    /(?:youtube\.com\/shorts\/)([^?&\s]+)/
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

export default function YouTubeSection() {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchYouTubeSection = async () => {
      try {
        const { data, error } = await supabase
          .from('youtube_section')
          .select('id, title, subtitle, youtube_url, is_active')
          .eq('is_active', true)
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          setSection(data);
        }
      } catch (err) {
        console.log('YouTube section unavailable:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchYouTubeSection();
  }, []);

  // Rule: inactive or not loaded yet → render nothing
  if (loading) return null;
  if (!section) return null;

  const videoId = extractYouTubeId(section.youtube_url);

  return (
    <section className="youtube-section">
      <div className="container">
        <div className="youtube-header text-center">
          <span className="youtube-eyebrow">Watch & Discover</span>
          <h2 className="youtube-title">{section.title || 'Watch Our School'}</h2>
          <p className="youtube-subtitle">
            {section.subtitle || 'Discover life at Carmel through our videos.'}
          </p>
        </div>

        <div className="youtube-player-wrapper">
          {!videoId ? (
            <div className="youtube-empty-state">
              <Youtube size={40} className="youtube-empty-icon" />
              <h3>Video Coming Soon</h3>
              <p>Our school video will be available here soon.</p>
            </div>
          ) : isPlaying ? (
            <div className="youtube-iframe-wrapper">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
                title={section.title || 'Watch Our School'}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                frameBorder="0"
              />
            </div>
          ) : (
            <button
              className="youtube-thumbnail-btn"
              onClick={() => setIsPlaying(true)}
              aria-label="Play school video"
            >
              <img
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt={section.title || 'Watch Our School'}
                className="youtube-thumbnail-img"
              />
              <span className="youtube-play-circle">
                <Play size={28} fill="#fff" />
              </span>
              <span className="youtube-watch-label">Watch Video</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}