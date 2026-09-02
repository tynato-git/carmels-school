import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import './Events.css';
import { supabase } from '../lib/supabase';

export default function Events({ onOpenEnquire }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('school_events')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        throw error;
      }

      setEvents(data || []);
    } catch (err) {
      console.error('Events fetch error:', err);
      setError(err.message || 'Unable to load events.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="events-page-container">

      {/* Hero */}
      <section className="events-hero-section">
        <div className="container text-center">
          <span className="sub-badge">School Calendar</span>

          <h1 className="section-title">
            Events & Celebrations at Carmel’s
          </h1>

          <p className="section-subtitle">
            Stay updated with our academic dates, sports meets, science expos,
            and cultural celebrations.
          </p>
        </div>
      </section>

      {/* Events */}
      <section className="events-list-section">
        <div className="container">

          {/* Loading */}
          {loading && (
            <div className="events-empty-state">
              <RefreshCw className="events-loading-icon" size={34} />
              <h3>Loading events...</h3>
              <p>Please wait while we load the latest school events.</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="events-empty-state events-error-state">
              <Calendar size={38} />

              <h3>Unable to load events</h3>

              <p>
                {error}
              </p>

              <button
                type="button"
                className="btn-register-evt"
                onClick={fetchEvents}
              >
                Try Again
                <RefreshCw size={15} />
              </button>
            </div>
          )}

          {/* No events */}
          {!loading && !error && events.length === 0 && (
            <div className="events-empty-state">
              <Calendar size={38} />

              <h3>No upcoming events</h3>

              <p>
                New events and celebrations will appear here when published
                by the school.
              </p>
            </div>
          )}

          {/* Event cards */}
          {!loading && !error && events.length > 0 && (
            <div className="events-grid">

              {events.map((evt) => (
                <div key={evt.id} className="event-card">

                  <div className="event-date-box">
                    <span className="date-badge">
                      <Calendar size={18} />
                      {evt.date}
                    </span>
                  </div>

                  <div className="event-info">

                    <h3>
                      {evt.title}
                    </h3>

                    {evt.desc && (
                      <p className="evt-desc">
                        {evt.desc}
                      </p>
                    )}

                    <div className="evt-meta">

                      {evt.time && (
                        <span>
                          <Clock size={14} />
                          {evt.time}
                        </span>
                      )}

                      {evt.location && (
                        <span>
                          <MapPin size={14} />
                          {evt.location}
                        </span>
                      )}

                    </div>

                    <button
                      type="button"
                      className="btn-register-evt"
                      onClick={() => {
                        if (onOpenEnquire) {
                          onOpenEnquire();
                        }
                      }}
                    >
                      Attend / Enquire
                      <ArrowRight size={14} />
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>
      </section>

    </div>
  );
}