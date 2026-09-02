import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronDown, 
  X, 
  Calendar, 
  School, 
  Award, 
  Sparkles, 
  BookOpen, 
  Share2,
  ArrowRight,
  Tag
} from 'lucide-react';
import gallery1 from '../assets/gallery1.jpg';
import gallery2 from '../assets/gallery2.jpg';
import gallery3 from '../assets/gallery3.jpg';
import scienceexpo from '../assets/scienceexpo.jpg';
import singing from '../assets/singing.jpg';
import pongal from '../assets/pongal.jpg';
import gallery6 from '../assets/gallery6.jpg';
import gallery7 from '../assets/gallery7.jpg';
import sportsmeet from '../assets/sportsmeet.jpg';
import gallery9 from '../assets/gallery9.jpg';
import gallery10 from '../assets/gallery10.jpg';
import annual from '../assets/annual.jpg';
import smartclass from '../assets/smartclass.jpg';
import judo from '../assets/judo.jpg';
import sportsground from '../assets/sportsground.jpg';
import kg from '../assets/kg.jpg';
import stage from '../assets/stage.jpg';
import library from '../assets/library.jpeg';
import { supabase } from '../lib/supabase';
import './MediaBlog.css';

export default function MediaBlog({ initialTab = 'blog' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'blog' | 'news' | 'awards'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Static Fallback Media Items for Blog, News & Events, and Awards
  const DEFAULT_MEDIA_ITEMS = [
    // 1. Blog Items
    {
      id: 1,
      type: 'blog',
      category: 'sports',
      school: 'matric',
      date: '01 Mar 2026',
      title: 'KREEDA 2026 - Annual Sports Meet',
      desc: 'Kreeda 2026 showcased incredible athletic talent, relay sprints, judo demonstrations, and house championship trophies.',
      img: sportsmeet
    },
    {
      id: 2,
      type: 'blog',
      category: 'academics',
      school: 'icse',
      date: '24 Feb 2026',
      title: 'Project day 2025-26',
      desc: 'Raying Science-themed projects were displayed in the classrooms, showcasing students innovative works and creative scientific explorations.',
      img: scienceexpo
    },
    {
      id: 3,
      type: 'blog',
      category: 'cultural',
      school: 'matric',
      date: '22 Feb 2026',
      title: 'Hymns & Hums',
      desc: 'The "Hymns & Hums" Inter-School Singing Competition was conducted as part of the celebrations, showcasing melodious performances.',
      img: singing
    },
    {
      id: 4,
      type: 'blog',
      category: 'academics',
      school: 'icse',
      date: '20 Feb 2026',
      title: 'Sangrahalay -SNPV',
      desc: 'Sangrahalay Interschool Competition showcased exhibits related to Social Studies, covering History, Geography, and Civics, enriching students under...',
      img: gallery6
    },
    {
      id: 5,
      type: 'blog',
      category: 'cultural',
      school: 'matric',
      date: '23 Feb 2026',
      title: 'Annual day-SNPV',
      desc: 'Annual Day 2025-26 Our Annual Day was celebrated on 10.01.2026 with Dr. M. Ramachandran, Professor, Speaker, and Writer, as Chief Guest.',
      img: gallery1
    },
    {
      id: 6,
      type: 'blog',
      category: 'cultural',
      school: 'icse',
      date: '10 Feb 2026',
      title: 'Annual Day - SNPT',
      desc: 'A vibrant celebration of talent, creativity, and youthful spirit at Annual Day 2025.',
      img: gallery9
    },
    {
      id: 7,
      type: 'blog',
      category: 'celebrations',
      school: 'all',
      date: '07 Dec 2025',
      title: 'Pongal celebration',
      desc: 'Pongal at Carmel’s celebrates tradition and community, with artists guiding students in rope yoga and oyilattam, blending festivity, learning, ha...',
      img: pongal
    },
    {
      id: 8,
      type: 'blog',
      category: 'cultural',
      school: 'matric',
      date: '30 Nov 2025',
      title: 'Annual Day',
      desc: 'Students enthusiastically participated in the Annual Day celebrations. They showcased their talents through various cultural perf...',
      img: annual
    },
    {
      id: 9,
      type: 'blog',
      category: 'cultural',
      school: 'icse',
      date: '13 Nov 2025',
      title: 'Swaram',
      desc: 'Swaram, Carmel’s Annual Carnatic Music Fest, celebrates rhythm, devotion, and tradition, uniting artists to enchant students and parents duri...',
      img: gallery10
    },
    {
      id: 10,
      type: 'blog',
      category: 'sports',
      school: 'all',
      date: '10 Nov 2025',
      title: 'Khel Parivarthan',
      desc: 'Carmel’s proudly hosted Khel Parivarthan 2025-26 - a grand celebration of sports, spirit, and s...',
      img: sportsmeet
    },

    // 2. News and Events Items
    {
      id: 11,
      type: 'news',
      category: 'academics',
      school: 'matric',
      date: '15 Jan 2026',
      title: 'Carmel’s High Board Examination Briefing',
      desc: 'Important parent-teacher orientation held for Std X & XII candidates regarding upcoming board exams and revision schedules.',
      img: gallery2
    },
    {
      id: 12,
      type: 'news',
      category: 'sports',
      school: 'all',
      date: '05 Jan 2026',
      title: 'State Level Judo Selection Trials',
      desc: 'Carmel’s Judo arena hosted the Tamil Nadu state-level selection trials for upcoming school games federation meets.',
      img: judo
    },
    {
      id: 13,
      type: 'news',
      category: 'academics',
      school: 'icse',
      date: '18 Dec 2025',
      title: 'Inter-School Science & AI Expo 2025-26',
      desc: 'Over 40 schools participated in Carmel’s robotics and artificial intelligence fair, showcasing working automated models.',
      img: smartclass
    },
    {
      id: 14,
      type: 'news',
      category: 'celebrations',
      school: 'all',
      date: '14 Nov 2025',
      title: 'Children’s Day Carnival & Magic Gala',
      desc: 'A joyful day packed with fun games, fancy dress shows, carnival booths, and special student performances across all grades.',
      img: kg
    },
    {
      id: 15,
      type: 'news',
      category: 'cultural',
      school: 'matric',
      date: '25 Oct 2025',
      title: 'Investiture Ceremony & Student Council Induction',
      desc: 'Elected student leaders were formally conferred their sashes and badges, taking the oath to lead Carmel with integrity and honor.',
      img: stage
    },
    {
      id: 16,
      type: 'news',
      category: 'academics',
      school: 'all',
      date: '10 Oct 2025',
      title: 'National Library Week & Reading Challenge',
      desc: 'Carmel’s central library launched the 30-day speed-reading challenge, inspiring students to explore historical and scientific literature.',
      img: library
    },

    // 3. Awards and Achievements Items
    {
      id: 17,
      type: 'awards',
      category: 'academics',
      school: 'matric',
      date: '28 Oct 2025',
      title: '50+ Centum Scores & State Board Distinction',
      desc: 'Carmel’s students achieved 100/100 Centum marks in Mathematics, Physics, Chemistry, and Computer Science in board examinations.',
      img: gallery2
    },
    {
      id: 18,
      type: 'awards',
      category: 'sports',
      school: 'icse',
      date: '12 Oct 2025',
      title: 'National Judo Championship Trophy & 12 Golds',
      desc: 'Carmel’s Judo contingent brought home 12 Gold Medals and the overall team championship trophy at the National Inter-School Meet.',
      img: judo
    },
    {
      id: 19,
      type: 'awards',
      category: 'academics',
      school: 'all',
      date: '15 Sep 2025',
      title: 'State Level Science Talent Search First Prize',
      desc: 'Carmel’s research team secured first rank at the State Level Science Talent Fair for their sustainable solar filtration initiative.',
      img: scienceexpo
    },
    {
      id: 20,
      type: 'awards',
      category: 'cultural',
      school: 'matric',
      date: '02 Sep 2025',
      title: 'Inter-School Choir Champions & Gold Medallists',
      desc: 'Our senior choir group was crowned Champions at the South India Interschool Music Festival held in Chennai.',
      img: singing
    },
    {
      id: 21,
      type: 'awards',
      category: 'sports',
      school: 'all',
      date: '20 Aug 2025',
      title: 'Regional Athletic Championship Overall Cup',
      desc: 'Carmel’s athletes bagged 18 gold and 14 silver medals in track and field events at the Trichy District Athletic Meet.',
      img: sportsground
    },
    {
      id: 22,
      type: 'awards',
      category: 'academics',
      school: 'icse',
      date: '05 Aug 2025',
      title: 'Best Eco-Campus & Environmental Excellence',
      desc: 'Recognized with the Green School Trophy for organic composting, zero-waste policies, and rainwater recharge systems.',
      img: gallery7
    }
  ];

  const [mediaItems, setMediaItems] = useState(DEFAULT_MEDIA_ITEMS);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Fetch dynamic media posts from Supabase with granular per-section fallbacks
  useEffect(() => {
    const fetchDynamicMedia = async () => {
      try {
        const { data, error } = await supabase
          .from('media_posts')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (!error && data) {
          const defaultBlog = DEFAULT_MEDIA_ITEMS.filter((i) => i.type === 'blog');
          const defaultNews = DEFAULT_MEDIA_ITEMS.filter((i) => i.type === 'news');
          const defaultAwards = DEFAULT_MEDIA_ITEMS.filter((i) => i.type === 'awards');

          const formatPost = (item) => ({
            id: item.id,
            type: item.type,
            category: item.category,
            school: item.school,
            date: item.date,
            title: item.title,
            desc: item.description,
            story: item.story,
            img: item.image_url
          });

          const dynamicBlog = data.filter((i) => i.type === 'blog').map(formatPost);
          const dynamicNews = data.filter((i) => i.type === 'news').map(formatPost);
          const dynamicAwards = data.filter((i) => i.type === 'awards').map(formatPost);

          // Use dynamic items if available for that specific tab, otherwise preserve default static items
          const finalBlog = dynamicBlog.length > 0 ? dynamicBlog : defaultBlog;
          const finalNews = dynamicNews.length > 0 ? dynamicNews : defaultNews;
          const finalAwards = dynamicAwards.length > 0 ? dynamicAwards : defaultAwards;

          setMediaItems([...finalBlog, ...finalNews, ...finalAwards]);
        }
      } catch (err) {
        console.log('Using default static media posts fallback');
      }
    };

    fetchDynamicMedia();
  }, []);

  // Filtering Logic
  const filteredItems = mediaItems.filter(item => {
    // 1. Tab filter
    if (activeTab === 'blog' && item.type !== 'blog') return false;
    if (activeTab === 'news' && item.type !== 'news') return false;
    if (activeTab === 'awards' && item.type !== 'awards') return false;

    // 2. Category filter
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;

    // 3. School filter
    if (schoolFilter !== 'all' && item.school !== 'all' && item.school !== schoolFilter) return false;

    // 4. Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.desc.toLowerCase().includes(q);
      return matchTitle || matchDesc;
    }

    return true;
  });

  return (
    <div className="media-blog-page">
      <div className="container">
        
        {/* Top Pill Segmented Switcher (Matching Reference) */}
        <div className="media-tabs-wrapper text-center">
          <div className="media-pill-bar">
            <button 
              className={`pill-tab ${activeTab === 'blog' ? 'active' : ''}`}
              onClick={() => setActiveTab('blog')}
            >
              Blog
            </button>
            <button 
              className={`pill-tab ${activeTab === 'news' ? 'active' : ''}`}
              onClick={() => setActiveTab('news')}
            >
              News and Events
            </button>
            <button 
              className={`pill-tab ${activeTab === 'awards' ? 'active' : ''}`}
              onClick={() => setActiveTab('awards')}
            >
              Awards and Achievements
            </button>
          </div>
        </div>

        {/* Filter & Search Toolbar Bar (Matching Reference) */}
        <div className="media-toolbar-row">
          
          {/* Category Dropdown */}
          <div className="toolbar-select-box">
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="media-select"
            >
              <option value="all">Category</option>
              <option value="academics">Academics & Science</option>
              <option value="sports">Sports & Judo</option>
              <option value="cultural">Arts & Music</option>
              <option value="celebrations">Festivals & Celebrations</option>
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div>

          {/* School Dropdown */}
          <div className="toolbar-select-box">
            <select 
              value={schoolFilter} 
              onChange={(e) => setSchoolFilter(e.target.value)}
              className="media-select"
            >
              <option value="all">School</option>
              <option value="matric">Carmel's Matriculation Hr. Sec. School</option>
              <option value="icse">Carmel's ICSE & ISC School</option>
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div>

          {/* Search Input Box */}
          <div className="toolbar-search-box">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="media-search-input"
            />
            <Search size={18} className="search-icon" />
          </div>

          {/* Gold Search Button */}
          <button className="btn-media-search">
            Search
          </button>

        </div>

        {/* Blog / News Cards Grid (Matching Reference 4-column layout) */}
        {filteredItems.length > 0 ? (
          <div className="media-cards-grid">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="media-blog-card"
                onClick={() => setSelectedArticle(item)}
                title="Click to read full story"
              >
                
                {/* Image Container */}
                <div className="media-card-img-wrapper">
                  <img src={item.img} alt={item.title} className="media-card-img" />
                  <span className="media-read-prompt">Read Story &rarr;</span>
                </div>

                {/* Card Body */}
                <div className="media-card-body">
                  <span className="media-date-text">Posted on {item.date}.</span>
                  <h3 className="media-card-title">{item.title}</h3>
                  <p className="media-card-desc">{item.desc}</p>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="media-empty-box text-center">
            <h3>No Posts Found</h3>
            <p>No results match your search or filter criteria. Try clearing your filters.</p>
            <button 
              className="btn-media-reset"
              onClick={() => {
                setCategoryFilter('all');
                setSchoolFilter('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* =========================================================
          DETAILED BLOG / NEWS / AWARD ARTICLE MODAL POP-UP
         ========================================================= */}
      {selectedArticle && (
        <div className="article-modal-backdrop" onClick={() => setSelectedArticle(null)}>
          <div className="article-modal-container" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="article-modal-header">
              <div className="article-header-meta">
                <span className={`article-type-pill ${selectedArticle.type}`}>
                  {selectedArticle.type === 'blog' ? 'Blog Story' : selectedArticle.type === 'news' ? 'News & Event' : 'Award & Achievement'}
                </span>
                <span className="article-cat-pill">{selectedArticle.category.toUpperCase()}</span>
                <span className="article-date-meta"><Calendar size={13} /> {selectedArticle.date}</span>
              </div>
              <button className="article-close-btn" onClick={() => setSelectedArticle(null)} aria-label="Close Article">
                <X size={20} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="article-modal-body">
              <div className="article-hero-img-wrap">
                <img src={selectedArticle.img} alt={selectedArticle.title} className="article-hero-img" />
              </div>

              <h2 className="article-full-title">{selectedArticle.title}</h2>
              
              <div className="article-school-badge-row">
                <span className="school-pill">
                  <School size={14} /> 
                  {selectedArticle.school === 'matric' 
                    ? "Carmel's Matriculation Hr. Sec. School" 
                    : selectedArticle.school === 'icse' 
                    ? "Carmel's ICSE & ISC School" 
                    : "Carmel's Group of Schools"}
                </span>
              </div>

              {/* Story Content Paragraphs */}
              <div className="article-content-story">
                {selectedArticle.desc && (
                  <p className="article-lead-paragraph">
                    {selectedArticle.desc}
                  </p>
                )}

                {selectedArticle.story && selectedArticle.story.trim() ? (
                  selectedArticle.story
                    .split('\n')
                    .filter((line) => line.trim() !== '')
                    .map((para, idx) => (
                      <p key={idx} className="article-paragraph">
                        {para}
                      </p>
                    ))
                ) : (
                  <>
                    <p className="article-paragraph">
                      Carmel's Group of Schools is dedicated to fostering an environment where academic rigor meets character building and experiential learning. Events and achievements like this embody our vibrant campus spirit, enabling students to explore their distinct potentials and excel on regional and national stages.
                    </p>
                    <p className="article-paragraph">
                      We congratulate all participating students, dedicated faculty mentors, and supportive parents who continuously make our school community proud through active participation, discipline, and collaborative triumphs.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="article-modal-footer">
              <button className="btn-article-close" onClick={() => setSelectedArticle(null)}>
                Close Article
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
