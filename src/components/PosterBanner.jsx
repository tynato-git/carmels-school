import React from 'react';
import { X } from 'lucide-react';
import './PosterBanner.css';

// banners: array of active poster rows (display_order ascending).
// Only the FIRST active banner is shown — even if admin has
// uploaded up to 5, the popup displays just one at a time.
export default function PosterBanner({ banners, onClose }) {
  if (!banners || banners.length === 0) return null;

  const banner = banners[0];

  const imgEl = <img src={banner.image_url} alt={banner.title || 'Announcement'} className="poster-banner-img" />;

  return (
    <div className="poster-banner-overlay" onClick={onClose}>
      <div className="poster-banner-card" onClick={(e) => e.stopPropagation()}>
        <button className="poster-banner-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {banner.link_url ? (
          <a href={banner.link_url} className="poster-banner-link-wrap">{imgEl}</a>
        ) : imgEl}

        {(banner.title || banner.subtitle) && (
          <div className="poster-banner-body">
            {banner.title && <h3 className="poster-banner-title">{banner.title}</h3>}
            {banner.subtitle && <p className="poster-banner-subtitle">{banner.subtitle}</p>}
          </div>
        )}

        <div className="poster-banner-footer">
          <button className="poster-banner-continue-btn" onClick={onClose}>
            Continue to Website
          </button>
        </div>
      </div>
    </div>
  );
}