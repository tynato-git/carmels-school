import { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronRight,
  X, 
  GraduationCap,
  Building2,
  BookOpen,
  Sparkles,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import schoolLogo from '../assets/Logo.png';
import EnquireModal from './EnquireModal';
import './Navbar.css';
 
 
 
export default function Navbar({ currentPage = 'contact', onNavigate, onOpenAdmin }) {
  const [activeTab, setActiveTab] = useState(currentPage);
  const [activeDrawerTab, setActiveDrawerTab] = useState('Careers');
  const [isCampusesDropdownOpen, setIsCampusesDropdownOpen] = useState(false);
  const [isAcademicsDropdownOpen, setIsAcademicsDropdownOpen] = useState(false);
  const [isMediaDropdownOpen, setIsMediaDropdownOpen] = useState(false);
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [isEnquireModalOpen, setIsEnquireModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
 
  useEffect(() => {
    setActiveTab(currentPage);
  }, [currentPage]);
 
  // Handle header float/shadow effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
 
  const handleNavClick = (tabName, subTab = null) => {
  setActiveTab(tabName);
  if (onNavigate) {
    onNavigate(tabName.toLowerCase(), subTab);
  }
  setIsMediaDropdownOpen(false);
  setIsCampusesDropdownOpen(false);
  setIsAcademicsDropdownOpen(false); // ← add this line
};
 
  const drawerNavItems = [
    { title: 'Academics', page: 'Curriculum', hasChevron: true },
    { title: 'Alumni', hasChevron: false },
    { title: 'FAQ', hasChevron: false },
    { title: 'Careers', hasChevron: false },
    { title: 'Events', hasChevron: true },
  ];
 
  return (
    <>
      {/* Floating Header Container */}
      <header className={`floating-header-wrapper ${isScrolled ? 'is-scrolled' : ''}`}>
        <nav className="floating-navbar">
          <div className="floating-navbar-content">
            
            {/* Left Navigation Links: Home, About, Campuses, Media, Results, Careers */}
            <div className="nav-left">
              <ul className="nav-links">
                <li className={`nav-item ${activeTab.toLowerCase() === 'home' ? 'active' : ''}`}>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('Home'); }}>
                    Home
                  </a>
                </li>
 
                <li className={`nav-item ${activeTab.toLowerCase() === 'about' ? 'active' : ''}`}>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('About'); }}>
                    About
                  </a>
                </li>
 
                {/* Campuses Dropdown Item */}
                <li 
                  className={`nav-item dropdown ${['campuses', 'matric-school', 'english-school', 'play-school'].includes(activeTab.toLowerCase()) ? 'active' : ''}`}
                  onMouseEnter={() => setIsCampusesDropdownOpen(true)}
                  onMouseLeave={() => setIsCampusesDropdownOpen(false)}
                >
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); handleNavClick('Campuses'); }}
                  >
                    Campuses <ChevronDown size={14} className={`chevron ${isCampusesDropdownOpen ? 'rotated' : ''}`} />
                  </a>
 
                  {/* Dropdown Menu */}
                  {isCampusesDropdownOpen && (
                    <div className="dropdown-menu campuses-dropdown-menu">
                      <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('Campuses'); }}>
                        <Building2 size={15} className="menu-icon" /> All Campuses & Facilities
                      </a>
                      <div className="dropdown-divider"></div>
                      <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('matric-school'); }}>
                        <GraduationCap size={15} className="menu-icon" /> Carmel’s Matriculation Hr. Sec. School
                      </a>
                      <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('english-school'); }}>
                        <BookOpen size={15} className="menu-icon" /> Carmel’s English School (CBSE / ICSE)
                      </a>
                      <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('play-school'); }}>
                        <Sparkles size={15} className="menu-icon" /> Carmel’s Play School
                      </a>
                    </div>
                  )}
                </li>
 
                
 
                {/* Media Dropdown Item */}
                <li 
                  className={`nav-item dropdown ${activeTab.toLowerCase() === 'media' ? 'active' : ''}`}
                  onMouseEnter={() => setIsMediaDropdownOpen(true)}
                  onMouseLeave={() => setIsMediaDropdownOpen(false)}
                >
                  <button 
                    className="dropdown-trigger"
                    onClick={() => setIsMediaDropdownOpen(!isMediaDropdownOpen)}
                    aria-expanded={isMediaDropdownOpen}
                  >
                    Media <ChevronDown size={14} className={`chevron ${isMediaDropdownOpen ? 'rotated' : ''}`} />
                  </button>
 
                  {/* Dropdown Menu */}
                  {isMediaDropdownOpen && (
                    <div className="dropdown-menu">
                      <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('Media', 'blog'); }}>Blog</a>
                      <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('Media', 'news'); }}>News & Events</a>
                      <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('Media', 'awards'); }}>Awards & Achievements</a>
                    </div>
                  )}
                </li>
 
                <li className={`nav-item ${activeTab.toLowerCase() === 'results' ? 'active' : ''}`}>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('Results'); }}>
                    Results
                  </a>
                </li>
 
                <li className={`nav-item ${activeTab.toLowerCase() === 'careers' ? 'active' : ''}`}>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('Careers'); }}>
                    Careers
                  </a>
                </li>
              </ul>
            </div>
 
            {/* Center Branding / Logo */}
            <div className="nav-center">
              <a href="#" className="brand-link" onClick={(e) => { e.preventDefault(); handleNavClick('Home'); }} title="Carmel's Group of Schools">
                <img 
                  src={schoolLogo} 
                  alt="Carmel's School Logo" 
                  className="brand-logo" 
                />
                <div className="brand-text-wrapper">
                  <span className="brand-title">CARMEL'S</span>
                  <span className="brand-subtitle">Group of Schools</span>
                </div>
              </a>
            </div>
 
            {/* Right Navigation: Academics, Events & Celebrations, Testimonial, FAQ's, Contact + actions */}


            <div className="nav-right">
              <ul className="nav-links nav-links-right">
                 {/* Academics Dropdown */}
    <li 
      className={`nav-item dropdown ${activeTab.toLowerCase() === 'curriculum' ? 'active' : ''}`}
      onMouseEnter={() => setIsAcademicsDropdownOpen(true)}
      onMouseLeave={() => setIsAcademicsDropdownOpen(false)}
    >
      <a 
        href="#" 
        onClick={(e) => { e.preventDefault(); handleNavClick('Curriculum'); }}
      >
        Academics <ChevronDown size={14} className={`chevron ${isAcademicsDropdownOpen ? 'rotated' : ''}`} />
      </a>

      {isAcademicsDropdownOpen && (
        <div className="dropdown-menu">
          <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('Curriculum', 'curriculum'); }}>
            <BookOpen size={15} className="menu-icon" /> Curriculum
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('Curriculum', 'faculty'); }}>
            <GraduationCap size={15} className="menu-icon" /> Faculty
          </a>
        </div>
      )}
    </li>
                <li className={`nav-item ${activeTab.toLowerCase() === 'events' ? 'active' : ''}`}>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('Events'); }}>
                    Events & Celebrations
                  </a>
                </li>
 
                <li className={`nav-item ${activeTab.toLowerCase() === 'alumni' ? 'active' : ''}`}>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('Alumni'); }}>
                    Testimonial
                  </a>
                </li>
 
                <li className={`nav-item ${activeTab.toLowerCase() === 'faq' ? 'active' : ''}`}>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('FAQ'); }}>
                    FAQ's
                  </a>
                </li>
 
                <li className={`nav-item ${activeTab.toLowerCase() === 'contact' ? 'active' : ''}`}>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('Contact'); }}>
                    Contact
                  </a>
                </li>
              </ul>
 
              <a href="/admission"
              rel="noopener noreferrer"
              className="btn btn-admission desktop-only" >
                Admission
              </a>
 
              {/* Menu Drawer Toggle Button */}
              <button 
                className="side-drawer-toggle-btn"
                onClick={() => setIsSideDrawerOpen(true)}
                aria-label="Open Navigation Drawer"
                title="Open Menu"
              >
                <span className="hamburger-bar"></span>
                <span className="hamburger-bar short"></span>
                <span className="hamburger-bar"></span>
              </button>
            </div>
 
          </div>
        </nav>
      </header>
 
      {/* Side Drawer Overlay & Panel (Matching Reference Design) */}
      {isSideDrawerOpen && (
        <div className="drawer-overlay-backdrop" onClick={() => setIsSideDrawerOpen(false)}>
          <aside 
            className="side-drawer-panel"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Right Close Circle Button */}
            <button 
              className="drawer-close-btn-circle"
              onClick={() => setIsSideDrawerOpen(false)}
              aria-label="Close Drawer"
            >
              <X size={20} />
            </button>
 
            {/* Drawer Logo & Centered Header */}
            <div className="drawer-header-centered text-center">
              <img src={schoolLogo} alt="Carmel's School Logo" className="drawer-school-logo" />
              <h2 className="drawer-brand-heading">CARMEL'S SCHOOLS</h2>
            </div>
 
            {/* Drawer Navigation Links */}
            <nav className="drawer-nav-scroll">
              <ul className="drawer-link-list">
                {[
                  { title: 'Home', page: 'Home', hasChevron: false },
                  { title: 'About', page: 'About', hasChevron: false },
                  { title: 'Campuses', page: 'Campuses', hasChevron: false },
                  { title: 'Curriculum', page: 'Curriculum', hasChevron: true },
                  { title: 'Results', page: 'Results', hasChevron: false },
                  { title: 'Media & Blog', page: 'Media', hasChevron: false },
                  { title: 'Alumni', page: 'Alumni', hasChevron: false },
                  { title: 'Careers', page: 'Careers', hasChevron: false },
                  { title: 'Events & Celebrations', page: 'Events', hasChevron: true },
                  { title: 'FAQ & Help', page: 'FAQ', hasChevron: false },
                  { title: 'Contact', page: 'Contact', hasChevron: false }
                ].map((item, idx) => (
                  <li key={idx}>
                    <button 
                      className={`drawer-nav-item ${(activeTab.toLowerCase() === (item.page || '').toLowerCase()) ? 'active' : ''}`}
                      onClick={() => {
                        if (item.page) {
                          handleNavClick(item.page, item.subTab || null);
                        }
                        setIsSideDrawerOpen(false);
                      }}
                    >
                      <span className="drawer-nav-label">{item.title}</span>
                      {item.hasChevron && <ChevronRight size={16} className="drawer-chevron-icon" />}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
 
            {/* Action Buttons at Bottom (Matching Reference) */}
            <div className="drawer-action-buttons">
              <a
                href="/admission"
                rel="noopener noreferrer"
                className="btn-drawer-admission"
                onClick={() => {
                  setIsSideDrawerOpen(false);
                  
                }}
              >
               Admission
              </a>
              <button 
                className="btn-drawer-enquire"
                onClick={() => {
                  setIsSideDrawerOpen(false);
                  setIsEnquireModalOpen(true);
                }}
              >
                Enquire Now
              </button>
            </div>
 
            {/* Drawer Footer & Social Media Buttons */}
            <div className="drawer-footer-social">
              <div className="drawer-social-row">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="drawer-social-btn fb" aria-label="Facebook">
                  <Facebook size={18} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="drawer-social-btn insta" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="drawer-social-btn yt" aria-label="YouTube">
                  <Youtube size={18} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="drawer-social-btn in" aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>
              </div>
 
              {/* Admin Portal Trigger (Target blank new tab) */}
              <div className="drawer-admin-section">
                <a 
                  href={`${import.meta.env.BASE_URL}#/admin/dashboard`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-drawer-admin"
                  onClick={() => setIsSideDrawerOpen(false)}
                  title="Open Admin Portal in New Tab"
                >
                  <ShieldCheck size={16} />
                  <span>Admin Portal</span>
                  <ExternalLink size={13} className="admin-ext-icon" />
                </a>
              </div>
            </div>
 
          </aside>
        </div>
      )}
 
      {/* Popup Enquiry Modal */}
      <EnquireModal 
        isOpen={isEnquireModalOpen} 
        onClose={() => setIsEnquireModalOpen(false)} 
      />
    </>
  );
}