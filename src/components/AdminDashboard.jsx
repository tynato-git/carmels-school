import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  LogOut, 
  Globe, 
  Layers, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  UploadCloud, 
  Eye, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  Database,
  Calendar,
  Tag,
  ArrowUpRight,
  ArrowUp,
  ArrowDown,
  X,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ZoomIn,
  ZoomOut,
  Move,
  Crop,
  RotateCcw,
  Check,
  Camera,
  Filter,
  Newspaper,
  Award,
  BookOpen,
  School,
  Trophy,
  Crown,
  Star,
  Medal,
  TrendingUp,
  User,
  Briefcase,
  Users,
  MapPin,
  Clock,
  Send,
  Phone,
  Settings,
  Building2,
  Share2,
  Megaphone,
  Youtube,
  Play,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSchoolInfo, DEFAULT_SCHOOL_INFO } from '../context/SchoolInfoContext';
import schoolLogo from '../assets/Logo.png';
import './AdminDashboard.css';

const MAX_CAROUSEL_SLIDES = 5;
const MAX_TOPPER_CARDS = 5;
const MAX_HOME_BANNERS = 1;

const ALLOWED_BANNER_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

// For the "paste a URL instead" path, since we can't read a remote
// file's real MIME type without fetching it — checking the extension
// is the practical client-side guard.
const isValidBannerImageUrl = (url) => /\.(png|jpe?g|webp)(\?.*)?$/i.test((url || '').trim());

export default function AdminDashboard({ onNavigateHome }) {
  const { schoolInfo: globalSchoolInfo, refreshSchoolInfo } = useSchoolInfo();

  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const SHOW_DEV_TOOLS = false; // flip to true locally if you need Database & SQL diagnostics

  // Active section tab
  const [activeTab, setActiveTab] = useState('school_info');

  // ==========================================
  // 1. SCHOOL INFO STATE
  // ==========================================
  const [schoolInfoForm, setSchoolInfoForm] = useState(DEFAULT_SCHOOL_INFO);
  const [schoolInfoLoading, setSchoolInfoLoading] = useState(false);
  const [schoolInfoError, setSchoolInfoError] = useState(null);
  const [schoolInfoSuccess, setSchoolInfoSuccess] = useState(null);
  const [schoolInfoRecordId, setSchoolInfoRecordId] = useState(null);

  // ==========================================
  // 2. CAREERS & APPLICATIONS STATE
  // ==========================================
  const [careersList, setCareersList] = useState([]);
  const [applicationsList, setApplicationsList] = useState([]);
  const [careersLoading, setCareersLoading] = useState(false);
  const [careersError, setCareersError] = useState(null);
  const [careersSuccess, setCareersSuccess] = useState(null);
  const [careersSubTab, setCareersSubTab] = useState('jobs'); // 'jobs' | 'applications'

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: '',
    department: 'Higher Secondary Department',
    job_type: 'Full-Time',
    experience: '2+ Years',
    location: 'Trichy, TN',
    description: '',
    requirements: '',
    display_order: 1,
    is_active: true
  });

  // ==========================================
  // 3. ACADEMIC RESULTS & TOPPERS STATE
  // ==========================================
  const [resultStats, setResultStats] = useState([]);
  const [toppers, setToppers] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState(null);
  const [resultsSuccess, setResultsSuccess] = useState(null);

  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState(null);
  const [statForm, setStatForm] = useState({
    stat_number: '',
    label: '',
    subtitle: '',
    display_order: 1
  });

  const [isTopperModalOpen, setIsTopperModalOpen] = useState(false);
  const [editingTopper, setEditingTopper] = useState(null);
  const [topperForm, setTopperForm] = useState({
    rank: 'Rank 1',
    percentage: '98.0%',
    name: '',
    photo_url: '',
    total_score: '588 / 600',
    stream: 'Biology & Physics Stream',
    badge_color: 'gold',
    centums: 'Mathematics: 100/100\nBiology: 100/100\nChemistry: 100/100',
    display_order: 1,
    is_active: true
  });

  // ==========================================
  // 4. MEDIA POSTS STATE (BLOG, NEWS, AWARDS)
  // ==========================================
  const [mediaPosts, setMediaPosts] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState(null);
  const [mediaSuccess, setMediaSuccess] = useState(null);
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all');

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [editingMediaItem, setEditingMediaItem] = useState(null);
  const [mediaForm, setMediaForm] = useState({
    type: 'blog',
    category: 'academics',
    school: 'all',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    title: '',
    description: '',
    story: '',
    image_url: '',
    display_order: 1,
    is_active: true
  });

  // ==========================================
  // 5. EVENTS & CELEBRATIONS STATE
  // ==========================================
  const [eventsList, setEventsList] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState(null);
  const [eventsSuccess, setEventsSuccess] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    desc: '',
    image_url: '',
    display_order: 1,
    is_active: true
  });

  // ==========================================
  // 6. CAMPUS GALLERY PHOTOS STATE
  // ==========================================
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState(null);
  const [gallerySuccess, setGallerySuccess] = useState(null);
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('All');

  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState(null);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    category: 'Campus',
    display_order: 1,
    is_active: true
  });

  // ==========================================
  // 6. CAROUSEL SLIDES STATE
  // ==========================================
  const [slides, setSlides] = useState([]);
  const [slidesLoading, setSlidesLoading] = useState(false);
  const [slidesError, setSlidesError] = useState(null);
  const [slidesSuccess, setSlidesSuccess] = useState(null);

  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [slideForm, setSlideForm] = useState({
    tag: "Welcome to Carmel's School",
    title: '',
    subtitle: '',
    image_url: '',
    button_text: 'Contact Us',
    button_link: 'contact',
    is_active: true,
    display_order: 1
  });

  // ==========================================
  // 7. HOME POPUP BANNER STATE
  // (Controls the popup shown when the website first opens.
  //  Each entry is either a custom "poster" image or a trigger
  //  that shows the existing Academic Toppers announcement.)
  // ==========================================
  const [banners, setBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(false);
  const [bannersError, setBannersError] = useState(null);
  const [bannersSuccess, setBannersSuccess] = useState(null);

    // ==========================================
  // YOUTUBE VIDEO SECTION STATE
  // ==========================================
  const [youtubeSection, setYoutubeSection] = useState(null);
  const [youtubeForm, setYoutubeForm] = useState({
    title: 'Watch Our School',
    subtitle: 'Discover life at Carmel through our videos.',
    youtube_url: '',
    is_active: true
  });
  const [youtubeLoading, setYoutubeLoading] = useState(false);
  const [youtubeSuccess, setYoutubeSuccess] = useState(null);
  const [youtubeError, setYoutubeError] = useState(null);

  const [testimonialAlumni, setTestimonialAlumni] = useState(null);
  const [testimonialParent, setTestimonialParent] = useState(null);
  const [testimonialAlumniForm, setTestimonialAlumniForm] = useState({ title: 'Alumni Testimonial', subtitle: 'Hear from our graduates', youtube_url: '', is_active: true });
  const [testimonialParentForm, setTestimonialParentForm] = useState({ title: 'Parent Testimonial', subtitle: 'Hear from our parents', youtube_url: '', is_active: true });
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [testimonialsSuccess, setTestimonialsSuccess] = useState(null);
  const [testimonialsError, setTestimonialsError] = useState(null); 

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    banner_type: 'poster', // 'poster' | 'toppers'
    title: '',
    subtitle: '',
    image_url: '',
    link_url: '',
    is_active: true,
    display_order: 1
  });

  // ==========================================
  // 8. UNIVERSAL CROPPER STATE
  // ==========================================
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperMode, setCropperMode] = useState('media');
  const [rawImageSrc, setRawImageSrc] = useState(null);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const cropCanvasRef = useRef(null);
  const imageObjRef = useRef(null);

  // ==========================================
  // ENQUIRY MODAL
  // ==========================================

  const [enquiries, setEnquiries] = useState([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [enquiriesError, setEnquiriesError] = useState(null);

  // ==========================================
  // ADMISSION APPLICATIONS — separate from enquiries
  // ==========================================
  const [icseAdmissions, setIcseAdmissions] = useState([]);
  const [matricAdmissions, setMatricAdmissions] = useState([]);
  const [admissionsLoading, setAdmissionsLoading] = useState(false);
  const [admissionsError, setAdmissionsError] = useState(null);
  const [admissionSchoolFilter, setAdmissionSchoolFilter] = useState('all');
  const [admissionStatusFilter, setAdmissionStatusFilter] = useState('all');
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [selectedAdmissionSchool, setSelectedAdmissionSchool] = useState(null);
  const [admissionPhotoUrls, setAdmissionPhotoUrls] = useState({});
  const [admissionPhotoLoading, setAdmissionPhotoLoading] = useState(false);
  const [admissionActionLoading, setAdmissionActionLoading] = useState(false);

  // ==========================================
  // 9. FACULTY STATE
// ==========================================
const [facultyList, setFacultyList] = useState([]);
const [facultyLoading, setFacultyLoading] = useState(false);
const [facultyError, setFacultyError] = useState(null);
const [facultySuccess, setFacultySuccess] = useState(null);

const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
const [editingFaculty, setEditingFaculty] = useState(null);
const [facultyForm, setFacultyForm] = useState({
  s_no: '',
  name: '',
  qualification: '',
  photo_url: '',
  display_order: 1,
  is_active: true
});

const DEFAULT_FACULTY_AVATAR = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#f1f5f9"/><circle cx="50" cy="38" r="18" fill="#cbd5e1"/><path d="M20 90c0-18 13-30 30-30s30 12 30 30" fill="#cbd5e1"/></svg>`
)}`;



  // Supabase Auth Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch School Info
  const fetchSchoolInfoData = async () => {
    setSchoolInfoLoading(true);
    setSchoolInfoError(null);
    try {
      const { data, error } = await supabase
        .from('school_info')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error && (error.code === '42P01' || error.message.includes('does not exist'))) {
        setSchoolInfoError('Table "school_info" not created yet. Please execute the SQL in Supabase (see database.md).');
      } else if (data) {
        setSchoolInfoRecordId(data.id);
        setSchoolInfoForm({
          ...DEFAULT_SCHOOL_INFO,
          ...data
        });
      } else {
        setSchoolInfoForm(DEFAULT_SCHOOL_INFO);
      }
    } catch (err) {
      setSchoolInfoError(err.message);
    } finally {
      setSchoolInfoLoading(false);
    }
  };

  // Fetch Careers and Applications
  const fetchCareersData = async () => {
    setCareersLoading(true);
    setCareersError(null);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        supabase.from('career_jobs').select('*').order('display_order', { ascending: true }),
        supabase.from('career_applications').select('*').order('created_at', { ascending: false })
      ]);

      if (jobsRes.error && (jobsRes.error.code === '42P01' || jobsRes.error.message.includes('does not exist'))) {
        setCareersError('Table "career_jobs" not created yet. Please execute the SQL in Supabase (see database.md).');
      } else {
        if (jobsRes.data) setCareersList(jobsRes.data);
      }

      if (appsRes.data) {
        setApplicationsList(appsRes.data);
      }
    } catch (err) {
      setCareersError(err.message);
    } finally {
      setCareersLoading(false);
    }
  };

  // Fetch Results Data
  const fetchResultsData = async () => {
    setResultsLoading(true);
    setResultsError(null);
    try {
      const [statsRes, toppersRes] = await Promise.all([
        supabase.from('result_stats').select('*').order('display_order', { ascending: true }),
        supabase.from('academic_toppers').select('*').order('display_order', { ascending: true })
      ]);

      if (statsRes.error && (statsRes.error.code === '42P01' || statsRes.error.message.includes('does not exist'))) {
        setResultsError('Tables "result_stats" or "academic_toppers" not created yet. Please execute the SQL in Supabase (see database.md).');
      } else {
        if (statsRes.data) setResultStats(statsRes.data);
        if (toppersRes.data) setToppers(toppersRes.data);
      }
    } catch (err) {
      setResultsError(err.message);
    } finally {
      setResultsLoading(false);
    }
  };

  // Fetch Media Posts
  const fetchMediaPosts = async () => {
    setMediaLoading(true);
    setMediaError(null);
    try {
      const { data, error } = await supabase
        .from('media_posts')
        .select('*')
        .order('display_order', { ascending: true });

      if (error && (error.code === '42P01' || error.message.includes('does not exist'))) {
        setMediaError('Table "media_posts" not created yet. Please execute the SQL in Supabase (see database.md).');
      } else {
        setMediaPosts(data || []);
      }
    } catch (err) {
      setMediaError(err.message);
    } finally {
      setMediaLoading(false);
    }
  };
    // Enquires 
    const fetchEnquiries = async () => {
    setEnquiriesLoading(true);
    setEnquiriesError(null);
    try {
      const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setEnquiries(data || []);
    } catch (err) {
      setEnquiriesError(err.message);
    } finally {
      setEnquiriesLoading(false);
    }
  };


  const handleDeleteEnquiry = async (id, name) => {
  if (!window.confirm(`Delete enquiry from "${name}"? This cannot be undone.`)) return;
  try {
    const { error } = await supabase.from('enquiries').delete().eq('id', id);
    if (error) throw error;
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
  } catch (err) {
    alert('Error deleting enquiry: ' + err.message);
  }
  };

  // ==========================================
  // ADMISSION APPLICATIONS
  // These are intentionally independent of `enquiries`.
  // ==========================================
  const fetchAdmissionApplications = async () => {
    setAdmissionsLoading(true);
    setAdmissionsError(null);

    try {
      const [icseRes, matricRes] = await Promise.all([
        supabase
          .from('icse_admission_applications')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('matric_admission_applications')
          .select('*')
          .order('created_at', { ascending: false })
      ]);

      const missing = [];
      if (icseRes.error && (icseRes.error.code === '42P01' || /does not exist/i.test(icseRes.error.message || ''))) {
        missing.push('icse_admission_applications');
      }
      if (matricRes.error && (matricRes.error.code === '42P01' || /does not exist/i.test(matricRes.error.message || ''))) {
        missing.push('matric_admission_applications');
      }

      if (missing.length) {
        setAdmissionsError(
          `Admission table${missing.length > 1 ? 's' : ''} not found: ${missing.join(', ')}. Run the admission database migration first.`
        );
      }

      if (!icseRes.error || icseRes.error.code !== '42P01') {
        setIcseAdmissions(icseRes.data || []);
      }
      if (!matricRes.error || matricRes.error.code !== '42P01') {
        setMatricAdmissions(matricRes.data || []);
      }
    } catch (err) {
      setAdmissionsError(err.message || 'Unable to load admission applications.');
    } finally {
      setAdmissionsLoading(false);
    }
  };

  const getAdmissionStudentName = (app, school) => {
    if (school === 'icse') return app.student_name || 'Unnamed student';
    return [app.first_name, app.middle_name, app.last_name].filter(Boolean).join(' ') || 'Unnamed student';
  };

  const getAdmissionPhotoFields = (app, school) => {
    if (school === 'icse') {
      return [{ key: 'student_photo_path', label: 'Student Photograph' }];
    }
    return [
      { key: 'student_photo_url', label: 'Student Photograph' },
      { key: 'father_photo_url', label: 'Father Photograph' },
      { key: 'mother_photo_url', label: 'Mother Photograph' }
    ];
  };

  const getStorageObjectPath = (value) => {
    if (!value || typeof value !== 'string') return null;

    // New secure records store a path, never a public URL.
    if (value.startsWith('admissions/')) return value;

    // Also support a Supabase storage URL for records created during
    // the earlier development phase, but only when it points to the
    // dedicated admission bucket.
    const marker = '/storage/v1/object/';
    const index = value.indexOf(marker);
    if (index === -1) return null;

    const remainder = value.slice(index + marker.length);
    const publicMarker = 'public/carmel_admission_photos/';
    const signedMarker = 'sign/carmel_admission_photos/';
    if (remainder.startsWith(publicMarker)) return remainder.slice(publicMarker.length);
    if (remainder.startsWith(signedMarker)) return null;

    return null;
  };

  const resolveAdmissionPhoto = async (value) => {
    if (!value) return null;

    const path = getStorageObjectPath(value);
    if (path) {
      const { data, error } = await supabase.storage
        .from('carmel_admission_photos')
        .createSignedUrl(path, 60 * 10);
      if (!error && data?.signedUrl) return data.signedUrl;
    }

    // Backward-compatible display only. New records should use paths.
    if (/^https?:\/\//i.test(value)) return value;
    return null;
  };

  const openAdmission = async (app, school) => {
    setSelectedAdmission(app);
    setSelectedAdmissionSchool(school);
    setAdmissionPhotoUrls({});
    setAdmissionPhotoLoading(true);

    try {
      const photoFields = getAdmissionPhotoFields(app, school);
      const entries = await Promise.all(
        photoFields.map(async ({ key }) => [key, await resolveAdmissionPhoto(app[key])])
      );
      setAdmissionPhotoUrls(Object.fromEntries(entries));
    } finally {
      setAdmissionPhotoLoading(false);
    }
  };

  const updateAdmissionStatus = async (app, school, status) => {
    setAdmissionActionLoading(true);
    try {
      const table = school === 'icse'
        ? 'icse_admission_applications'
        : 'matric_admission_applications';

      const { data, error } = await supabase
        .from(table)
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', app.id)
        .select()
        .single();

      if (error) throw error;

      setSelectedAdmission(data);
      if (school === 'icse') {
        setIcseAdmissions((prev) => prev.map((x) => x.id === app.id ? data : x));
      } else {
        setMatricAdmissions((prev) => prev.map((x) => x.id === app.id ? data : x));
      }
    } catch (err) {
      alert('Unable to update application status: ' + err.message);
    } finally {
      setAdmissionActionLoading(false);
    }
  };

  // Admission photographs are read-only in the Admin UI.
// Admins can view them, but cannot replace or delete an individual photo.
// Deleting the complete application remains available below.
const deleteAdmissionApplication = async (app, school) => {
    const studentName = getAdmissionStudentName(app, school);
    if (!window.confirm(
      `Delete the complete ${school === 'icse' ? 'ICSE / ISC' : 'Matriculation'} application for "${studentName}"?\n\nThis will permanently remove the database record and any admission photos stored in the private admission bucket.`
    )) return;

    setAdmissionActionLoading(true);

    try {
      const table = school === 'icse'
        ? 'icse_admission_applications'
        : 'matric_admission_applications';

      const photoPaths = getAdmissionPhotoFields(app, school)
        .map(({ key }) => getStorageObjectPath(app[key]))
        .filter(Boolean);

      if (photoPaths.length) {
        const { error: storageError } = await supabase.storage
          .from('carmel_admission_photos')
          .remove(photoPaths);
        if (storageError) throw storageError;
      }

      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', app.id);

      if (error) throw error;

      if (school === 'icse') {
        setIcseAdmissions((prev) => prev.filter((x) => x.id !== app.id));
      } else {
        setMatricAdmissions((prev) => prev.filter((x) => x.id !== app.id));
      }

      setSelectedAdmission(null);
      setSelectedAdmissionSchool(null);
      setAdmissionPhotoUrls({});
    } catch (err) {
      alert('Unable to delete application: ' + err.message);
    } finally {
      setAdmissionActionLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchAdmissionApplications();
  }, [session]);

  // Fetch Events & Celebrations
  const fetchEvents = async () => {
    setEventsLoading(true);
    setEventsError(null);
    try {
      const { data, error } = await supabase
        .from('school_events')
        .select('*')
        .order('display_order', { ascending: true });

      if (error && (error.code === '42P01' || error.message.includes('does not exist'))) {
        setEventsError('Table "school_events" not created yet. Please execute the Events & Celebrations SQL migration in Supabase.');
      } else if (error) {
        throw error;
      } else {
        setEventsList(data || []);
      }
    } catch (err) {
      setEventsError(err.message || 'Unable to load events.');
    } finally {
      setEventsLoading(false);
    }
  };

  // Fetch Campus Gallery Photos
  const fetchGalleryPhotos = async () => {
    setGalleryLoading(true);
    setGalleryError(null);
    try {
      const { data, error } = await supabase
        .from('campus_gallery')
        .select('*')
        .order('display_order', { ascending: true });

      if (error && (error.code === '42P01' || error.message.includes('does not exist'))) {
        setGalleryError('Table "campus_gallery" not created yet. Please execute the SQL in Supabase (see database.md).');
      } else {
        setGalleryPhotos(data || []);
      }
    } catch (err) {
      setGalleryError(err.message);
    } finally {
      setGalleryLoading(false);
    }
  };

  // Fetch Carousel Slides
  const fetchSlides = async () => {
    setSlidesLoading(true);
    setSlidesError(null);
    try {
      const { data, error } = await supabase
        .from('carousel_slides')
        .select('*')
        .order('display_order', { ascending: true });

      if (error && (error.code === '42P01' || error.message.includes('does not exist'))) {
        setSlidesError('Table "carousel_slides" not created yet. Please execute the SQL in Supabase (see database.md).');
      } else {
        setSlides(data || []);
      }
    } catch (err) {
      setSlidesError(err.message);
    } finally {
      setSlidesLoading(false);
    }
  };

  const fetchBanners = async () => {
    setBannersLoading(true);
    setBannersError(null);
    try {
      const { data, error } = await supabase
        .from('home_banners')
        .select('*')
        .order('display_order', { ascending: true });

      if (error && (error.code === '42P01' || error.message.includes('does not exist'))) {
        setBannersError('Table "home_banners" not created yet. Please execute the SQL in Supabase (see database.md).');
      } else {
        setBanners(data || []);
      }
    } catch (err) {
      setBannersError(err.message);
    } finally {
      setBannersLoading(false);
    }
  }

  const fetchFaculty = async () => {
  setFacultyLoading(true);
  setFacultyError(null);
  try {
    const { data, error } = await supabase
      .from('faculty')
      .select('*')
      .order('display_order', { ascending: true });

    if (error && (error.code === '42P01' || error.message.includes('does not exist'))) {
      setFacultyError('Table "faculty" not created yet. Please execute the SQL in Supabase (see database.md).');
    } else {
      setFacultyList(data || []);
    }
  } catch (err) {
    setFacultyError(err.message);
  } finally {
    setFacultyLoading(false);
  }
};

  const fetchYouTubeSection = async () => {
    setYoutubeLoading(true);
    setYoutubeError(null);
    try {
      const { data, error } = await supabase
        .from('youtube_section')
        .select('id, title, subtitle, youtube_url, is_active, updated_at')
        .limit(1)
        .maybeSingle();

      if (error && (error.code === '42P01' || error.message.includes('does not exist'))) {
        setYoutubeError('Table "youtube_section" not created yet. Please execute the SQL in Supabase.');
      } else if (data) {
        setYoutubeSection(data);
        setYoutubeForm({
          title: data.title || 'Watch Our School',
          subtitle: data.subtitle || 'Discover life at Carmel through our videos.',
          youtube_url: data.youtube_url || '',
          is_active: data.is_active !== false
        });
      }
    } catch (err) {
      setYoutubeError('Unable to load YouTube settings: ' + err.message);
    } finally {
      setYoutubeLoading(false);
    }
  };

    const fetchTestimonials = async () => {
    setTestimonialsLoading(true);
    setTestimonialsError(null);
    try {
      const { data, error } = await supabase.from('testimonial_videos').select('*');
      if (error && (error.code === '42P01' || error.message.includes('does not exist'))) {
        setTestimonialsError('Table "testimonial_videos" not created yet. Run the SQL in database.md.');
      } else if (data) {
        const alumni = data.find(d => d.type === 'alumni') || null;
        const parent = data.find(d => d.type === 'parent') || null;
        setTestimonialAlumni(alumni);
        setTestimonialParent(parent);
        if (alumni) setTestimonialAlumniForm({ title: alumni.title || '', subtitle: alumni.subtitle || '', youtube_url: alumni.youtube_url || '', is_active: alumni.is_active !== false });
        if (parent) setTestimonialParentForm({ title: parent.title || '', subtitle: parent.subtitle || '', youtube_url: parent.youtube_url || '', is_active: parent.is_active !== false });
      }
    } catch (err) {
      setTestimonialsError(err.message);
    } finally {
      setTestimonialsLoading(false);
    }
  };

    const extractPreviewId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^?&\s]+)/
    );
    return match ? match[1] : null;
  };

  useEffect(() => {
    if (session) {
      fetchSchoolInfoData();
      fetchCareersData();
      fetchResultsData();
      fetchMediaPosts();
      fetchEvents();
      fetchGalleryPhotos();
      fetchSlides();
      fetchBanners();
      fetchFaculty();
      fetchYouTubeSection();
      fetchEnquiries();
      fetchTestimonials();
    }
  }, [session]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginSubmitting(true);
    setLoginError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });
      if (error) throw error;
      setSession(data.session);
    } catch (err) {
      setLoginError(err.message || 'Invalid credentials. Please verify your admin email and password.');
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // ==========================================
  // SAVE SCHOOL INFO
  // ==========================================
  const handleSaveSchoolInfo = async (e) => {
    e.preventDefault();
    setSchoolInfoLoading(true);
    setSchoolInfoError(null);

    try {
      const payload = {
        school_name: schoolInfoForm.school_name,
        tagline: schoolInfoForm.tagline,
        about_summary: schoolInfoForm.about_summary,
        admission_year: schoolInfoForm.admission_year,
        phone_primary: schoolInfoForm.phone_primary,
        phone_secondary: schoolInfoForm.phone_secondary,
        whatsapp_number: schoolInfoForm.whatsapp_number,
        email_matric: schoolInfoForm.email_matric,
        email_icse: schoolInfoForm.email_icse,
        email_general: schoolInfoForm.email_general,
        address_line: schoolInfoForm.address_line,
        city: schoolInfoForm.city,
        pincode: schoolInfoForm.pincode,
        google_maps_link: schoolInfoForm.google_maps_link,
        map_embed_url: schoolInfoForm.map_embed_url,
        office_hours: schoolInfoForm.office_hours,
        facebook_url: schoolInfoForm.facebook_url,
        instagram_url: schoolInfoForm.instagram_url,
        youtube_url: schoolInfoForm.youtube_url,
        updated_at: new Date().toISOString()
      };

      if (schoolInfoRecordId) {
        const { error } = await supabase
          .from('school_info')
          .update(payload)
          .eq('id', schoolInfoRecordId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('school_info')
          .insert([payload])
          .select();
        if (error) throw error;
        if (data && data[0]) setSchoolInfoRecordId(data[0].id);
      }

      setSchoolInfoSuccess('School info & contact settings updated live across the entire website!');
      if (refreshSchoolInfo) refreshSchoolInfo();
    } catch (err) {
      setSchoolInfoError('Error saving school settings: ' + err.message);
    } finally {
      setSchoolInfoLoading(false);
    }
  };

  // ==========================================
  // CAREER ACTIONS
  // ==========================================
  const handleOpenAddJobModal = () => {
    setEditingJob(null);
    setJobForm({
      title: '',
      department: 'Higher Secondary Department',
      job_type: 'Full-Time',
      experience: '2+ Years',
      location: 'Trichy, TN',
      description: '',
      requirements: '',
      display_order: careersList.length + 1,
      is_active: true
    });
    setIsJobModalOpen(true);
  };

  const handleOpenEditJobModal = (job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title || '',
      department: job.department || 'Higher Secondary Department',
      job_type: job.job_type || 'Full-Time',
      experience: job.experience || '2+ Years',
      location: job.location || 'Trichy, TN',
      description: job.description || '',
      requirements: job.requirements || '',
      display_order: job.display_order || 1,
      is_active: job.is_active !== false
    });
    setIsJobModalOpen(true);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    if (!jobForm.title.trim()) return alert('Please enter job title');
    if (!jobForm.description.trim()) return alert('Please enter job description');

    setFormSubmitting(true);
    try {
      if (editingJob) {
        const { error } = await supabase
          .from('career_jobs')
          .update({
            title: jobForm.title,
            department: jobForm.department,
            job_type: jobForm.job_type,
            experience: jobForm.experience,
            location: jobForm.location,
            description: jobForm.description,
            requirements: jobForm.requirements,
            display_order: Number(jobForm.display_order) || 1,
            is_active: jobForm.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingJob.id);

        if (error) throw error;
        setCareersSuccess('Job opening updated successfully!');
      } else {
        const { error } = await supabase
          .from('career_jobs')
          .insert([{
            title: jobForm.title,
            department: jobForm.department,
            job_type: jobForm.job_type,
            experience: jobForm.experience,
            location: jobForm.location,
            description: jobForm.description,
            requirements: jobForm.requirements,
            display_order: Number(jobForm.display_order) || careersList.length + 1,
            is_active: jobForm.is_active
          }]);

        if (error) throw error;
        setCareersSuccess('New job opening published successfully!');
      }

      setIsJobModalOpen(false);
      await fetchCareersData();
    } catch (err) {
      alert('Error saving job: ' + err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteJob = async (id, title) => {
    if (!window.confirm(`Delete job opening: "${title}"?`)) return;
    try {
      const { error } = await supabase.from('career_jobs').delete().eq('id', id);
      if (error) throw error;
      setCareersSuccess('Job vacancy deleted.');
      await fetchCareersData();
    } catch (err) {
      alert('Error deleting job: ' + err.message);
    }
  };

  const handleToggleJobActive = async (job) => {
    try {
      const newStatus = !job.is_active;
      const { error } = await supabase
        .from('career_jobs')
        .update({ is_active: newStatus, updated_at: new Date().toISOString() })
        .eq('id', job.id);
      if (error) throw error;
      setCareersList((prev) => prev.map((j) => j.id === job.id ? { ...j, is_active: newStatus } : j));
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // ==========================================
  // RESULTS ACTIONS
  // ==========================================
  const handleOpenEditStatModal = (st) => {
    setEditingStat(st);
    setStatForm({
      stat_number: st.stat_number || '',
      label: st.label || '',
      subtitle: st.subtitle || '',
      display_order: st.display_order || 1
    });
    setIsStatModalOpen(true);
  };

  const handleSaveStat = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const { error } = await supabase
        .from('result_stats')
        .update({
          stat_number: statForm.stat_number,
          label: statForm.label,
          subtitle: statForm.subtitle,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingStat.id);

      if (error) throw error;
      setResultsSuccess('Stat metric updated successfully!');
      setIsStatModalOpen(false);
      await fetchResultsData();
    } catch (err) {
      alert('Error updating stat: ' + err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleOpenAddTopperModal = () => {
    if (toppers.length >= MAX_TOPPER_CARDS) {
      alert(`Maximum limit of ${MAX_TOPPER_CARDS} topper cards reached.`);
      return;
    }
    setEditingTopper(null);
    setTopperForm({
      rank: `Rank ${toppers.length + 1}`,
      percentage: '98.0%',
      name: '',
      photo_url: '',
      total_score: '588 / 600',
      stream: 'Biology & Physics Stream',
      badge_color: toppers.length === 0 ? 'gold' : toppers.length === 1 ? 'silver' : 'bronze',
      centums: 'Mathematics: 100/100\nBiology: 100/100',
      display_order: toppers.length + 1,
      is_active: true
    });
    setIsTopperModalOpen(true);
  };

  const handleOpenEditTopperModal = (ach) => {
    setEditingTopper(ach);
    setTopperForm({
      rank: ach.rank || 'Rank 1',
      percentage: ach.percentage || '',
      name: ach.name || '',
      photo_url: ach.photo_url || '',
      total_score: ach.total_score || '',
      stream: ach.stream || '',
      badge_color: ach.badge_color || 'gold',
      centums: ach.centums || '',
      display_order: ach.display_order || 1,
      is_active: ach.is_active !== false
    });
    setIsTopperModalOpen(true);
  };

  const handleSaveTopper = async (e) => {
    e.preventDefault();
    if (!topperForm.name.trim()) return alert('Please enter student name / topper title');

    setFormSubmitting(true);
    try {
      if (editingTopper) {
        const { error } = await supabase
          .from('academic_toppers')
          .update({
            rank: topperForm.rank,
            percentage: topperForm.percentage,
            name: topperForm.name,
            photo_url: topperForm.photo_url,
            total_score: topperForm.total_score,
            stream: topperForm.stream,
            badge_color: topperForm.badge_color,
            centums: topperForm.centums,
            display_order: Number(topperForm.display_order) || 1,
            is_active: topperForm.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingTopper.id);

        if (error) throw error;
        setResultsSuccess('Topper card updated successfully!');
      } else {
        const { error } = await supabase
          .from('academic_toppers')
          .insert([{
            rank: topperForm.rank,
            percentage: topperForm.percentage,
            name: topperForm.name,
            photo_url: topperForm.photo_url,
            total_score: topperForm.total_score,
            stream: topperForm.stream,
            badge_color: topperForm.badge_color,
            centums: topperForm.centums,
            display_order: Number(topperForm.display_order) || toppers.length + 1,
            is_active: topperForm.is_active
          }]);

        if (error) throw error;
        setResultsSuccess('New topper card published successfully!');
      }

      setIsTopperModalOpen(false);
      await fetchResultsData();
    } catch (err) {
      alert('Error saving topper: ' + err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteTopper = async (id, name) => {
    if (!window.confirm(`Delete topper card: "${name}"?`)) return;
    try {
      const { error } = await supabase.from('academic_toppers').delete().eq('id', id);
      if (error) throw error;
      setResultsSuccess('Topper card deleted.');
      await fetchResultsData();
    } catch (err) {
      alert('Error deleting: ' + err.message);
    }
  };

  const handleToggleTopperActive = async (ach) => {
    try {
      const newStatus = !ach.is_active;
      const { error } = await supabase
        .from('academic_toppers')
        .update({ is_active: newStatus, updated_at: new Date().toISOString() })
        .eq('id', ach.id);
      if (error) throw error;
      setToppers((prev) => prev.map((t) => t.id === ach.id ? { ...t, is_active: newStatus } : t));
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // ==========================================
  // MEDIA ACTIONS
  // ==========================================
  const handleOpenAddMediaModal = () => {
    setEditingMediaItem(null);
    setMediaForm({
      type: mediaTypeFilter !== 'all' ? mediaTypeFilter : 'blog',
      category: 'academics',
      school: 'all',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      title: '',
      description: '',
      story: '',
      image_url: '',
      display_order: mediaPosts.length + 1,
      is_active: true
    });
    setIsMediaModalOpen(true);
  };

  const handleOpenEditMediaModal = (post) => {
    setEditingMediaItem(post);
    setMediaForm({
      type: post.type || 'blog',
      category: post.category || 'academics',
      school: post.school || 'all',
      date: post.date || '',
      title: post.title || '',
      description: post.description || '',
      story: post.story || '',
      image_url: post.image_url || '',
      display_order: post.display_order || 1,
      is_active: post.is_active !== false
    });
    setIsMediaModalOpen(true);
  };

  const handleSaveMediaPost = async (e) => {
    e.preventDefault();
    if (!mediaForm.title.trim()) return alert('Please enter post title');
    if (!mediaForm.description.trim()) return alert('Please enter short description');

    setFormSubmitting(true);
    try {
      if (editingMediaItem) {
        const { error } = await supabase
          .from('media_posts')
          .update({
            type: mediaForm.type,
            category: mediaForm.category,
            school: mediaForm.school,
            date: mediaForm.date,
            title: mediaForm.title,
            description: mediaForm.description,
            story: mediaForm.story,
            image_url: mediaForm.image_url,
            display_order: Number(mediaForm.display_order) || 1,
            is_active: mediaForm.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingMediaItem.id);

        if (error) throw error;
        setMediaSuccess('Post updated successfully!');
      } else {
        const { error } = await supabase
          .from('media_posts')
          .insert([{
            type: mediaForm.type,
            category: mediaForm.category,
            school: mediaForm.school,
            date: mediaForm.date,
            title: mediaForm.title,
            description: mediaForm.description,
            story: mediaForm.story,
            image_url: mediaForm.image_url,
            display_order: Number(mediaForm.display_order) || mediaPosts.length + 1,
            is_active: mediaForm.is_active
          }]);

        if (error) throw error;
        setMediaSuccess('New post published successfully!');
      }

      setIsMediaModalOpen(false);
      await fetchMediaPosts();
    } catch (err) {
      alert('Error saving post: ' + err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteMediaPost = async (id, title) => {
    if (!window.confirm(`Delete post: "${title}"?`)) return;
    try {
      const { error } = await supabase.from('media_posts').delete().eq('id', id);
      if (error) throw error;
      setMediaSuccess('Post deleted.');
      await fetchMediaPosts();
    } catch (err) {
      alert('Error deleting post: ' + err.message);
    }
  };

  const handleToggleMediaActive = async (post) => {
    try {
      const newStatus = !post.is_active;
      const { error } = await supabase
        .from('media_posts')
        .update({ is_active: newStatus, updated_at: new Date().toISOString() })
        .eq('id', post.id);
      if (error) throw error;
      setMediaPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, is_active: newStatus } : p));
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

// TESTIMONIALS
  const handleSaveTestimonial = async (type) => {
  const form = type === 'alumni' ? testimonialAlumniForm : testimonialParentForm;
  const existing = type === 'alumni' ? testimonialAlumni : testimonialParent;
  setFormSubmitting(true);
  setTestimonialsError(null);
  try {
    const payload = { type, title: form.title, subtitle: form.subtitle, youtube_url: form.youtube_url || null, is_active: form.is_active, updated_at: new Date().toISOString() };
    if (existing) {
      const { error } = await supabase.from('testimonial_videos').update(payload).eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('testimonial_videos').insert([payload]);
      if (error) throw error;
    }
    setTestimonialsSuccess(`${type === 'alumni' ? 'Alumni' : 'Parent'} testimonial updated!`);
    await fetchTestimonials();
  } catch (err) {
    setTestimonialsError('Error saving: ' + err.message);
  } finally {
    setFormSubmitting(false);
  }
};

  // ==========================================
  // GALLERY ACTIONS
  // ==========================================
  const handleOpenAddGalleryModal = () => {
    setEditingGalleryItem(null);
    setGalleryForm({
      title: '',
      subtitle: '',
      image_url: '',
      category: 'Campus',
      display_order: galleryPhotos.length + 1,
      is_active: true
    });
    setIsGalleryModalOpen(true);
  };

  const handleOpenEditGalleryModal = (item) => {
    setEditingGalleryItem(item);
    setGalleryForm({
      title: item.title || '',
      subtitle: item.subtitle || '',
      image_url: item.image_url || '',
      category: item.category || 'Campus',
      display_order: item.display_order || 1,
      is_active: item.is_active !== false
    });
    setIsGalleryModalOpen(true);
  };

  const handleSaveGalleryPhoto = async (e) => {
    e.preventDefault();
    if (!galleryForm.title.trim()) return alert('Please enter photo title');

    setFormSubmitting(true);
    try {
      if (editingGalleryItem) {
        const { error } = await supabase
          .from('campus_gallery')
          .update({
            title: galleryForm.title,
            subtitle: galleryForm.subtitle,
            image_url: galleryForm.image_url,
            category: galleryForm.category,
            display_order: Number(galleryForm.display_order) || 1,
            is_active: galleryForm.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingGalleryItem.id);

        if (error) throw error;
        setGallerySuccess('Gallery photo updated successfully!');
      } else {
        const { error } = await supabase
          .from('campus_gallery')
          .insert([{
            title: galleryForm.title,
            subtitle: galleryForm.subtitle,
            image_url: galleryForm.image_url,
            category: galleryForm.category,
            display_order: Number(galleryForm.display_order) || galleryPhotos.length + 1,
            is_active: galleryForm.is_active
          }]);

        if (error) throw error;
        setGallerySuccess('New gallery photo added!');
      }

      setIsGalleryModalOpen(false);
      await fetchGalleryPhotos();
    } catch (err) {
      alert('Error saving photo: ' + err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteGalleryPhoto = async (id, title) => {
    if (!window.confirm(`Delete photo: "${title}"?`)) return;
    try {
      const { error } = await supabase.from('campus_gallery').delete().eq('id', id);
      if (error) throw error;
      setGallerySuccess('Photo deleted.');
      await fetchGalleryPhotos();
    } catch (err) {
      alert('Error deleting: ' + err.message);
    }
  };

  const handleToggleGalleryActive = async (item) => {
    try {
      const newStatus = !item.is_active;
      const { error } = await supabase
        .from('campus_gallery')
        .update({ is_active: newStatus, updated_at: new Date().toISOString() })
        .eq('id', item.id);
      if (error) throw error;
      setGalleryPhotos((prev) => prev.map((p) => p.id === item.id ? { ...p, is_active: newStatus } : p));
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // ==========================================
  // EVENTS & CELEBRATIONS ACTIONS
  // ==========================================
  const handleOpenAddEventModal = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      date: '',
      time: '',
      location: '',
      desc: '',
      image_url: '',
      display_order: eventsList.length + 1,
      is_active: true
    });
    setIsEventModalOpen(true);
  };

  const handleOpenEditEventModal = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title || '',
      date: event.date || '',
      time: event.time || '',
      location: event.location || '',
      desc: event.desc || '',
      image_url: event.image_url || '',
      display_order: event.display_order || 1,
      is_active: event.is_active !== false
    });
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.title.trim()) return alert('Please enter event title');
    if (!eventForm.date.trim()) return alert('Please enter event date');
    if (!eventForm.desc.trim()) return alert('Please enter event description');

    setFormSubmitting(true);
    try {
      const payload = {
        title: eventForm.title.trim(),
        date: eventForm.date.trim(),
        time: eventForm.time.trim(),
        location: eventForm.location.trim(),
        desc: eventForm.desc.trim(),
        image_url: eventForm.image_url.trim(),
        display_order: Number(eventForm.display_order) || 1,
        is_active: eventForm.is_active,
        updated_at: new Date().toISOString()
      };

      if (editingEvent) {
        const { error } = await supabase.from('school_events').update(payload).eq('id', editingEvent.id);
        if (error) throw error;
        setEventsSuccess('Event / celebration updated successfully!');
      } else {
        const { error } = await supabase.from('school_events').insert([payload]);
        if (error) throw error;
        setEventsSuccess('New event / celebration published successfully!');
      }

      setIsEventModalOpen(false);
      await fetchEvents();
    } catch (err) {
      alert('Error saving event: ' + err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Delete event: "${title}"?`)) return;
    try {
      const { error } = await supabase.from('school_events').delete().eq('id', id);
      if (error) throw error;
      setEventsSuccess('Event deleted.');
      await fetchEvents();
    } catch (err) {
      alert('Error deleting event: ' + err.message);
    }
  };

  const handleToggleEventActive = async (event) => {
    try {
      const newStatus = !event.is_active;
      const { error } = await supabase
        .from('school_events')
        .update({ is_active: newStatus, updated_at: new Date().toISOString() })
        .eq('id', event.id);
      if (error) throw error;
      setEventsList((prev) => prev.map((item) => item.id === event.id ? { ...item, is_active: newStatus } : item));
    } catch (err) {
      alert('Error updating event: ' + err.message);
    }
  };

  // ==========================================
  // CAROUSEL ACTIONS
  // ==========================================
  const handleOpenAddSlideModal = () => {
    if (slides.length >= MAX_CAROUSEL_SLIDES) {
      alert(`Maximum limit of ${MAX_CAROUSEL_SLIDES} carousel slides reached.`);
      return;
    }
    setEditingSlide(null);
    setSlideForm({
      tag: "Welcome to Carmel's School",
      title: '',
      subtitle: '',
      image_url: '',
      button_text: 'Contact Us',
      button_link: 'contact',
      is_active: true,
      display_order: slides.length + 1
    });
    setIsSlideModalOpen(true);
  };

  const handleOpenEditSlideModal = (slide) => {
    setEditingSlide(slide);
    setSlideForm({
      tag: slide.tag || "Welcome to Carmel's School",
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      image_url: slide.image_url || '',
      button_text: slide.button_text || 'Contact Us',
      button_link: slide.button_link || 'contact',
      is_active: slide.is_active !== false,
      display_order: slide.display_order || 1
    });
    setIsSlideModalOpen(true);
  };

  const handleSaveSlide = async (e) => {
    e.preventDefault();
    if (!slideForm.title.trim()) return alert('Please enter slide title');

    setFormSubmitting(true);
    try {
      if (editingSlide) {
        const { error } = await supabase
          .from('carousel_slides')
          .update({
            tag: slideForm.tag,
            title: slideForm.title,
            subtitle: slideForm.subtitle,
            image_url: slideForm.image_url,
            button_text: slideForm.button_text,
            button_link: slideForm.button_link,
            is_active: slideForm.is_active,
            display_order: Number(slideForm.display_order) || 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingSlide.id);
        if (error) throw error;
        setSlidesSuccess('Slide updated successfully!');
      } else {
        const { error } = await supabase
          .from('carousel_slides')
          .insert([{
            tag: slideForm.tag,
            title: slideForm.title,
            subtitle: slideForm.subtitle,
            image_url: slideForm.image_url,
            button_text: slideForm.button_text,
            button_link: slideForm.button_link,
            is_active: slideForm.is_active,
            display_order: Number(slideForm.display_order) || slides.length + 1
          }]);
        if (error) throw error;
        setSlidesSuccess('New slide created successfully!');
      }
      setIsSlideModalOpen(false);
      await fetchSlides();
    } catch (err) {
      alert('Error saving slide: ' + err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteSlide = async (id, title) => {
    if (!window.confirm(`Delete slide: "${title}"?`)) return;
    try {
      const { error } = await supabase.from('carousel_slides').delete().eq('id', id);
      if (error) throw error;
      setSlidesSuccess('Slide deleted.');
      await fetchSlides();
    } catch (err) {
      alert('Error deleting slide: ' + err.message);
    }
  };

  const handleToggleSlideActive = async (slide) => {
    try {
      const newStatus = !slide.is_active;
      const { error } = await supabase
        .from('carousel_slides')
        .update({ is_active: newStatus, updated_at: new Date().toISOString() })
        .eq('id', slide.id);
      if (error) throw error;
      setSlides((prev) => prev.map((s) => s.id === slide.id ? { ...s, is_active: newStatus } : s));
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  const handleOpenAddBannerModal = () => {
    if (banners.length >= MAX_HOME_BANNERS) {
      alert(`Maximum limit of ${MAX_HOME_BANNERS} home banners reached.`);
      return;
    }
    setEditingBanner(null);
    setBannerForm({
      banner_type: 'poster',
      title: '',
      subtitle: '',
      image_url: '',
      link_url: '',
      is_active: true,
      display_order: banners.length + 1
    });
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBannerModal = (banner) => {
    setEditingBanner(banner);
    setBannerForm({
      banner_type: banner.banner_type || 'poster',
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      image_url: banner.image_url || '',
      link_url: banner.link_url || '',
      is_active: banner.is_active !== false,
      display_order: banner.display_order || 1
    });
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    if (bannerForm.banner_type === 'poster' && !bannerForm.title.trim()) {
      return alert('Please enter a poster title');
    }
    if (bannerForm.banner_type === 'poster' && !bannerForm.image_url.trim()) {
      return alert('Please upload a poster image or paste an image URL');
    }

    setFormSubmitting(true);
    try {
      const payload = {
        banner_type: bannerForm.banner_type,
        title: bannerForm.title,
        subtitle: bannerForm.subtitle,
        image_url: bannerForm.image_url,
        link_url: bannerForm.link_url,
        is_active: bannerForm.is_active,
        display_order: Number(bannerForm.display_order) || 1,
        updated_at: new Date().toISOString()
      };

      if (editingBanner) {
        const { error } = await supabase
          .from('home_banners')
          .update(payload)
          .eq('id', editingBanner.id);
        if (error) throw error;
        setBannersSuccess('Banner updated successfully!');
      } else {
        const { error } = await supabase
          .from('home_banners')
          .insert([{ ...payload, display_order: Number(bannerForm.display_order) || banners.length + 1 }]);
        if (error) throw error;
        setBannersSuccess('New banner published successfully!');
      }
      setIsBannerModalOpen(false);
      await fetchBanners();
    } catch (err) {
      alert('Error saving banner: ' + err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteBanner = async (id, title) => {
    if (!window.confirm(`Delete banner: "${title || 'Toppers Announcement'}"?`)) return;
    try {
      const { error } = await supabase.from('home_banners').delete().eq('id', id);
      if (error) throw error;
      setBannersSuccess('Banner deleted.');
      await fetchBanners();
    } catch (err) {
      alert('Error deleting banner: ' + err.message);
    }
  };

  const handleToggleBannerActive = async (banner) => {
    try {
      const newStatus = !banner.is_active;
      const { error } = await supabase
        .from('home_banners')
        .update({ is_active: newStatus, updated_at: new Date().toISOString() })
        .eq('id', banner.id);
      if (error) throw error;
      setBanners((prev) => prev.map((b) => b.id === banner.id ? { ...b, is_active: newStatus } : b));
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };
  // ==========================================
// FACULTY ACTIONS
// ==========================================
const handleOpenAddFacultyModal = () => {
  setEditingFaculty(null);
  setFacultyForm({
    s_no: facultyList.length + 1,
    name: '',
    qualification: '',
    photo_url: '',
    display_order: facultyList.length + 1,
    is_active: true
  });
  setIsFacultyModalOpen(true);
};

const handleOpenEditFacultyModal = (f) => {
  setEditingFaculty(f);
  setFacultyForm({
    s_no: f.s_no || '',
    name: f.name || '',
    qualification: f.qualification || '',
    photo_url: f.photo_url || '',
    display_order: f.display_order || 1,
    is_active: f.is_active !== false
  });
  setIsFacultyModalOpen(true);
};

const handleSaveFaculty = async (e) => {
  e.preventDefault();
  if (!facultyForm.name.trim()) return alert('Please enter teacher name');

  setFormSubmitting(true);
  try {
    if (editingFaculty) {
      const { error } = await supabase
        .from('faculty')
        .update({
          s_no: Number(facultyForm.s_no) || null,
          name: facultyForm.name,
          qualification: facultyForm.qualification,
          photo_url: facultyForm.photo_url || null,
          display_order: Number(facultyForm.display_order) || 1,
          is_active: facultyForm.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingFaculty.id);
      if (error) throw error;
      setFacultySuccess('Faculty record updated successfully!');
    } else {
      const { error } = await supabase
        .from('faculty')
        .insert([{
          s_no: Number(facultyForm.s_no) || facultyList.length + 1,
          name: facultyForm.name,
          qualification: facultyForm.qualification,
          photo_url: facultyForm.photo_url || null,
          display_order: Number(facultyForm.display_order) || facultyList.length + 1,
          is_active: facultyForm.is_active
        }]);
      if (error) throw error;
      setFacultySuccess('New faculty member added successfully!');
    }
    setIsFacultyModalOpen(false);
    await fetchFaculty();
  } catch (err) {
    alert('Error saving faculty record: ' + err.message);
  } finally {
    setFormSubmitting(false);
  }
};


const handleDeleteFaculty = async (id, name) => {
  if (!window.confirm(`Delete faculty record: "${name}"?`)) return;
  try {
    const { error } = await supabase.from('faculty').delete().eq('id', id);
    if (error) throw error;
    setFacultySuccess('Faculty record deleted.');
    await fetchFaculty();
  } catch (err) {
    alert('Error deleting: ' + err.message);
  }
};

const handleToggleFacultyActive = async (f) => {
  try {
    const newStatus = !f.is_active;
    const { error } = await supabase
      .from('faculty')
      .update({ is_active: newStatus, updated_at: new Date().toISOString() })
      .eq('id', f.id);
    if (error) throw error;
    setFacultyList((prev) => prev.map((x) => x.id === f.id ? { ...x, is_active: newStatus } : x));
  } catch (err) {
    alert('Error: ' + err.message);
  }
};
  // ==========================================
  // YOUTUBE SAVE
  // ==========================================
  const handleSaveYouTube = async (e) => {
    e.preventDefault();
    if (!youtubeSection) return alert('YouTube settings not loaded yet. Please refresh.');

    setFormSubmitting(true);
    setYoutubeError(null);
    try {
      const payload = {
        title: youtubeForm.title.trim(),
        subtitle: youtubeForm.subtitle.trim(),
        youtube_url: youtubeForm.youtube_url.trim() || null,
        is_active: youtubeForm.is_active,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('youtube_section')
        .update(payload)
        .eq('id', youtubeSection.id)
        .select()
        .single();

      if (error) throw error;

      setYoutubeSection(data);
      setYoutubeSuccess('YouTube video settings updated live on the homepage!');
    } catch (err) {
      setYoutubeError('Error saving YouTube settings: ' + err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  // ==========================================
  // UNIVERSAL CROPPER LOGIC
  // ==========================================
  const handleOpenImageCropper = (e, mode = 'media') => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 15 * 1024 * 1024) {
    alert('Image file size must be less than 15MB');
    return;
  }

  // NEW: Home Popup Banner only accepts PNG / JPG / WEBP
  if (mode === 'banner' && !ALLOWED_BANNER_IMAGE_TYPES.includes(file.type)) {
    alert('The Home Popup Banner only accepts PNG, JPG, or WEBP images.');
    e.target.value = '';
    return;
  }

  setCropperMode(mode);
  const reader = new FileReader();
  reader.onload = () => {
    setRawImageSrc(reader.result);
    setCropZoom(1);
    setCropOffset({ x: 0, y: 0 });
    setCropperOpen(true);
  };
  reader.readAsDataURL(file);
  e.target.value = '';
};

  useEffect(() => {
    if (rawImageSrc && cropperOpen) {
      const img = new Image();
      img.src = rawImageSrc;
      img.onload = () => {
        imageObjRef.current = img;
        drawCropper();
      };
    }
  }, [rawImageSrc, cropperOpen, cropZoom, cropOffset, cropperMode]);

  const drawCropper = () => {
    const canvas = cropCanvasRef.current;
    const img = imageObjRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    const cw = canvas.width;
    const ch = canvas.height;

    ctx.clearRect(0, 0, cw, ch);

    const baseScale = Math.max(cw / img.width, ch / img.height);
    const currentScale = baseScale * cropZoom;

    const drawW = img.width * currentScale;
    const drawH = img.height * currentScale;

    const dx = (cw - drawW) / 2 + cropOffset.x;
    const dy = (ch - drawH) / 2 + cropOffset.y;

    ctx.drawImage(img, dx, dy, drawW, drawH);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - cropOffset.x, y: e.clientY - cropOffset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setCropOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - cropOffset.x,
        y: e.touches[0].clientY - cropOffset.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setCropOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleApplyCropAndUpload = async () => {
  const img = imageObjRef.current;
  if (!img) return;

  setUploadingImage(true);
  try {
    let targetW = 800;
    let targetH = 520;
    let prefix = 'media';

    if (cropperMode === 'carousel') {
      targetW = 1920; targetH = 900; prefix = 'carousel';
    } else if (cropperMode === 'gallery') {
      targetW = 1000; targetH = 680; prefix = 'gallery';
    } else if (cropperMode === 'faculty') {
      targetW = 400; targetH = 400; prefix = 'faculty';
    } else if (cropperMode === 'avatar') {
      targetW = 500; targetH = 500; prefix = 'topper';
    } else if (cropperMode === 'banner') {
      targetW = 900; targetH = 1100; prefix = 'banner';
    }

    const offCanvas = document.createElement('canvas');
    offCanvas.width = targetW;
    offCanvas.height = targetH;
    const ctx = offCanvas.getContext('2d');

    const previewCanvas = cropCanvasRef.current;
    const ratio = targetW / previewCanvas.width;
    const baseScale = Math.max(previewCanvas.width / img.width, previewCanvas.height / img.height);
    const currentScale = baseScale * cropZoom * ratio;
    const drawW = img.width * currentScale;
    const drawH = img.height * currentScale;
    const dx = (targetW - drawW) / 2 + (cropOffset.x * ratio);
    const dy = (targetH - drawH) / 2 + (cropOffset.y * ratio);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, targetW, targetH);
    ctx.drawImage(img, dx, dy, drawW, drawH);

    const isFacultyMode = cropperMode === 'faculty';
    const outputMime = isFacultyMode ? 'image/webp' : 'image/jpeg';
    const outputExt = isFacultyMode ? 'webp' : 'jpg';
    const outputQuality = isFacultyMode ? 0.85 : 0.92;

    // Promisify toBlob so any failure lands in THIS try/catch instead of
    // becoming an unhandled rejection.
    const blob = await new Promise((resolve, reject) => {
      offCanvas.toBlob((b) => {
        if (!b) reject(new Error('Failed to generate cropped image.'));
        else resolve(b);
      }, outputMime, outputQuality);
    });

    const fileName = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${outputExt}`;
    const filePath = `${prefix}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('carmel_media')
      .upload(filePath, blob, {
        contentType: outputMime,
        cacheControl: '3600',
        upsert: true
      });
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('carmel_media')
      .getPublicUrl(filePath);

    // publicUrl only ever gets used HERE — after it actually exists.
    if (cropperMode === 'carousel') {
      setSlideForm((prev) => ({ ...prev, image_url: publicUrl }));
    } else if (cropperMode === 'gallery') {
      setGalleryForm((prev) => ({ ...prev, image_url: publicUrl }));
    } else if (cropperMode === 'avatar') {
      setTopperForm((prev) => ({ ...prev, photo_url: publicUrl }));
    } else if (cropperMode === 'faculty') {
      setFacultyForm((prev) => ({ ...prev, photo_url: publicUrl }));
    } else if (cropperMode === 'banner') {
      setBannerForm((prev) => ({ ...prev, image_url: publicUrl }));
    } else {
      setMediaForm((prev) => ({ ...prev, image_url: publicUrl }));
    }

    setCropperOpen(false);
  } catch (err) {
    console.error('Crop/upload error:', err);
    alert('Failed to upload image: ' + err.message);
  } finally {
    setUploadingImage(false);
  }
};

  if (authLoading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-spinner"></div>
        <p>Loading Carmel Admin Console...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <img src={schoolLogo} alt="Carmel School Logo" className="admin-login-logo" />
            <h2>Carmel's Admin Portal</h2>
            <p>Authorized Administrative Management Console</p>
          </div>

          {loginError && (
            <div className="admin-alert admin-alert-danger">
              <AlertCircle size={18} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="admin-input-group">
              <label htmlFor="login-email">Admin Email</label>
              <div className="admin-input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  id="login-email"
                  type="email"
                  required
                  placeholder="admin@carmels.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-input-group">
              <label htmlFor="login-password">Password</label>
              <div className="admin-input-wrapper">
                <KeyRound size={18} className="input-icon" />
                <input
                  id="login-password"
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-admin-primary" disabled={loginSubmitting}>
              {loginSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="admin-login-footer">
            <button onClick={onNavigateHome} className="btn-back-website">
              <Globe size={15} /> Return to Carmel Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-app">
      {/* Topbar */}
      <header className="admin-topbar">
        <div className="admin-brand">
          <img src={schoolLogo} alt="Logo" className="admin-brand-logo" />
          <div>
            <h1 className="admin-brand-title">Carmel's Console</h1>
            <span className="admin-brand-env">Live Dynamic Management</span>
          </div>
        </div>

        <div className="admin-topbar-actions">
          <div className="admin-user-pill">
            <ShieldCheck size={16} className="user-icon" />
            <span className="user-email">{session.user.email}</span>
          </div>

          <button onClick={onNavigateHome} className="btn-topbar-link">
  <Globe size={15} /> View Website
</button>
          <button onClick={handleLogout} className="btn-topbar-logout" title="Sign Out">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="admin-dashboard-layout">
        
        {/* Left Sidebar */}
        <aside className="admin-sidebar">
          <div className="sidebar-section-title">DYNAMIC CONTENT</div>
        <nav className="sidebar-nav">

  <button 
    className={`sidebar-nav-item ${activeTab === 'school_info' ? 'active' : ''}`}
    onClick={() => setActiveTab('school_info')}
  >
    <Settings size={18} />
    <span>School Info & Contacts</span>
    <ChevronRight size={15} className="chevron" />
  </button>

  <button 
    className={`sidebar-nav-item ${activeTab === 'banner' ? 'active' : ''}`}
    onClick={() => setActiveTab('banner')}
  >
    <Megaphone size={18} />
    <span>Home Popup Banner ({banners.length}/{MAX_HOME_BANNERS})</span>
    <ChevronRight size={15} className="chevron" />
  </button>

  <button 
    className={`sidebar-nav-item ${activeTab === 'carousel' ? 'active' : ''}`}
    onClick={() => setActiveTab('carousel')}
  >
    <Layers size={18} />
    <span>Hero Carousel ({slides.length}/{MAX_CAROUSEL_SLIDES})</span>
    <ChevronRight size={15} className="chevron" />
  </button>

  <button 
    className={`sidebar-nav-item ${activeTab === 'youtube' ? 'active' : ''}`}
    onClick={() => setActiveTab('youtube')}
  >
    <Youtube size={18} />
    <span>YouTube Video</span>
    <ChevronRight size={15} className="chevron" />
  </button>

  

  

  <button 
    className={`sidebar-nav-item ${activeTab === 'media' ? 'active' : ''}`}
    onClick={() => setActiveTab('media')}
  >
    <Newspaper size={18} />
    <span>News, Blog & Awards ({mediaPosts.length})</span>
    <ChevronRight size={15} className="chevron" />
  </button>

  <button
    className={`sidebar-nav-item ${activeTab === 'events' ? 'active' : ''}`}
    onClick={() => setActiveTab('events')}
  >
    <Calendar size={18} />
    <span>Events & Celebrations ({eventsList.length})</span>
    <ChevronRight size={15} className="chevron" />
  </button>

  <button 
    className={`sidebar-nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
    onClick={() => setActiveTab('gallery')}
  >
    <Camera size={18} />
    <span>Campus Photo Gallery ({galleryPhotos.length})</span>
    <ChevronRight size={15} className="chevron" />
  </button>

  <button 
    className={`sidebar-nav-item ${activeTab === 'results' ? 'active' : ''}`}
    onClick={() => setActiveTab('results')}
  >
    <Trophy size={18} />
    <span>Academic Results ({toppers.length}/{MAX_TOPPER_CARDS})</span>
    <ChevronRight size={15} className="chevron" />
  </button>

  <button 
    className={`sidebar-nav-item ${activeTab === 'faculty' ? 'active' : ''}`}
    onClick={() => setActiveTab('faculty')}
  >
    <Users size={18} />
    <span>Faculty ({facultyList.length})</span>
    <ChevronRight size={15} className="chevron" />
  </button>

  <button 
    className={`sidebar-nav-item ${activeTab === 'careers' ? 'active' : ''}`}
    onClick={() => setActiveTab('careers')}
  >
    <Briefcase size={18} />
    <span>Careers & Vacancies ({careersList.length})</span>
    <ChevronRight size={15} className="chevron" />
  </button>

  <button
    className={`sidebar-nav-item ${activeTab === 'testimonials' ? 'active' : ''}`}
    onClick={() => setActiveTab('testimonials')}
  >
    <Youtube size={18} />
    <span>Testimonials</span>
    <ChevronRight size={15} className="chevron" />
  </button>

  <button
    className={`sidebar-nav-item ${activeTab === 'admissions' ? 'active' : ''}`}
    onClick={() => setActiveTab('admissions')}
  >
    <School size={18} />
    <span>Admission Applications ({icseAdmissions.length + matricAdmissions.length})</span>
    <ChevronRight size={15} className="chevron" />
  </button>

  <button 
    className={`sidebar-nav-item ${activeTab === 'enquiries' ? 'active' : ''}`}
    onClick={() => setActiveTab('enquiries')}
  >
    <Send size={18} />
    <span>Enquiries ({enquiries.filter(e => e.status === 'new').length} New)</span>
    <ChevronRight size={15} className="chevron" />
  </button>

  <button 
    className={`sidebar-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
    onClick={() => setActiveTab('overview')}
  >
    <Database size={18} />
    <span>Overview & Stats</span>
    <ChevronRight size={15} className="chevron" />
  </button>

  {/* {SHOW_DEV_TOOLS && (
    <button 
      className={`sidebar-nav-item ${activeTab === 'db_status' ? 'active' : ''}`}
      onClick={() => setActiveTab('db_status')}
    >
      <Database size={18} />
      <span>Database & SQL</span>
      <ChevronRight size={15} className="chevron" />
    </button>
  )} */}
</nav>

          {/* <div className="sidebar-footer-card">
            <div className="status-indicator">
              <span className="pulse-indicator"></span>
              <span>Supabase Live</span>
            </div>
            <p className="project-ref">Project: ypsijjhcmfbyepfczxqj</p>
          </div> */}
        </aside> 

        {/* Workspace Views */}
        <main className="admin-main-view">
          
          {/* =========================================================
              TAB 1: SCHOOL INFO & CONTACT SETTINGS MANAGER
             ========================================================= */}
          {activeTab === 'school_info' && (
            <div className="tab-pane">
              <div className="view-header">
                <div>
                  <h2 className="view-title">School Info & Contact Settings</h2>
                  <p className="view-subtitle">
                    Live global school name, phone numbers, emails, addresses, office timings & social media links.
                  </p>
                </div>

                <div className="view-header-actions">
                  <button 
                    className="btn-refresh" 
                    onClick={fetchSchoolInfoData} 
                    disabled={schoolInfoLoading}
                    title="Refresh Settings"
                  >
                    <RefreshCw size={16} className={schoolInfoLoading ? 'spin-icon' : ''} />
                  </button>
                </div>
              </div>

              {schoolInfoSuccess && (
                <div className="admin-alert admin-alert-success">
                  <CheckCircle2 size={18} />
                  <span>{schoolInfoSuccess}</span>
                  <button className="alert-close" onClick={() => setSchoolInfoSuccess(null)}><X size={14} /></button>
                </div>
              )}

              {schoolInfoError && (
                <div className="admin-alert admin-alert-danger">
                  <AlertCircle size={18} />
                  <div>
                    <strong>Database Notice: </strong>
                    <span>{schoolInfoError}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSaveSchoolInfo} className="school-info-admin-form">
                
                {/* 1. GENERAL IDENTITY */}
                <div className="results-admin-section-block">
                  <div className="section-block-header">
                    <h3 className="section-block-title">
                      <Building2 size={18} className="text-primary-blue" />
                      School Identity & General Branding
                    </h3>
                  </div>

                  <div className="form-grid-2col">
                    <div className="admin-input-group">
                      <label htmlFor="info-school-name">School Official Name *</label>
                      <input
                        id="info-school-name"
                        type="text"
                        required
                        value={schoolInfoForm.school_name}
                        onChange={(e) => setSchoolInfoForm({ ...schoolInfoForm, school_name: e.target.value })}
                      />
                    </div>

                    <div className="admin-input-group">
                      <label htmlFor="info-tagline">Tagline / Subtitle *</label>
                      <input
                        id="info-tagline"
                        type="text"
                        required
                        value={schoolInfoForm.tagline}
                        onChange={(e) => setSchoolInfoForm({ ...schoolInfoForm, tagline: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2col">
                    <div className="admin-input-group">
                      <label htmlFor="info-admission-year">Active Admission Session *</label>
                      <input
                        id="info-admission-year"
                        type="text"
                        required
                        placeholder="2026-27"
                        value={schoolInfoForm.admission_year}
                        onChange={(e) => setSchoolInfoForm({ ...schoolInfoForm, admission_year: e.target.value })}
                      />
                    </div>

                    <div className="admin-input-group">
                      <label htmlFor="info-office-hours">Office Working Hours *</label>
                      <input
                        id="info-office-hours"
                        type="text"
                        required
                        placeholder="Monday - Saturday: 8:30 AM - 4:00 PM"
                        value={schoolInfoForm.office_hours}
                        onChange={(e) => setSchoolInfoForm({ ...schoolInfoForm, office_hours: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="admin-input-group">
                    <label htmlFor="info-about">About / Footer Vision Summary *</label>
                    <textarea
                      id="info-about"
                      rows={3}
                      required
                      value={schoolInfoForm.about_summary}
                      onChange={(e) => setSchoolInfoForm({ ...schoolInfoForm, about_summary: e.target.value })}
                    />
                  </div>
                </div>

                {/* 2. CONTACT NUMBERS & EMAILS */}
                <div className="results-admin-section-block">
                  <div className="section-block-header">
                    <h3 className="section-block-title">
                      <Phone size={18} className="text-primary-blue" />
                      Contact Numbers & Official Email Addresses
                    </h3>
                  </div>

                  <div className="form-grid-3col">
                    <div className="admin-input-group">
                      <label htmlFor="info-phone-primary">Primary Phone Number *</label>
                      <input
                        id="info-phone-primary"
                        type="text"
                        required
                        placeholder="7868023528"
                        value={schoolInfoForm.phone_primary}
                        onChange={(e) => setSchoolInfoForm({ ...schoolInfoForm, phone_primary: e.target.value })}
                      />
                    </div>

                    <div className="admin-input-group">
                      <label htmlFor="info-phone-sec">Secondary Phone Number</label>
                      <input
                        id="info-phone-sec"
                        type="text"
                        placeholder="7868023548"
                        value={schoolInfoForm.phone_secondary}
                        onChange={(e) => setSchoolInfoForm({ ...schoolInfoForm, phone_secondary: e.target.value })}
                      />
                    </div>

                    <div className="admin-input-group">
                      <label htmlFor="info-whatsapp">WhatsApp Contact Number</label>
                      <input
                        id="info-whatsapp"
                        type="text"
                        placeholder="7868023528"
                        value={schoolInfoForm.whatsapp_number}
                        onChange={(e) => setSchoolInfoForm({ ...schoolInfoForm, whatsapp_number: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-grid-3col">
                    <div className="admin-input-group">
                      <label htmlFor="info-email-matric">Matriculation School Email *</label>
                      <input
                        id="info-email-matric"
                        type="email"
                        required
                        placeholder="carmels.matric.school@gmail.com"
                        value={schoolInfoForm.email_matric}
                        onChange={(e) => setSchoolInfoForm({ ...schoolInfoForm, email_matric: e.target.value })}
                      />
                    </div>

                    <div className="admin-input-group">
                      <label htmlFor="info-email-icse">ICSE School Email *</label>
                      <input
                        id="info-email-icse"
                        type="email"
                        required
                        placeholder="carmels.english.school@gmail.com"
                        value={schoolInfoForm.email_icse}
                        onChange={(e) => setSchoolInfoForm({ ...schoolInfoForm, email_icse: e.target.value })}
                      />
                    </div>

                    <div className="admin-input-group">
                      <label htmlFor="info-email-general">General Enquiries Email</label>
                      <input
                        id="info-email-general"
                        type="email"
                        placeholder="info@carmels.edu"
                        value={schoolInfoForm.email_general}
                        onChange={(e) => setSchoolInfoForm({ ...schoolInfoForm, email_general: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. CAMPUS ADDRESS & MAPS */}
                <div className="results-admin-section-block">
                  <div className="section-block-header">
                    <h3 className="section-block-title">
                      <MapPin size={18} className="text-primary-blue" />
                      Campus Address & Google Maps Location
                    </h3>
                  </div>

                  <div className="admin-input-group">
                    <label htmlFor="info-address">Full Campus Address *</label>
                    <textarea
                      id="info-address"
                      rows={2}
                      required
                      value={schoolInfoForm.address_line}
                      onChange={(e) => setSchoolInfoForm({ ...schoolInfoForm, address_line: e.target.value })}
                    />
                  </div>

                  <div className="form-grid-2col">
                    <div className="admin-input-group">
                      <label htmlFor="info-city">City / Region *</label>
                      <input
                        id="info-city"
                        type="text"
                        required
                        placeholder="Trichy"
                        value={schoolInfoForm.city}
                        onChange={(e) => setSchoolInfoForm({ ...schoolInfoForm, city: e.target.value })}
                      />
                    </div>

                    <div className="admin-input-group">
                      <label htmlFor="info-pincode">Postal Pincode *</label>
                      <input
                        id="info-pincode"
                        type="text"
                        required
                        placeholder="620003"
                        value={schoolInfoForm.pincode}
                        onChange={(e) => setSchoolInfoForm({ ...schoolInfoForm, pincode: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="admin-input-group">
                    <label htmlFor="info-maps-link">Google Maps Share / Directions Link *</label>
                    <input
                      id="info-maps-link"
                      type="url"
                      required
                      placeholder="https://maps.app.goo.gl/..."
                      value={schoolInfoForm.google_maps_link}
                      onChange={(e) => setSchoolInfoForm({ ...schoolInfoForm, google_maps_link: e.target.value })}
                    />
                  </div>

                  <div className="admin-input-group">
                    <label htmlFor="info-map-embed">Google Maps Embed URL (for Satellite iframe)</label>
                    <input
                      id="info-map-embed"
                      type="url"
                      placeholder="https://maps.google.com/maps?q=..."
                      value={schoolInfoForm.map_embed_url}
                      onChange={(e) => setSchoolInfoForm({ ...schoolInfoForm, map_embed_url: e.target.value })}
                    />
                  </div>
                </div>

                {/* 4. SOCIAL MEDIA LINKS */}
                <div className="results-admin-section-block">
                  <div className="section-block-header">
                    <h3 className="section-block-title">
                      <Share2 size={18} className="text-primary-blue" />
                      Social Media Channels
                    </h3>
                  </div>

                  <div className="form-grid-3col">
                    <div className="admin-input-group">
                      <label htmlFor="info-fb">Facebook URL</label>
                      <input
                        id="info-fb"
                        type="url"
                        placeholder="https://facebook.com/..."
                        value={schoolInfoForm.facebook_url}
                        onChange={(e) => setSchoolInfoForm({ ...schoolInfoForm, facebook_url: e.target.value })}
                      />
                    </div>

                    <div className="admin-input-group">
                      <label htmlFor="info-insta">Instagram URL</label>
                      <input
                        id="info-insta"
                        type="url"
                        placeholder="https://instagram.com/..."
                        value={schoolInfoForm.instagram_url}
                        onChange={(e) => setSchoolInfoForm({ ...schoolInfoForm, instagram_url: e.target.value })}
                      />
                    </div>

                    <div className="admin-input-group">
                      <label htmlFor="info-yt">YouTube Channel URL</label>
                      <input
                        id="info-yt"
                        type="url"
                        placeholder="https://youtube.com/..."
                        value={schoolInfoForm.youtube_url}
                        onChange={(e) => setSchoolInfoForm({ ...schoolInfoForm, youtube_url: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Bar */}
                <div className="school-info-submit-bar">
                  <button type="submit" className="btn-admin-primary btn-large-submit" disabled={schoolInfoLoading}>
                    {schoolInfoLoading ? (
                      <>
                        <span className="btn-spinner"></span> Saving Settings...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} /> Save School Info & Contact Settings
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* =========================================================
              TAB 2: CAREERS & VACANCIES MANAGER
             ========================================================= */}
          {activeTab === 'careers' && (
            <div className="tab-pane">
              <div className="view-header">
                <div>
                  <h2 className="view-title">Careers & Job Openings Manager</h2>
                  <p className="view-subtitle">Post active faculty & staff vacancies (No static fallback) and manage candidate applications.</p>
                </div>

                <div className="view-header-actions">
                  <button className="btn-refresh" onClick={fetchCareersData} disabled={careersLoading}>
                    <RefreshCw size={16} className={careersLoading ? 'spin-icon' : ''} />
                  </button>
                  <button className="btn-admin-primary" onClick={handleOpenAddJobModal}>
                    <Plus size={16} /> Post New Vacancy
                  </button>
                </div>
              </div>

              <div className="gallery-filter-bar">
                <div className="filter-label"><Briefcase size={15} /> Section:</div>
                <button
                  className={`gallery-filter-pill ${careersSubTab === 'jobs' ? 'active' : ''}`}
                  onClick={() => setCareersSubTab('jobs')}
                >
                  Active Vacancies ({careersList.length})
                </button>
                <button
                  className={`gallery-filter-pill ${careersSubTab === 'applications' ? 'active' : ''}`}
                  onClick={() => setCareersSubTab('applications')}
                >
                  Received Applications ({applicationsList.length})
                </button>
              </div>

              {careersSuccess && (
                <div className="admin-alert admin-alert-success">
                  <CheckCircle2 size={18} />
                  <span>{careersSuccess}</span>
                  <button className="alert-close" onClick={() => setCareersSuccess(null)}><X size={14} /></button>
                </div>
              )}

              {careersError && (
                <div className="admin-alert admin-alert-danger">
                  <AlertCircle size={18} />
                  <div>
                    <strong>Database Notice: </strong>
                    <span>{careersError}</span>
                  </div>
                </div>
              )}

              {careersSubTab === 'jobs' && (
                <>
                  {careersList.length === 0 ? (
                    <div className="content-management-box">
                      <div className="empty-state-notice">
                        <Briefcase size={44} className="empty-icon" />
                        <h4>No Active Job Openings Posted</h4>
                        <p>Currently there are no job vacancies. Click "Post New Vacancy" to add an opening.</p>
                        <button className="btn-admin-primary" onClick={handleOpenAddJobModal}>
                          <Plus size={16} /> Post First Vacancy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="admin-jobs-grid">
                      {careersList.map((job, index) => (
                        <div key={job.id || index} className={`admin-job-card ${job.is_active === false ? 'inactive' : ''}`}>
                          <div className="job-card-topbar">
                            <span className="job-dept-badge">{job.department}</span>
                            <span className="job-type-badge"><Clock size={12} /> {job.job_type || 'Full-Time'}</span>
                          </div>
                          <h3 className="job-card-title">{job.title}</h3>
                          <p className="job-card-desc">{job.description}</p>
                          {job.requirements && (
                            <div className="job-card-req">
                              <strong>Requirements: </strong>
                              <span>{job.requirements}</span>
                            </div>
                          )}
                          <div className="job-card-meta-row">
                            <span><Briefcase size={13} /> {job.experience || '2+ Years'}</span>
                            <span><MapPin size={13} /> {job.location || 'Trichy, TN'}</span>
                          </div>
                          <div className="slide-card-actions">
                            <button className={`btn-action-toggle ${job.is_active !== false ? 'active' : ''}`} onClick={() => handleToggleJobActive(job)}>
                              {job.is_active !== false ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                              <span>{job.is_active !== false ? 'Active' : 'Hidden'}</span>
                            </button>
                            <div className="crud-btn-group">
                              <button className="btn-action-edit" onClick={() => handleOpenEditJobModal(job)}><Edit3 size={15} /> Edit</button>
                              <button className="btn-action-delete" onClick={() => handleDeleteJob(job.id, job.title)}><Trash2 size={15} /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {careersSubTab === 'applications' && (
                <div className="admin-applications-wrapper">
                  {applicationsList.length === 0 ? (
                    <div className="content-management-box">
                      <div className="empty-state-notice">
                        <Users size={44} className="empty-icon" />
                        <h4>No Candidate Applications Received Yet</h4>
                        <p>Candidate resumes submitted through the website Careers form will appear here in real-time.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="applications-table-card">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Candidate Name</th>
                            <th>Position</th>
                            <th>Contact</th>
                            <th>Experience</th>
                            <th>Cover Note / Summary</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applicationsList.map((app, idx) => (
                            <tr key={app.id || idx}>
                              <td><strong>{app.full_name}</strong></td>
                              <td><span className="table-dept-pill">{app.position}</span></td>
                              <td>
                                <div className="table-contact-cell">
                                  <span><Mail size={13} /> {app.email}</span>
                                  <span><Phone size={13} /> {app.phone}</span>
                                </div>
                              </td>
                              <td>{app.experience || 'Not specified'}</td>
                              <td><p className="table-msg-clamp">{app.message || 'No additional note.'}</p></td>
                              <td><span className="table-date">{new Date(app.created_at || Date.now()).toLocaleDateString('en-GB')}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              TAB: ADMISSION ENQUIRIES MANAGER
              (FIX: this pane now lives inside <main>, so it gets the
              sidebar layout / grid styling like every other tab.)
             ========================================================= */}
          {/* =========================================================
              ADMISSION APPLICATIONS — SEPARATE FROM ENQUIRIES
             ========================================================= */}
          {activeTab === 'admissions' && (
            <div className="tab-pane admission-admin-tab">
              <div className="view-header">
                <div>
                  <h2 className="view-title">Admission Applications</h2>
                  <p className="view-subtitle">
                    Complete ICSE / ISC and Matriculation application forms. This section uses dedicated admission tables and does not read from or write to enquiries.
                  </p>
                </div>
                <button
                  className="btn-refresh"
                  onClick={fetchAdmissionApplications}
                  disabled={admissionsLoading}
                  title="Refresh admission applications"
                >
                  <RefreshCw size={16} className={admissionsLoading ? 'spin-icon' : ''} />
                </button>
              </div>

              <div className="admission-admin-toolbar">
                <div className="admission-admin-filters">
                  <button
                    className={`admission-filter-btn ${admissionSchoolFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setAdmissionSchoolFilter('all')}
                  >
                    All ({icseAdmissions.length + matricAdmissions.length})
                  </button>
                  <button
                    className={`admission-filter-btn ${admissionSchoolFilter === 'icse' ? 'active' : ''}`}
                    onClick={() => setAdmissionSchoolFilter('icse')}
                  >
                    ICSE / ISC ({icseAdmissions.length})
                  </button>
                  <button
                    className={`admission-filter-btn ${admissionSchoolFilter === 'matric' ? 'active' : ''}`}
                    onClick={() => setAdmissionSchoolFilter('matric')}
                  >
                    Matriculation ({matricAdmissions.length})
                  </button>
                </div>

                <select
                  className="admission-status-select"
                  value={admissionStatusFilter}
                  onChange={(e) => setAdmissionStatusFilter(e.target.value)}
                >
                  <option value="all">All statuses</option>
                  <option value="new">New</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>

              {admissionsError && (
                <div className="admin-alert admin-alert-danger">
                  <AlertCircle size={18} />
                  <span>{admissionsError}</span>
                </div>
              )}

              {admissionsLoading ? (
                <div className="content-management-box">
                  <div className="empty-state-notice">
                    <RefreshCw size={40} className="empty-icon spin-icon" />
                    <h4>Loading applications…</h4>
                    <p>Fetching the dedicated ICSE and Matriculation admission tables.</p>
                  </div>
                </div>
              ) : (() => {
                const combined = [
                  ...(admissionSchoolFilter !== 'matric' ? icseAdmissions.map((x) => ({ ...x, __school: 'icse' })) : []),
                  ...(admissionSchoolFilter !== 'icse' ? matricAdmissions.map((x) => ({ ...x, __school: 'matric' })) : [])
                ]
                  .filter((x) => admissionStatusFilter === 'all' || (x.status || 'new') === admissionStatusFilter)
                  .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

                if (!combined.length) {
                  return (
                    <div className="content-management-box">
                      <div className="empty-state-notice">
                        <School size={44} className="empty-icon" />
                        <h4>No admission applications</h4>
                        <p>New ICSE/ISC and Matriculation forms will appear here after successful submission.</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="admission-admin-list">
                    {combined.map((app) => {
                      const school = app.__school;
                      const studentName = getAdmissionStudentName(app, school);
                      const standard = app.admission_standard || '—';
                      const academicYear = app.academic_year || '—';
                      const status = app.status || 'new';

                      return (
                        <div className="admission-admin-card" key={`${school}-${app.id}`}>
                          <div className="admission-admin-card-main">
                            <div className={`admission-school-badge ${school}`}>
                              {school === 'icse' ? 'ICSE / ISC' : 'MATRIC'}
                            </div>
                            <div className="admission-admin-card-title">
                              <h3>{studentName}</h3>
                              <span>{app.application_no || `${school.toUpperCase()} application`}</span>
                            </div>
                            <span className={`admission-status-badge status-${status}`}>{status}</span>
                          </div>

                          <div className="admission-admin-meta">
                            <div><span>Class</span><strong>{standard}</strong></div>
                            <div><span>Academic Year</span><strong>{academicYear}</strong></div>
                            <div><span>Submitted</span><strong>{app.created_at ? new Date(app.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</strong></div>
                            <div><span>Contact</span><strong>{app.sms_phone || app.father_mobile || app.mother_mobile || '—'}</strong></div>
                          </div>

                          <div className="admission-admin-card-actions">
                            <button
                              className="btn-admin-secondary"
                              onClick={() => openAdmission(app, school)}
                            >
                              <Eye size={15} /> View Application
                            </button>
                            <button
                              className="btn-action-delete"
                              onClick={() => deleteAdmissionApplication(app, school)}
                              disabled={admissionActionLoading}
                            >
                              <Trash2 size={15} /> Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {activeTab === 'enquiries' && (
  <div className="tab-pane">
    <div className="view-header">
      <div>
        <h2 className="view-title">Admission Enquiries</h2>
        <p className="view-subtitle">Enquiries submitted via the homepage "Enquire Now" form.</p>
      </div>
      <button className="btn-refresh" onClick={fetchEnquiries} disabled={enquiriesLoading}>
        <RefreshCw size={16} className={enquiriesLoading ? 'spin-icon' : ''} />
      </button>
    </div>

    {enquiries.length === 0 ? (
      <div className="content-management-box">
        <div className="empty-state-notice">
          <Send size={44} className="empty-icon" />
          <h4>No Enquiries Yet</h4>
          <p>Submissions from the website enquiry form will appear here.</p>
        </div>
      </div>
    ) : (
      <div className="enquiries-list">
        {enquiries.map((en) => (
          <div key={en.id} className="enquiry-card">
            <div className="enquiry-card-top">
              <h3 className="enquiry-name">{en.full_name}</h3>
            </div>

            <div className="enquiry-card-grid">
              <div className="enquiry-field">
                <span className="enquiry-field-label">Email</span>
                <span className="enquiry-field-value">{en.email}</span>
              </div>
              <div className="enquiry-field">
                <span className="enquiry-field-label">Phone</span>
                <span className="enquiry-field-value">{en.phone}</span>
              </div>
              <div className="enquiry-field">
                <span className="enquiry-field-label">Stream</span>
                <span className="enquiry-field-value">{en.stream || '—'}</span>
              </div>
              <div className="enquiry-field">
                <span className="enquiry-field-label">Grade</span>
                <span className="enquiry-field-value">{en.grade || '—'}</span>
              </div>
            </div>

            {en.message && (
              <div className="enquiry-message-block">
                <span className="enquiry-field-label">Message</span>
                <p className="enquiry-message-text">{en.message}</p>
              </div>
            )}


            <div className="enquiry-card-footer">
              <span className="table-date">
                {new Date(en.created_at || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <button className="btn-action-delete" onClick={() => handleDeleteEnquiry(en.id, en.full_name)}>
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}

          {/* =========================================================
              TAB 3: ACADEMIC RESULTS & TOPPERS MANAGER
             ========================================================= */}
          {activeTab === 'results' && (
            <div className="tab-pane">
              <div className="view-header">
                <div>
                  <h2 className="view-title">Academic Results & Toppers Manager</h2>
                  <p className="view-subtitle">Live editable board exam pass percentage, school highest marks, centums and top student cards.</p>
                </div>

                <div className="view-header-actions">
                  <button className="btn-refresh" onClick={fetchResultsData} disabled={resultsLoading}>
                    <RefreshCw size={16} className={resultsLoading ? 'spin-icon' : ''} />
                  </button>

                  <button 
                    className="btn-admin-primary" 
                    onClick={handleOpenAddTopperModal} 
                    disabled={toppers.length >= MAX_TOPPER_CARDS}
                  >
                    <Plus size={16} /> Add Topper Card ({toppers.length}/{MAX_TOPPER_CARDS})
                  </button>
                </div>
              </div>

              {resultsSuccess && (
                <div className="admin-alert admin-alert-success">
                  <CheckCircle2 size={18} />
                  <span>{resultsSuccess}</span>
                  <button className="alert-close" onClick={() => setResultsSuccess(null)}><X size={14} /></button>
                </div>
              )}

              {resultsError && (
                <div className="admin-alert admin-alert-danger">
                  <AlertCircle size={18} />
                  <div>
                    <strong>Database Notice: </strong>
                    <span>{resultsError}</span>
                  </div>
                </div>
              )}

              {/* 4 Stat Highlights */}
              <div className="results-admin-section-block">
                <div className="section-block-header">
                  <h3 className="section-block-title">
                    <TrendingUp size={18} className="text-primary-blue" />
                    Key Performance Highlights (4 Stat Metrics)
                  </h3>
                  <span className="section-block-hint">Click "Edit Metric" to update percentage or highest score</span>
                </div>

                <div className="admin-stats-cards-grid">
                  {(resultStats.length > 0 ? resultStats : [
                    { id: '1', stat_number: '100%', label: 'Board Pass Percentage', subtitle: '100% Pass Rate in Std X & Std XII Examinations' },
                    { id: '2', stat_number: '588 / 600', label: 'Std XII Highest Mark', subtitle: 'Top School Score in Higher Secondary Board' },
                    { id: '3', stat_number: '494 / 500', label: 'Std X Highest Mark', subtitle: 'Top School Score in SSLC Board Examination' },
                    { id: '4', stat_number: '50+', label: 'Centums Scored (100/100)', subtitle: 'Full Marks Scored in Maths, Physics, CS & Commerce' }
                  ]).map((st, idx) => (
                    <div key={st.id || idx} className="admin-stat-card-box">
                      <div className="admin-stat-icon-circle">
                        {idx === 0 && <TrendingUp size={22} />}
                        {idx === 1 && <Crown size={22} />}
                        {idx === 2 && <Trophy size={22} />}
                        {idx === 3 && <Star size={22} />}
                      </div>
                      <h3 className="admin-stat-number">{st.stat_number}</h3>
                      <h4 className="admin-stat-label">{st.label}</h4>
                      <p className="admin-stat-sub">{st.subtitle}</p>

                      <button className="btn-edit-stat-metric" onClick={() => handleOpenEditStatModal(st)}>
                        <Edit3 size={14} /> Edit Metric
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top 5 Toppers */}
              <div className="results-admin-section-block">
                <div className="section-block-header">
                  <div>
                    <h3 className="section-block-title">
                      <Crown size={18} className="text-accent-gold" />
                      Top Academic Mark Achievers (Limit: {MAX_TOPPER_CARDS} Cards)
                    </h3>
                    <p className="section-block-sub">Rank holders, total scores, stream, student photos & centum subject breakdowns.</p>
                  </div>
                  <div className="limit-pill-counter">{toppers.length} of {MAX_TOPPER_CARDS} Slots Used</div>
                </div>

                {toppers.length === 0 ? (
                  <div className="content-management-box">
                    <div className="empty-state-notice">
                      <Trophy size={44} className="empty-icon" />
                      <h4>No Topper Cards Configured</h4>
                      <p>Click "Add Topper Card" to add your top rank holders or execute the seed SQL in <code>database.md</code>.</p>
                      <button className="btn-admin-primary" onClick={handleOpenAddTopperModal}>
                        <Plus size={16} /> Add First Topper Card
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="admin-toppers-grid">
                    {toppers.map((ach, idx) => (
                      <div key={ach.id || idx} className={`admin-topper-card ${ach.badge_color || 'gold'} ${ach.is_active === false ? 'inactive' : ''}`}>
                        <div className="achiever-badge-top">
                          <Medal size={15} /> {ach.rank} — {ach.percentage}
                        </div>

                        {ach.photo_url ? (
                          <div className="admin-topper-avatar">
                            <img src={ach.photo_url} alt={ach.name} />
                          </div>
                        ) : (
                          <div className="admin-topper-avatar placeholder">
                            <User size={28} />
                          </div>
                        )}

                        <div className="achiever-score-circle">
                          <span className="score-val">{ach.total_score}</span>
                          <span className="score-label">TOTAL MARKS</span>
                        </div>

                        <h3 className="achiever-name">{ach.name}</h3>
                        <p className="achiever-stream">{ach.stream}</p>

                        {ach.centums && (
                          <div className="achiever-centums-box">
                            <span className="centums-header-label">Centum Scores (100/100):</span>
                            {ach.centums.split('\n').filter(c => c.trim() !== '').map((c, cIdx) => (
                              <span key={cIdx} className="centum-tag">
                                <Star size={12} /> {c}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="slide-card-actions">
                          <button 
                            className={`btn-action-toggle ${ach.is_active !== false ? 'active' : ''}`}
                            onClick={() => handleToggleTopperActive(ach)}
                          >
                            {ach.is_active !== false ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                            <span>{ach.is_active !== false ? 'Active' : 'Hidden'}</span>
                          </button>

                          <div className="crud-btn-group">
                            <button className="btn-action-edit" onClick={() => handleOpenEditTopperModal(ach)}>
                              <Edit3 size={15} /> Edit
                            </button>
                            <button className="btn-action-delete" onClick={() => handleDeleteTopper(ach.id, ach.name)}>
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* =========================================================
              TAB 4: NEWS, BLOG & AWARDS MANAGER
             ========================================================= */}
          {activeTab === 'media' && (
            <div className="tab-pane">
              <div className="view-header">
                <div>
                  <h2 className="view-title">News, Blog & Awards Manager</h2>
                  <p className="view-subtitle">Create and manage articles, press releases, student achievements & photo stories.</p>
                </div>

                <div className="view-header-actions">
                  <button className="btn-refresh" onClick={fetchMediaPosts} disabled={mediaLoading}>
                    <RefreshCw size={16} className={mediaLoading ? 'spin-icon' : ''} />
                  </button>

                  <button className="btn-admin-primary" onClick={handleOpenAddMediaModal}>
                    <Plus size={16} /> Add Article / Post
                  </button>
                </div>
              </div>

              <div className="gallery-filter-bar">
                <div className="filter-label"><Filter size={15} /> Type:</div>
                {[
                  { id: 'all', label: `All Posts (${mediaPosts.length})` },
                  { id: 'blog', label: `Blog Stories (${mediaPosts.filter(p => p.type === 'blog').length})` },
                  { id: 'news', label: `News & Events (${mediaPosts.filter(p => p.type === 'news').length})` },
                  { id: 'awards', label: `Awards & Distinction (${mediaPosts.filter(p => p.type === 'awards').length})` }
                ].map((t) => (
                  <button
                    key={t.id}
                    className={`gallery-filter-pill ${mediaTypeFilter === t.id ? 'active' : ''}`}
                    onClick={() => setMediaTypeFilter(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {mediaSuccess && (
                <div className="admin-alert admin-alert-success">
                  <CheckCircle2 size={18} />
                  <span>{mediaSuccess}</span>
                  <button className="alert-close" onClick={() => setMediaSuccess(null)}><X size={14} /></button>
                </div>
              )}

              <div className="gallery-admin-grid">
                {mediaPosts
                  .filter((p) => mediaTypeFilter === 'all' || p.type === mediaTypeFilter)
                  .map((post, index) => (
                    <div key={post.id || index} className={`gallery-admin-card ${post.is_active === false ? 'inactive' : ''}`}>
                      <div className="gallery-card-img-wrap">
                        <img 
                          src={post.image_url} 
                          alt={post.title} 
                          className="gallery-card-img"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80'; }}
                        />
                        <span className={`gallery-cat-badge type-badge-${post.type || 'blog'}`}>
                          {post.type === 'blog' ? 'Blog' : post.type === 'news' ? 'News' : 'Award'}
                        </span>
                      </div>

                      <div className="gallery-card-body">
                        <span className="media-date-admin">{post.date} &bull; {post.category?.toUpperCase()}</span>
                        <h3 className="gallery-card-title">{post.title}</h3>
                        <p className="gallery-card-desc">{post.description}</p>

                        <div className="slide-card-actions">
                          <button 
                            className={`btn-action-toggle ${post.is_active !== false ? 'active' : ''}`}
                            onClick={() => handleToggleMediaActive(post)}
                          >
                            {post.is_active !== false ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                            <span>{post.is_active !== false ? 'Active' : 'Hidden'}</span>
                          </button>

                          <div className="crud-btn-group">
                            <button className="btn-action-edit" onClick={() => handleOpenEditMediaModal(post)}>
                              <Edit3 size={15} /> Edit
                            </button>
                            <button className="btn-action-delete" onClick={() => handleDeleteMediaPost(post.id, post.title)}>
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 5: EVENTS & CELEBRATIONS MANAGER
             ========================================================= */}
          {activeTab === 'events' && (
            <div className="tab-pane">
              <div className="view-header">
                <div>
                  <h2 className="view-title">Events & Celebrations Manager</h2>
                  <p className="view-subtitle">Create, edit, publish, hide and reorder the events shown on the home page and Events page.</p>
                </div>
                <div className="view-header-actions">
                  <button className="btn-refresh" onClick={fetchEvents} disabled={eventsLoading}>
                    <RefreshCw size={16} className={eventsLoading ? 'spin-icon' : ''} />
                  </button>
                  <button className="btn-admin-primary" onClick={handleOpenAddEventModal}>
                    <Plus size={16} /> Add Event / Celebration
                  </button>
                </div>
              </div>

              {eventsError && <div className="admin-alert admin-alert-danger"><AlertCircle size={18} /><span>{eventsError}</span></div>}
              {eventsSuccess && <div className="admin-alert admin-alert-success"><CheckCircle2 size={18} /><span>{eventsSuccess}</span><button className="alert-close" onClick={() => setEventsSuccess(null)}><X size={14} /></button></div>}

              {eventsLoading ? (
                <div className="admin-loading-inline"><RefreshCw size={28} className="spin-icon" /><span>Loading events...</span></div>
              ) : eventsList.length === 0 ? (
                <div className="empty-state-card">
                  <Calendar size={34} />
                  <h3>No events created yet</h3>
                  <p>Add your first event or celebration. Published items automatically appear on the website.</p>
                  <button className="btn-admin-primary" onClick={handleOpenAddEventModal}><Plus size={16} /> Add First Event</button>
                </div>
              ) : (
                <div className="gallery-admin-grid">
                  {eventsList.map((event, index) => (
                    <div key={event.id || index} className={`gallery-admin-card ${event.is_active === false ? 'inactive' : ''}`}>
                      <div className="gallery-card-img-wrap">
                        {event.image_url ? (
                          <img src={event.image_url} alt={event.title} className="gallery-card-img" />
                        ) : (
                          <div className="event-admin-placeholder"><Calendar size={42} /></div>
                        )}
                        <span className="gallery-cat-badge type-badge-news">{event.is_active === false ? 'Hidden' : 'Published'}</span>
                      </div>
                      <div className="gallery-card-body">
                        <span className="media-date-admin">{event.date}{event.time ? ` • ${event.time}` : ''}</span>
                        <h3 className="gallery-card-title">{event.title}</h3>
                        <p className="gallery-card-desc">{event.desc}</p>
                        {event.location && <p className="gallery-card-desc"><MapPin size={14} /> {event.location}</p>}
                        <div className="slide-card-actions">
                          <button className={`btn-action-toggle ${event.is_active !== false ? 'active' : ''}`} onClick={() => handleToggleEventActive(event)}>
                            {event.is_active !== false ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                            <span>{event.is_active !== false ? 'Published' : 'Hidden'}</span>
                          </button>
                          <div className="crud-btn-group">
                            <button className="btn-action-edit" onClick={() => handleOpenEditEventModal(event)}><Edit3 size={15} /> Edit</button>
                            <button className="btn-action-delete" onClick={() => handleDeleteEvent(event.id, event.title)}><Trash2 size={15} /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              TAB 6: CAMPUS PHOTO GALLERY MANAGER
             ========================================================= */}
          {activeTab === 'gallery' && (
            <div className="tab-pane">
              <div className="view-header">
                <div>
                  <h2 className="view-title">Campus Photo Gallery Manager</h2>
                  <p className="view-subtitle">Upload and manage school campus photos, lab views, infrastructure & student activities.</p>
                </div>

                <div className="view-header-actions">
                  <button className="btn-refresh" onClick={fetchGalleryPhotos} disabled={galleryLoading}>
                    <RefreshCw size={16} className={galleryLoading ? 'spin-icon' : ''} />
                  </button>

                  <button className="btn-admin-primary" onClick={handleOpenAddGalleryModal}>
                    <Plus size={16} /> Add Campus Photo
                  </button>
                </div>
              </div>

              {gallerySuccess && (
                <div className="admin-alert admin-alert-success">
                  <CheckCircle2 size={18} />
                  <span>{gallerySuccess}</span>
                  <button className="alert-close" onClick={() => setGallerySuccess(null)}><X size={14} /></button>
                </div>
              )}

              <div className="gallery-admin-grid">
                {galleryPhotos.map((item, index) => (
                  <div key={item.id || index} className={`gallery-admin-card ${item.is_active === false ? 'inactive' : ''}`}>
                    <div className="gallery-card-img-wrap">
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="gallery-card-img"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80'; }}
                      />
                      <span className="gallery-cat-badge">{item.category || 'Campus'}</span>
                    </div>

                    <div className="gallery-card-body">
                      <h3 className="gallery-card-title">{item.title}</h3>
                      <p className="gallery-card-desc">{item.subtitle}</p>

                      <div className="slide-card-actions">
                        <button 
                          className={`btn-action-toggle ${item.is_active !== false ? 'active' : ''}`}
                          onClick={() => handleToggleGalleryActive(item)}
                        >
                          {item.is_active !== false ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                          <span>{item.is_active !== false ? 'Active' : 'Hidden'}</span>
                        </button>

                        <div className="crud-btn-group">
                          <button className="btn-action-edit" onClick={() => handleOpenEditGalleryModal(item)}>
                            <Edit3 size={15} />
                          </button>
                          <button className="btn-action-delete" onClick={() => handleDeleteGalleryPhoto(item.id, item.title)}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* =========================================================
              TAB: YOUTUBE VIDEO MANAGER
             ========================================================= */}
          {activeTab === 'youtube' && (
            <div className="tab-pane">
              <div className="view-header">
                <div>
                  <h2 className="view-title">YouTube Video Manager</h2>
                  <p className="view-subtitle">Manage the homepage YouTube video shown between Silver Jubilee and Campus Gallery.</p>
                </div>

                <div className="view-header-actions">
                  <button className="btn-refresh" onClick={fetchYouTubeSection} disabled={youtubeLoading}>
                    <RefreshCw size={16} className={youtubeLoading ? 'spin-icon' : ''} />
                  </button>
                </div>
              </div>

              {youtubeSuccess && (
                <div className="admin-alert admin-alert-success">
                  <CheckCircle2 size={18} />
                  <span>{youtubeSuccess}</span>
                  <button className="alert-close" onClick={() => setYoutubeSuccess(null)}><X size={14} /></button>
                </div>
              )}

              {youtubeError && (
                <div className="admin-alert admin-alert-danger">
                  <AlertCircle size={18} />
                  <div>
                    <strong>Database Notice: </strong>
                    <span>{youtubeError}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSaveYouTube} className="school-info-admin-form">

                {/* SECTION 1: CONTENT */}
                <div className="results-admin-section-block">
                  <div className="section-block-header">
                    <h3 className="section-block-title">
                      <Youtube size={18} className="text-primary-blue" />
                      Video Section Content
                    </h3>
                    <span className={`yt-status-pill ${youtubeForm.is_active ? 'live' : 'hidden'}`}>
                      {youtubeForm.is_active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                      {youtubeForm.is_active ? 'Live on Homepage' : 'Hidden from Homepage'}
                    </span>
                  </div>

                  <div className="form-grid-2col">
                    <div className="admin-input-group">
                      <label htmlFor="yt-title">Section Title *</label>
                      <input
                        id="yt-title"
                        type="text"
                        required
                        placeholder="Watch Our School"
                        value={youtubeForm.title}
                        onChange={(e) => setYoutubeForm({ ...youtubeForm, title: e.target.value })}
                      />
                    </div>

                    <div className="admin-input-group">
                      <label htmlFor="yt-active">Visibility Status</label>
                      <select
                        id="yt-active"
                        className="admin-select"
                        value={youtubeForm.is_active ? 'active' : 'inactive'}
                        onChange={(e) => setYoutubeForm({ ...youtubeForm, is_active: e.target.value === 'active' })}
                      >
                        <option value="active">Active — Visible on Homepage</option>
                        <option value="inactive">Inactive — Hidden</option>
                      </select>
                    </div>
                  </div>

                  <div className="admin-input-group">
                    <label htmlFor="yt-subtitle">Section Description</label>
                    <textarea
                      id="yt-subtitle"
                      rows={2}
                      placeholder="Discover life at Carmel through our videos."
                      value={youtubeForm.subtitle}
                      onChange={(e) => setYoutubeForm({ ...youtubeForm, subtitle: e.target.value })}
                    />
                  </div>
                </div>

                {/* SECTION 2: VIDEO SOURCE + PREVIEW */}
                <div className="results-admin-section-block">
                  <div className="section-block-header">
                    <h3 className="section-block-title">
                      <Play size={18} className="text-primary-blue" />
                      Video Source
                    </h3>
                    <span className="section-block-hint">Paste a YouTube link — the thumbnail updates automatically</span>
                  </div>

                  <div className="yt-source-layout">
                    <div className="yt-source-fields">
                      <div className="admin-input-group">
                        <label htmlFor="yt-url">YouTube Video URL</label>
                        <input
                          id="yt-url"
                          type="url"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={youtubeForm.youtube_url}
                          onChange={(e) => setYoutubeForm({ ...youtubeForm, youtube_url: e.target.value })}
                        />
                        <span className="section-block-hint">
                          Supports youtube.com/watch, youtu.be, youtube.com/embed, and youtube.com/shorts links.
                        </span>
                      </div>

                      {youtubeForm.youtube_url && !extractPreviewId(youtubeForm.youtube_url) && (
                        <div className="admin-alert admin-alert-danger" style={{ margin: 0 }}>
                          <AlertCircle size={16} />
                          <span>URL not recognized as a valid YouTube link.</span>
                        </div>
                      )}
                    </div>

                    <div className="yt-preview-col">
                      <span className="yt-preview-label-top">Live Homepage Preview</span>
                      {extractPreviewId(youtubeForm.youtube_url) ? (
                        <div className="youtube-admin-preview">
                          <img
                            src={`https://img.youtube.com/vi/${extractPreviewId(youtubeForm.youtube_url)}/hqdefault.jpg`}
                            alt="YouTube thumbnail preview"
                          />
                          <span className="yt-play-badge"><Play size={20} fill="#fff" /></span>
                          <span className="preview-label">Homepage Thumbnail</span>
                        </div>
                      ) : (
                        <div className="youtube-admin-preview empty">
                          <Youtube size={32} />
                          <span>No video linked yet</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="school-info-submit-bar">
                  <button type="submit" className="btn-admin-primary btn-large-submit" disabled={formSubmitting}>
                    {formSubmitting ? (
                      <>
                        <span className="btn-spinner"></span> Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} /> Save YouTube Settings
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          


        {activeTab === 'testimonials' && (
  <div className="tab-pane">
    <div className="view-header">
      <div>
        <h2 className="view-title">Testimonials Manager</h2>
        <p className="view-subtitle">Manage the Alumni page's Alumni & Parent YouTube testimonial videos.</p>
      </div>
      <button className="btn-refresh" onClick={fetchTestimonials} disabled={testimonialsLoading}>
        <RefreshCw size={16} className={testimonialsLoading ? 'spin-icon' : ''} />
      </button>
    </div>

    {testimonialsSuccess && (
      <div className="admin-alert admin-alert-success">
        <CheckCircle2 size={18} /><span>{testimonialsSuccess}</span>
        <button className="alert-close" onClick={() => setTestimonialsSuccess(null)}><X size={14} /></button>
      </div>
    )}
    {testimonialsError && (
      <div className="admin-alert admin-alert-danger">
        <AlertCircle size={18} /><span>{testimonialsError}</span>
      </div>
    )}

    <div className="school-info-admin-form">
      {[
        { key: 'alumni', form: testimonialAlumniForm, setForm: setTestimonialAlumniForm },
        { key: 'parent', form: testimonialParentForm, setForm: setTestimonialParentForm }
      ].map(({ key, form, setForm }) => {
        const vid = extractPreviewId(form.youtube_url);
        return (
          <div className="results-admin-section-block" key={key}>
            <div className="section-block-header">
              <h3 className="section-block-title">
                <Youtube size={18} className="text-primary-blue" />
                {key === 'alumni' ? 'Alumni Testimonial Video' : 'Parent Testimonial Video'}
              </h3>
              <span className={`yt-status-pill ${form.is_active ? 'live' : 'hidden'}`}>
                {form.is_active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                {form.is_active ? 'Live on Alumni Page' : 'Hidden'}
              </span>
            </div>

            <div className="form-grid-2col">
              <div className="admin-input-group">
                <label htmlFor={`test-${key}-title`}>Title *</label>
                <input
                  id={`test-${key}-title`}
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="admin-input-group">
                <label htmlFor={`test-${key}-active`}>Visibility Status</label>
                <select
                  id={`test-${key}-active`}
                  className="admin-select"
                  value={form.is_active ? 'active' : 'inactive'}
                  onChange={(e) => setForm({ ...form, is_active: e.target.value === 'active' })}
                >
                  <option value="active">Active — Visible on Alumni Page</option>
                  <option value="inactive">Inactive — Hidden</option>
                </select>
              </div>
            </div>

            <div className="admin-input-group">
              <label htmlFor={`test-${key}-subtitle`}>Subtitle</label>
              <input
                id={`test-${key}-subtitle`}
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              />
            </div>

            <div className="yt-source-layout">
              <div className="yt-source-fields">
                <div className="admin-input-group">
                  <label htmlFor={`test-${key}-url`}>YouTube Video URL</label>
                  <input
                    id={`test-${key}-url`}
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={form.youtube_url}
                    onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
                  />
                  <span className="section-block-hint">
                    Supports youtube.com/watch, youtu.be, youtube.com/embed, and youtube.com/shorts links.
                  </span>
                </div>
                {form.youtube_url && !vid && (
                  <div className="admin-alert admin-alert-danger" style={{ margin: 0 }}>
                    <AlertCircle size={16} />
                    <span>URL not recognized as a valid YouTube link.</span>
                  </div>
                )}
              </div>

              <div className="yt-preview-col">
                <span className="yt-preview-label-top">Live Alumni Page Preview</span>
                {vid ? (
                  <div className="youtube-admin-preview">
                    <img src={`https://img.youtube.com/vi/${vid}/hqdefault.jpg`} alt="Preview" />
                    <span className="yt-play-badge"><Play size={20} fill="#fff" /></span>
                    <span className="preview-label">{form.title}</span>
                  </div>
                ) : (
                  <div className="youtube-admin-preview empty">
                    <Youtube size={32} />
                    <span>No video linked yet</span>
                  </div>
                )}
              </div>
            </div>

            <div className="school-info-submit-bar">
              <button type="button" className="btn-admin-primary btn-large-submit" disabled={formSubmitting} onClick={() => handleSaveTestimonial(key)}>
                {formSubmitting ? (
                  <><span className="btn-spinner"></span> Saving...</>
                ) : (
                  <><CheckCircle2 size={18} /> Save {key === 'alumni' ? 'Alumni' : 'Parent'} Testimonial</>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}
          {/* =========================================================
              TAB 6: HERO CAROUSEL MANAGER (Limit: 5)
             ========================================================= */}
          {activeTab === 'carousel' && (
            <div className="tab-pane">
              <div className="view-header">
                <div>
                  <h2 className="view-title">Hero Carousel Manager</h2>
                  <p className="view-subtitle">Add, edit and arrange banner slides on the home page (Limit: maximum {MAX_CAROUSEL_SLIDES} slides).</p>
                </div>

                <div className="view-header-actions">
                  <button className="btn-refresh" onClick={fetchSlides} disabled={slidesLoading}>
                    <RefreshCw size={16} className={slidesLoading ? 'spin-icon' : ''} />
                  </button>

                  <button 
                    className="btn-admin-primary"
                    onClick={handleOpenAddSlideModal}
                    disabled={slides.length >= MAX_CAROUSEL_SLIDES}
                  >
                    <Plus size={16} /> Add Slide ({slides.length}/{MAX_CAROUSEL_SLIDES})
                  </button>
                </div>
              </div>

              {slidesSuccess && (
                <div className="admin-alert admin-alert-success">
                  <CheckCircle2 size={18} />
                  <span>{slidesSuccess}</span>
                  <button className="alert-close" onClick={() => setSlidesSuccess(null)}><X size={14} /></button>
                </div>
              )}

              <div className="slides-grid">
                {slides.map((slide, index) => (
                  <div key={slide.id || index} className={`slide-admin-card ${slide.is_active === false ? 'inactive' : ''}`}>
                    <div className="slide-card-img-wrap">
                      <img src={slide.image_url} alt={slide.title} className="slide-card-img" />
                      <div className="slide-card-order-badge">Slide #{index + 1}</div>
                    </div>

                    <div className="slide-card-body">
                      <span className="slide-card-tag">{slide.tag}</span>
                      <h3 className="slide-card-title">{slide.title}</h3>
                      <p className="slide-card-subtitle">{slide.subtitle}</p>

                      <div className="slide-card-actions">
                        <button 
                          className={`btn-action-toggle ${slide.is_active !== false ? 'active' : ''}`}
                          onClick={() => handleToggleSlideActive(slide)}
                        >
                          {slide.is_active !== false ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                          <span>{slide.is_active !== false ? 'Active' : 'Inactive'}</span>
                        </button>

                        <div className="crud-btn-group">
                          <button className="btn-action-edit" onClick={() => handleOpenEditSlideModal(slide)}>
                            <Edit3 size={15} /> Edit
                          </button>
                          <button className="btn-action-delete" onClick={() => handleDeleteSlide(slide.id, slide.title)}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================
              TAB 7: HOME POPUP BANNER
             ========================================================= */}
          {activeTab === 'banner' && (
            <div className="tab-pane">
              <div className="view-header">
                <div>
                  <h2 className="view-title">Home Popup Banner Manager</h2>
                  <p className="view-subtitle">Control the popup shown when a visitor first opens the website (Limit: maximum {MAX_HOME_BANNERS} banners). Each banner is either a custom poster image, or a trigger that opens the Academic Toppers Announcement (managed in the Academic Results tab).</p>
                </div>

                <div className="view-header-actions">
                  <button className="btn-refresh" onClick={fetchBanners} disabled={bannersLoading}>
                    <RefreshCw size={16} className={bannersLoading ? 'spin-icon' : ''} />
                  </button>

                  <button 
                    className="btn-admin-primary"
                    onClick={handleOpenAddBannerModal}
                    disabled={banners.length >= MAX_HOME_BANNERS}
                  >
                    <Plus size={16} /> Add Banner ({banners.length}/{MAX_HOME_BANNERS})
                  </button>
                </div>
              </div>

              {bannersError && (
                <div className="admin-alert admin-alert-danger">
                  <AlertCircle size={18} />
                  <span>{bannersError}</span>
                </div>
              )}

              {bannersSuccess && (
                <div className="admin-alert admin-alert-success">
                  <CheckCircle2 size={18} />
                  <span>{bannersSuccess}</span>
                  <button className="alert-close" onClick={() => setBannersSuccess(null)}><X size={14} /></button>
                </div>
              )}

              <div className="slides-grid">
                {banners.map((banner, index) => (
                  <div key={banner.id || index} className={`slide-admin-card ${banner.is_active === false ? 'inactive' : ''}`}>
                    <div className="slide-card-img-wrap">
                      {banner.banner_type === 'toppers' ? (
                        <div className="slide-card-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', color: '#94a3b8' }}>
                          <Trophy size={32} />
                        </div>
                      ) : (
                        <img src={banner.image_url} alt={banner.title} className="slide-card-img" />
                      )}
                      <div className="slide-card-order-badge">Banner #{index + 1}</div>
                    </div>

                    <div className="slide-card-body">
                      <span className="slide-card-tag">
                        {banner.banner_type === 'toppers' ? 'ACADEMIC TOPPERS ANNOUNCEMENT' : 'CUSTOM POSTER'}
                      </span>
                      <h3 className="slide-card-title">
                        {banner.banner_type === 'toppers' ? 'Toppers Announcement Popup' : (banner.title || 'Untitled Poster')}
                      </h3>
                      <p className="slide-card-subtitle">
                        {banner.banner_type === 'toppers'
                          ? 'Shows the live Academic Toppers popup content.'
                          : banner.subtitle}
                      </p>

                      <div className="slide-card-actions">
                        <button 
                          className={`btn-action-toggle ${banner.is_active !== false ? 'active' : ''}`}
                          onClick={() => handleToggleBannerActive(banner)}
                        >
                          {banner.is_active !== false ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                          <span>{banner.is_active !== false ? 'Active' : 'Inactive'}</span>
                        </button>

                        <div className="crud-btn-group">
                          <button className="btn-action-edit" onClick={() => handleOpenEditBannerModal(banner)}>
                            <Edit3 size={15} /> Edit
                          </button>
                          <button className="btn-action-delete" onClick={() => handleDeleteBanner(banner.id, banner.title)}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {banners.length === 0 && !bannersLoading && (
                <div className="content-management-box">
                  <div className="empty-state-notice">
                    <Megaphone size={44} className="empty-icon" />
                    <h4>No Home Popup Banners Yet</h4>
                    <p>Nothing will show when the site loads. Click "Add Banner" to publish a poster or enable the Toppers announcement.</p>
                    <button className="btn-admin-primary" onClick={handleOpenAddBannerModal}>
                      <Plus size={16} /> Add First Banner
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              TAB: FACULTY MANAGER
             ========================================================= */}
          {activeTab === 'faculty' && (
            <div className="tab-pane">
              <div className="view-header">
                <div>
                  <h2 className="view-title">Faculty Manager</h2>
                  <p className="view-subtitle">Add, edit, and manage teacher records shown in the Academics → Faculty table on the website.</p>
                </div>

                <div className="view-header-actions">
                  <button className="btn-refresh" onClick={fetchFaculty} disabled={facultyLoading}>
                    <RefreshCw size={16} className={facultyLoading ? 'spin-icon' : ''} />
                  </button>
                  <button className="btn-admin-primary" onClick={handleOpenAddFacultyModal}>
                    <Plus size={16} /> Add Teacher
                  </button>
                </div>
              </div>

              {facultySuccess && (
                <div className="admin-alert admin-alert-success">
                  <CheckCircle2 size={18} />
                  <span>{facultySuccess}</span>
                  <button className="alert-close" onClick={() => setFacultySuccess(null)}><X size={14} /></button>
                </div>
              )}

              {facultyError && (
                <div className="admin-alert admin-alert-danger">
                  <AlertCircle size={18} />
                  <div>
                    <strong>Database Notice: </strong>
                    <span>{facultyError}</span>
                  </div>
                </div>
              )}

              {facultyList.length === 0 ? (
                <div className="content-management-box">
                  <div className="empty-state-notice">
                    <Users size={44} className="empty-icon" />
                    <h4>No Faculty Records Added</h4>
                    <p>Click "Add Teacher" to add your first faculty record.</p>
                    <button className="btn-admin-primary" onClick={handleOpenAddFacultyModal}>
                      <Plus size={16} /> Add First Teacher
                    </button>
                  </div>
                </div>
              ) : (
                <div className="applications-table-card">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>S.NO</th>
                        <th>Photo</th>
                        
                        <th>Name of the Teacher</th>
                        <th>Qualification</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {facultyList.map((f, idx) => (
                        <tr key={f.id || idx}>
                          <td>{f.s_no || idx + 1}</td>
                        <td>
                      <img
                        src={f.photo_url || DEFAULT_FACULTY_AVATAR}
                        alt={f.name}
                        loading="lazy"
                        onError={(e) => { e.target.src = DEFAULT_FACULTY_AVATAR; }}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    </td>
                          
                          <td><strong>{f.name}</strong></td>
                          <td>{f.qualification}</td>
                          <td>
                            <button 
                              className={`btn-action-toggle ${f.is_active !== false ? 'active' : ''}`}
                              onClick={() => handleToggleFacultyActive(f)}
                            >
                              {f.is_active !== false ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                              <span>{f.is_active !== false ? 'Active' : 'Hidden'}</span>
                            </button>
                          </td>
                          <td>
                            <div className="crud-btn-group">
                              <button className="btn-action-edit" onClick={() => handleOpenEditFacultyModal(f)}>
                                <Edit3 size={15} />
                              </button>
                              <button className="btn-action-delete" onClick={() => handleDeleteFaculty(f.id, f.name)}>
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              TAB 9: OVERVIEW & STATS
             ========================================================= */}
          {activeTab === 'overview' && (
          <div className="tab-pane">
            <div className="view-header">
              <div>
                <h2 className="view-title">Admin Console Overview</h2>
                <p className="view-subtitle">Quick metrics and real-time dynamic website statistics.</p>
              </div>
            </div>

            <div className="overview-cards-grid">

              {/* 1. School Info & Contacts */}
              <div className="stat-card" onClick={() => setActiveTab('school_info')}>
                <div className="stat-icon-wrap icon-blue"><Settings size={24} /></div>
                <div className="stat-info">
                  <span className="stat-label">School Info</span>
                  <h3 className="stat-value">{globalSchoolInfo?.school_name || "Carmel's Schools"}</h3>
                  <p className="stat-desc">Phones, emails, office timings & maps</p>
                </div>
                <ArrowUpRight size={18} className="stat-arrow" />
              </div>

              {/* 2. Home Popup Banner */}
              <div className="stat-card" onClick={() => setActiveTab('banner')}>
                <div className="stat-icon-wrap icon-gold"><Megaphone size={24} /></div>
                <div className="stat-info">
                  <span className="stat-label">Home Popup Banner</span>
                  <h3 className="stat-value">{banners.length} / {MAX_HOME_BANNERS} Banners</h3>
                  <p className="stat-desc">Popup shown on first site visit</p>
                </div>
                <ArrowUpRight size={18} className="stat-arrow" />
              </div>

              {/* 3. Hero Carousel */}
              <div className="stat-card" onClick={() => setActiveTab('carousel')}>
                <div className="stat-icon-wrap icon-gold"><Layers size={24} /></div>
                <div className="stat-info">
                  <span className="stat-label">Hero Carousel</span>
                  <h3 className="stat-value">{slides.length} / {MAX_CAROUSEL_SLIDES} Slides</h3>
                  <p className="stat-desc">Home page rotating banners</p>
                </div>
                <ArrowUpRight size={18} className="stat-arrow" />
              </div>

              {/* 4. YouTube Video */}
              <div className="stat-card" onClick={() => setActiveTab('youtube')}>
                <div className="stat-icon-wrap icon-blue"><Youtube size={24} /></div>
                <div className="stat-info">
                  <span className="stat-label">YouTube Video</span>
                  <h3 className="stat-value">{youtubeForm.is_active ? 'Live' : 'Hidden'}</h3>
                  <p className="stat-desc">Homepage video section status</p>
                </div>
                <ArrowUpRight size={18} className="stat-arrow" />
              </div>

              {/* 5. News, Blog & Awards */}
              <div className="stat-card" onClick={() => setActiveTab('media')}>
                <div className="stat-icon-wrap icon-blue"><Newspaper size={24} /></div>
                <div className="stat-info">
                  <span className="stat-label">News & Blog</span>
                  <h3 className="stat-value">{mediaPosts.length} Posts</h3>
                  <p className="stat-desc">Articles & student achievements</p>
                </div>
                <ArrowUpRight size={18} className="stat-arrow" />
              </div>

              {/* 6. Events & Celebrations */}
              <div className="stat-card" onClick={() => setActiveTab('events')}>
                <div className="stat-icon-wrap icon-gold"><Calendar size={24} /></div>
                <div className="stat-info">
                  <span className="stat-label">Events & Celebrations</span>
                  <h3 className="stat-value">{eventsList.filter((e) => e.is_active !== false).length} Published</h3>
                  <p className="stat-desc">Upcoming school events and celebrations</p>
                </div>
                <ArrowUpRight size={18} className="stat-arrow" />
              </div>

              {/* 7. Campus Photo Gallery */}
              <div className="stat-card" onClick={() => setActiveTab('gallery')}>
                <div className="stat-icon-wrap icon-purple"><Camera size={24} /></div>
                <div className="stat-info">
                  <span className="stat-label">Campus Gallery</span>
                  <h3 className="stat-value">{galleryPhotos.length} Photos</h3>
                  <p className="stat-desc">Campus infrastructure & lab views</p>
                </div>
                <ArrowUpRight size={18} className="stat-arrow" />
              </div>

              {/* 7. Academic Results */}
              <div className="stat-card" onClick={() => setActiveTab('results')}>
                <div className="stat-icon-wrap icon-gold"><Trophy size={24} /></div>
                <div className="stat-info">
                  <span className="stat-label">Academic Results</span>
                  <h3 className="stat-value">{toppers.length} / {MAX_TOPPER_CARDS} Toppers</h3>
                  <p className="stat-desc">Board pass rate metrics & top rank holders</p>
                </div>
                <ArrowUpRight size={18} className="stat-arrow" />
              </div>

              {/* 8. Faculty */}
              <div className="stat-card" onClick={() => setActiveTab('faculty')}>
                <div className="stat-icon-wrap icon-purple"><Users size={24} /></div>
                <div className="stat-info">
                  <span className="stat-label">Faculty</span>
                  <h3 className="stat-value">{facultyList.length} Teachers</h3>
                  <p className="stat-desc">Staff records shown on Academics page</p>
                </div>
                <ArrowUpRight size={18} className="stat-arrow" />
              </div>

              {/* 9. Careers & Vacancies */}
              <div className="stat-card" onClick={() => setActiveTab('careers')}>
                <div className="stat-icon-wrap icon-purple"><Briefcase size={24} /></div>
                <div className="stat-info">
                  <span className="stat-label">Careers</span>
                  <h3 className="stat-value">{careersList.length} Vacancies</h3>
                  <p className="stat-desc">{applicationsList.length} Received Applications</p>
                </div>
                <ArrowUpRight size={18} className="stat-arrow" />
              </div>

              {/* 10. Testimonials */}
              <div className="stat-card" onClick={() => setActiveTab('testimonials')}>
                <div className="stat-icon-wrap icon-blue"><Youtube size={24} /></div>
                <div className="stat-info">
                  <span className="stat-label">Testimonials</span>
                  <h3 className="stat-value">
                    {[testimonialAlumni, testimonialParent].filter((t) => t?.is_active).length} / 2 Live
                  </h3>
                  <p className="stat-desc">Alumni & Parent testimonial videos</p>
                </div>
                <ArrowUpRight size={18} className="stat-arrow" />
              </div>

              {/* 11. Admission Applications */}
              <div className="stat-card" onClick={() => setActiveTab('admissions')}>
                <div className="stat-icon-wrap icon-blue"><School size={24} /></div>
                <div className="stat-info">
                  <span className="stat-label">Admission Applications</span>
                  <h3 className="stat-value">{icseAdmissions.length + matricAdmissions.length} Applications</h3>
                  <p className="stat-desc">{icseAdmissions.length} ICSE / ISC · {matricAdmissions.length} Matriculation</p>
                </div>
                <ArrowUpRight size={18} className="stat-arrow" />
              </div>

              {/* 12. Enquiries */}
              <div className="stat-card" onClick={() => setActiveTab('enquiries')}>
                <div className="stat-icon-wrap icon-gold"><Send size={24} /></div>
                <div className="stat-info">
                  <span className="stat-label">Enquiries</span>
                  <h3 className="stat-value">
                    {enquiries.filter((e) => e.status === 'new').length} New
                  </h3>
                  <p className="stat-desc">{enquiries.length} total received</p>
                </div>
                <ArrowUpRight size={18} className="stat-arrow" />
              </div>

            </div>
          </div>
        )}

          {/* =========================================================
              TAB 10: DATABASE DIAGNOSTICS
             ========================================================= */}
          {SHOW_DEV_TOOLS && activeTab === 'db_status' && (
            <div className="tab-pane">
              <div className="view-header">
                <div>
                  <h2 className="view-title">Supabase Database Diagnostics</h2>
                  <p className="view-subtitle">Live schema, tables and storage bucket status.</p>
                </div>
              </div>

              <div className="db-status-card">
                <div className="status-row"><span className="label">Supabase URL:</span><code className="val">https://ypsijjhcmfbyepfczxqj.supabase.co</code></div>
                <div className="status-row"><span className="label">School Info:</span><code className="val">public.school_info</code></div>
                <div className="status-row"><span className="label">Careers Jobs:</span><code className="val">public.career_jobs</code></div>
                <div className="status-row"><span className="label">Job Applications:</span><code className="val">public.career_applications</code></div>
                <div className="status-row"><span className="label">Result Stats:</span><code className="val">public.result_stats</code></div>
                <div className="status-row"><span className="label">Academic Toppers:</span><code className="val">public.academic_toppers</code></div>
                <div className="status-row"><span className="label">Media Posts:</span><code className="val">public.media_posts</code></div>
                <div className="status-row"><span className="label">Campus Gallery:</span><code className="val">public.campus_gallery</code></div>
                <div className="status-row"><span className="label">Carousel Slides:</span><code className="val">public.carousel_slides</code></div>
                <div className="status-row"><span className="label">Storage Bucket:</span><code className="val">carmel_media (public)</code></div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* =========================================================
          MODAL 1: ADD / EDIT CAREER JOB
         ========================================================= */}
      {isJobModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsJobModalOpen(false)}>
          <div className="admin-slide-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="slide-modal-header">
              <div>
                <h3>{editingJob ? 'Edit Career Opening' : 'Post New Career Opening'}</h3>
                <p>Configure position title, department, job type, and responsibilities.</p>
              </div>
              <button className="slide-modal-close" onClick={() => setIsJobModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="slide-modal-form">
              <div className="form-grid-2col">
                <div className="admin-input-group">
                  <label htmlFor="job-title">Job Position Title *</label>
                  <input
                    id="job-title"
                    type="text"
                    required
                    placeholder="e.g. Senior PGT Physics / Chemistry Educator"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  />
                </div>

                <div className="admin-input-group">
                  <label htmlFor="job-dept">Department *</label>
                  <input
                    id="job-dept"
                    type="text"
                    required
                    placeholder="e.g. Higher Secondary Department / Pre-Primary"
                    value={jobForm.department}
                    onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-3col">
                <div className="admin-input-group">
                  <label htmlFor="job-type">Job Type</label>
                  <select
                    id="job-type"
                    className="admin-select"
                    value={jobForm.job_type}
                    onChange={(e) => setJobForm({ ...jobForm, job_type: e.target.value })}
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Visiting Faculty">Visiting Faculty</option>
                  </select>
                </div>

                <div className="admin-input-group">
                  <label htmlFor="job-exp">Experience Required</label>
                  <input
                    id="job-exp"
                    type="text"
                    placeholder="e.g. 2+ Years / Fresher"
                    value={jobForm.experience}
                    onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                  />
                </div>

                <div className="admin-input-group">
                  <label htmlFor="job-loc">Campus Location</label>
                  <input
                    id="job-loc"
                    type="text"
                    placeholder="Trichy, TN"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-input-group">
                <label htmlFor="job-desc">Job Description & Responsibilities *</label>
                <textarea
                  id="job-desc"
                  rows={3}
                  required
                  placeholder="Seeking passionate educators with strong domain knowledge to teach and mentor students..."
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                />
              </div>

              <div className="admin-input-group">
                <label htmlFor="job-req">Candidate Requirements / Eligibility</label>
                <textarea
                  id="job-req"
                  rows={2}
                  placeholder="e.g. M.Sc / M.A with B.Ed, good English communication, prior CBSE / Matric experience..."
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                />
              </div>

              <div className="form-grid-2col">
                <div className="admin-input-group">
                  <label htmlFor="job-order">Display Sequence Order</label>
                  <input
                    id="job-order"
                    type="number"
                    min="1"
                    value={jobForm.display_order}
                    onChange={(e) => setJobForm({ ...jobForm, display_order: e.target.value })}
                  />
                </div>

                <div className="admin-checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={jobForm.is_active}
                      onChange={(e) => setJobForm({ ...jobForm, is_active: e.target.checked })}
                    />
                    <span>Active and Visible on Careers Page</span>
                  </label>
                </div>
              </div>

              <div className="slide-modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsJobModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary" disabled={formSubmitting}>
                  {formSubmitting ? 'Saving...' : editingJob ? 'Update Vacancy' : 'Publish Opening'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: EDIT STAT METRIC MODAL
         ========================================================= */}
      {isStatModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsStatModalOpen(false)}>
          <div className="admin-slide-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="slide-modal-header">
              <div>
                <h3>Edit Academic Performance Metric</h3>
                <p>Update highlight number, title label, and subtitle description.</p>
              </div>
              <button className="slide-modal-close" onClick={() => setIsStatModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveStat} className="slide-modal-form">
              <div className="form-grid-2col">
                <div className="admin-input-group">
                  <label htmlFor="stat-number">Stat Number / Score (e.g. 100%, 588 / 600) *</label>
                  <input
                    id="stat-number"
                    type="text"
                    required
                    placeholder="100%"
                    value={statForm.stat_number}
                    onChange={(e) => setStatForm({ ...statForm, stat_number: e.target.value })}
                  />
                </div>

                <div className="admin-input-group">
                  <label htmlFor="stat-label">Title / Metric Label *</label>
                  <input
                    id="stat-label"
                    type="text"
                    required
                    placeholder="Board Pass Percentage"
                    value={statForm.label}
                    onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-input-group">
                <label htmlFor="stat-sub">Subtitle Description *</label>
                <textarea
                  id="stat-sub"
                  rows={2}
                  required
                  placeholder="100% Pass Rate in Std X & Std XII Examinations"
                  value={statForm.subtitle}
                  onChange={(e) => setStatForm({ ...statForm, subtitle: e.target.value })}
                />
              </div>

              <div className="slide-modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsStatModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary" disabled={formSubmitting}>
                  {formSubmitting ? 'Updating...' : 'Save Metric'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 3: ADD / EDIT TOPPER CARD (LIMIT: 5)
         ========================================================= */}
      {isTopperModalOpen && !cropperOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsTopperModalOpen(false)}>
          <div className="admin-slide-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="slide-modal-header">
              <div>
                <h3>{editingTopper ? 'Edit Academic Topper Card' : 'Add Top Academic Achiever Card'}</h3>
                <p>Configure student rank, marks, percentage, photo, and centum subjects.</p>
              </div>
              <button className="slide-modal-close" onClick={() => setIsTopperModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTopper} className="slide-modal-form">
              <div className="form-grid-3col">
                <div className="admin-input-group">
                  <label htmlFor="topper-rank">Rank Label *</label>
                  <input
                    id="topper-rank"
                    type="text"
                    required
                    placeholder="Rank 1 / School First"
                    value={topperForm.rank}
                    onChange={(e) => setTopperForm({ ...topperForm, rank: e.target.value })}
                  />
                </div>

                <div className="admin-input-group">
                  <label htmlFor="topper-pct">Percentage *</label>
                  <input
                    id="topper-pct"
                    type="text"
                    required
                    placeholder="98.0%"
                    value={topperForm.percentage}
                    onChange={(e) => setTopperForm({ ...topperForm, percentage: e.target.value })}
                  />
                </div>

                <div className="admin-input-group">
                  <label htmlFor="topper-badge">Badge Color</label>
                  <select
                    id="topper-badge"
                    className="admin-select"
                    value={topperForm.badge_color}
                    onChange={(e) => setTopperForm({ ...topperForm, badge_color: e.target.value })}
                  >
                    <option value="gold">Gold Badge</option>
                    <option value="silver">Silver Badge</option>
                    <option value="bronze">Bronze Badge</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="admin-input-group">
                  <label htmlFor="topper-name">Student Name / Title *</label>
                  <input
                    id="topper-name"
                    type="text"
                    required
                    placeholder="Std XII Biology Stream Topper / R. Priya"
                    value={topperForm.name}
                    onChange={(e) => setTopperForm({ ...topperForm, name: e.target.value })}
                  />
                </div>

                <div className="admin-input-group">
                  <label htmlFor="topper-score">Total Score (e.g. 588 / 600) *</label>
                  <input
                    id="topper-score"
                    type="text"
                    required
                    placeholder="588 / 600 or 494 / 500"
                    value={topperForm.total_score}
                    onChange={(e) => setTopperForm({ ...topperForm, total_score: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-input-group">
                <label htmlFor="topper-stream">Academic Stream / Class *</label>
                <input
                  id="topper-stream"
                  type="text"
                  required
                  placeholder="Biology & Physics Stream / Matriculation Board Std X"
                  value={topperForm.stream}
                  onChange={(e) => setTopperForm({ ...topperForm, stream: e.target.value })}
                />
              </div>

              {/* Student Photo Upload */}
              <div className="admin-input-group">
                <label>Student Photo / Avatar (Optional)</label>
                <div className="image-upload-flex">
                  <label className="btn-file-upload">
                    <Crop size={16} />
                    <span>Upload & Crop Photo</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleOpenImageCropper(e, 'avatar')}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <span className="or-divider">OR</span>
                  <input
                    type="url"
                    placeholder="Paste photo URL"
                    value={topperForm.photo_url}
                    onChange={(e) => setTopperForm({ ...topperForm, photo_url: e.target.value })}
                    className="input-url"
                  />
                </div>

                {topperForm.photo_url && (
                  <div className="topper-live-preview">
                    <img src={topperForm.photo_url} alt="Topper" />
                    <span className="preview-label">Student Photo Preview</span>
                  </div>
                )}
              </div>

              <div className="admin-input-group">
                <label htmlFor="topper-centums">Centum Scores 100/100 (Enter each subject on a new line)</label>
                <textarea
                  id="topper-centums"
                  rows={3}
                  placeholder="Mathematics: 100/100&#10;Biology: 100/100&#10;Chemistry: 100/100"
                  value={topperForm.centums}
                  onChange={(e) => setTopperForm({ ...topperForm, centums: e.target.value })}
                />
              </div>

              <div className="form-grid-2col">
                <div className="admin-input-group">
                  <label htmlFor="topper-order">Display Sequence Order</label>
                  <input
                    id="topper-order"
                    type="number"
                    min="1"
                    max={MAX_TOPPER_CARDS}
                    value={topperForm.display_order}
                    onChange={(e) => setTopperForm({ ...topperForm, display_order: e.target.value })}
                  />
                </div>

                <div className="admin-checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={topperForm.is_active}
                      onChange={(e) => setTopperForm({ ...topperForm, is_active: e.target.checked })}
                    />
                    <span>Publish live to Results page</span>
                  </label>
                </div>
              </div>

              <div className="slide-modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsTopperModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary" disabled={formSubmitting}>
                  {formSubmitting ? 'Saving...' : editingTopper ? 'Update Topper Card' : 'Save & Publish Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 4: ADD / EDIT MEDIA POST
         ========================================================= */}
      {isEventModalOpen && !cropperOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsEventModalOpen(false)}>
          <div className="admin-slide-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="slide-modal-header">
              <div>
                <h3>{editingEvent ? 'Edit Event / Celebration' : 'Add Event / Celebration'}</h3>
                <p>Published events appear automatically on the home showcase and Events page.</p>
              </div>
              <button className="slide-modal-close" onClick={() => setIsEventModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveEvent} className="slide-modal-form">
              <div className="form-grid-2col">
                <div className="admin-input-group"><label>Event / Celebration Title *</label><input required value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} placeholder="e.g. Founder’s Day & Cultural Festival" /></div>
                <div className="admin-input-group"><label>Date *</label><input required value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} placeholder="10 DECEMBER 2026" /></div>
              </div>
              <div className="form-grid-2col">
                <div className="admin-input-group"><label>Time</label><input value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} placeholder="05:00 PM - 08:30 PM" /></div>
                <div className="admin-input-group"><label>Location</label><input value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} placeholder="Main Auditorium" /></div>
              </div>
              <div className="admin-input-group"><label>Description *</label><textarea required rows={4} value={eventForm.desc} onChange={(e) => setEventForm({ ...eventForm, desc: e.target.value })} placeholder="Short description shown on the event card." /></div>
              <div className="form-grid-2col">
                <div className="admin-input-group"><label>Image URL (optional)</label><input value={eventForm.image_url} onChange={(e) => setEventForm({ ...eventForm, image_url: e.target.value })} placeholder="https://.../event-image.jpg" /></div>
                <div className="admin-input-group"><label>Display Order</label><input type="number" min="1" value={eventForm.display_order} onChange={(e) => setEventForm({ ...eventForm, display_order: e.target.value })} /></div>
              </div>
              <label className="admin-checkbox-row"><input type="checkbox" checked={eventForm.is_active} onChange={(e) => setEventForm({ ...eventForm, is_active: e.target.checked })} /><span>Publish this event on the website</span></label>
              <div className="slide-modal-actions"><button type="button" className="btn-modal-cancel" onClick={() => setIsEventModalOpen(false)}>Cancel</button><button type="submit" className="btn-admin-primary" disabled={formSubmitting}>{formSubmitting ? 'Saving...' : (editingEvent ? 'Save Changes' : 'Publish Event')}</button></div>
            </form>
          </div>
        </div>
      )}

      {isMediaModalOpen && !cropperOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsMediaModalOpen(false)}>
          <div className="admin-slide-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="slide-modal-header">
              <div>
                <h3>{editingMediaItem ? 'Edit Article / Post' : 'Add New Article / Post'}</h3>
                <p>Publish to Blog Stories, News & Events, or Awards & Distinctions.</p>
              </div>
              <button className="slide-modal-close" onClick={() => setIsMediaModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveMediaPost} className="slide-modal-form">
              <div className="form-grid-3col">
                <div className="admin-input-group">
                  <label htmlFor="media-type">Post Section / Tab *</label>
                  <select
                    id="media-type"
                    className="admin-select"
                    value={mediaForm.type}
                    onChange={(e) => setMediaForm({ ...mediaForm, type: e.target.value })}
                  >
                    <option value="blog">Blog Story</option>
                    <option value="news">News & Event</option>
                    <option value="awards">Award & Achievement</option>
                  </select>
                </div>

                <div className="admin-input-group">
                  <label htmlFor="media-category">Category *</label>
                  <select
                    id="media-category"
                    className="admin-select"
                    value={mediaForm.category}
                    onChange={(e) => setMediaForm({ ...mediaForm, category: e.target.value })}
                  >
                    <option value="academics">Academics & Science</option>
                    <option value="sports">Sports & Judo</option>
                    <option value="cultural">Arts & Music</option>
                    <option value="celebrations">Festivals & Celebrations</option>
                  </select>
                </div>

                <div className="admin-input-group">
                  <label htmlFor="media-school">School / Campus</label>
                  <select
                    id="media-school"
                    className="admin-select"
                    value={mediaForm.school}
                    onChange={(e) => setMediaForm({ ...mediaForm, school: e.target.value })}
                  >
                    <option value="all">All Schools / Group</option>
                    <option value="matric">Carmel's Matriculation</option>
                    <option value="icse">Carmel's ICSE & ISC</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="admin-input-group">
                  <label htmlFor="media-title">Article Headline / Title *</label>
                  <input
                    id="media-title"
                    type="text"
                    required
                    placeholder="e.g. KREEDA 2026 - Annual Sports Meet"
                    value={mediaForm.title}
                    onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })}
                  />
                </div>

                <div className="admin-input-group">
                  <label htmlFor="media-date">Post Date *</label>
                  <input
                    id="media-date"
                    type="text"
                    required
                    placeholder="01 Mar 2026"
                    value={mediaForm.date}
                    onChange={(e) => setMediaForm({ ...mediaForm, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-input-group">
                <label htmlFor="media-desc">Short Summary (Displayed on Card) *</label>
                <textarea
                  id="media-desc"
                  rows={2}
                  required
                  value={mediaForm.description}
                  onChange={(e) => setMediaForm({ ...mediaForm, description: e.target.value })}
                />
              </div>

              <div className="admin-input-group">
                <label htmlFor="media-story">Full Story / Article Content (Displayed in Pop-up Modal)</label>
                <textarea
                  id="media-story"
                  rows={4}
                  value={mediaForm.story}
                  onChange={(e) => setMediaForm({ ...mediaForm, story: e.target.value })}
                />
              </div>

              <div className="admin-input-group">
                <label>Article Cover Image *</label>
                <div className="image-upload-flex">
                  <label className="btn-file-upload">
                    <Crop size={16} />
                    <span>Upload & Crop Image</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleOpenImageCropper(e, 'media')}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <span className="or-divider">OR</span>
                  <input
                    type="url"
                    placeholder="Paste image URL (https://...)"
                    value={mediaForm.image_url}
                    onChange={(e) => setMediaForm({ ...mediaForm, image_url: e.target.value })}
                    className="input-url"
                  />
                </div>
              </div>

              <div className="slide-modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsMediaModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary" disabled={formSubmitting}>
                  {formSubmitting ? 'Saving...' : editingMediaItem ? 'Update Post' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 5: ADD / EDIT CAMPUS GALLERY PHOTO
         ========================================================= */}
      {isGalleryModalOpen && !cropperOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsGalleryModalOpen(false)}>
          <div className="admin-slide-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="slide-modal-header">
              <div>
                <h3>{editingGalleryItem ? 'Edit Campus Photo' : 'Add New Campus Photo'}</h3>
                <p>Upload photo with uniform cropping, heading and subtitle.</p>
              </div>
              <button className="slide-modal-close" onClick={() => setIsGalleryModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveGalleryPhoto} className="slide-modal-form">
              <div className="form-grid-2col">
                <div className="admin-input-group">
                  <label htmlFor="gallery-title">Photo Title (Heading) *</label>
                  <input
                    id="gallery-title"
                    type="text"
                    required
                    value={galleryForm.title}
                    onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  />
                </div>

                <div className="admin-input-group">
                  <label htmlFor="gallery-cat">Category</label>
                  <select
                    id="gallery-cat"
                    className="admin-select"
                    value={galleryForm.category}
                    onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                  >
                    <option value="Campus">Campus Infrastructure</option>
                    <option value="Classrooms">Smart Classrooms</option>
                    <option value="Labs">Science & Computer Labs</option>
                    <option value="Sports">Sports & Grounds</option>
                    <option value="Library">Central Library</option>
                    <option value="Celebrations">Events & Celebrations</option>
                  </select>
                </div>
              </div>

              <div className="admin-input-group">
                <label htmlFor="gallery-subtitle">Description</label>
                <textarea
                  id="gallery-subtitle"
                  rows={2}
                  value={galleryForm.subtitle}
                  onChange={(e) => setGalleryForm({ ...galleryForm, subtitle: e.target.value })}
                />
              </div>

              <div className="admin-input-group">
                <label>Photo Image *</label>
                <div className="image-upload-flex">
                  <label className="btn-file-upload">
                    <Crop size={16} />
                    <span>Upload & Crop Photo</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleOpenImageCropper(e, 'gallery')}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <span className="or-divider">OR</span>
                  <input
                    type="url"
                    placeholder="Paste image URL (https://...)"
                    value={galleryForm.image_url}
                    onChange={(e) => setGalleryForm({ ...galleryForm, image_url: e.target.value })}
                    className="input-url"
                  />
                </div>
              </div>

              <div className="slide-modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsGalleryModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary" disabled={formSubmitting}>
                  {formSubmitting ? 'Saving...' : editingGalleryItem ? 'Update Photo' : 'Publish to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 6: ADD / EDIT CAROUSEL SLIDE
         ========================================================= */}
      {isSlideModalOpen && !cropperOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsSlideModalOpen(false)}>
          <div className="admin-slide-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="slide-modal-header">
              <div>
                <h3>{editingSlide ? 'Edit Carousel Slide' : 'Add New Carousel Slide'}</h3>
                <p>Configure banner tagline, heading, and description.</p>
              </div>
              <button className="slide-modal-close" onClick={() => setIsSlideModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="slide-modal-form">
              <div className="form-grid-2col">
                <div className="admin-input-group">
                  <label htmlFor="slide-tag">Tagline</label>
                  <input
                    id="slide-tag"
                    type="text"
                    required
                    value={slideForm.tag}
                    onChange={(e) => setSlideForm({ ...slideForm, tag: e.target.value })}
                  />
                </div>

                <div className="admin-input-group">
                  <label htmlFor="slide-btn-text">Button Text</label>
                  <input
                    id="slide-btn-text"
                    type="text"
                    value={slideForm.button_text}
                    onChange={(e) => setSlideForm({ ...slideForm, button_text: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-input-group">
                <label htmlFor="slide-title">Heading Title *</label>
                <input
                  id="slide-title"
                  type="text"
                  required
                  value={slideForm.title}
                  onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                />
              </div>

              <div className="admin-input-group">
                <label htmlFor="slide-subtitle">Description *</label>
                <textarea
                  id="slide-subtitle"
                  rows={3}
                  required
                  value={slideForm.subtitle}
                  onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                />
              </div>

              <div className="admin-input-group">
                <label>Banner Image *</label>
                <div className="image-upload-flex">
                  <label className="btn-file-upload">
                    <Crop size={16} />
                    <span>Upload & Adjust Banner</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleOpenImageCropper(e, 'carousel')}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <span className="or-divider">OR</span>
                  <input
                    type="url"
                    placeholder="Paste image URL (https://...)"
                    value={slideForm.image_url}
                    onChange={(e) => setSlideForm({ ...slideForm, image_url: e.target.value })}
                    className="input-url"
                  />
                </div>
              </div>

              <div className="slide-modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsSlideModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary" disabled={formSubmitting}>
                  {formSubmitting ? 'Saving...' : editingSlide ? 'Update Slide' : 'Publish Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isBannerModalOpen && !cropperOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsBannerModalOpen(false)}>
          <div className="admin-slide-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="slide-modal-header">
              <div>
                <h3>{editingBanner ? 'Edit Home Popup Banner' : 'Add New Home Popup Banner'}</h3>
                <p>Choose what visitors see when the site first loads.</p>
              </div>
              <button className="slide-modal-close" onClick={() => setIsBannerModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="slide-modal-form">
              <div className="admin-input-group">
                <label htmlFor="banner-type">Banner Type *</label>
                <select
                  id="banner-type"
                  className="admin-select"
                  value={bannerForm.banner_type}
                  onChange={(e) => setBannerForm({ ...bannerForm, banner_type: e.target.value })}
                >
                  <option value="poster">Custom Poster (image)</option>
                  <option value="toppers">Academic Toppers Announcement</option>
                </select>
              </div>

              {bannerForm.banner_type === 'toppers' ? (
                <div className="empty-state-notice" style={{ padding: '18px' }}>
                  <Trophy size={32} className="empty-icon" />
                  <p>This banner will display the Academic Toppers Announcement popup, using the photos and text managed in the <strong>Academic Results</strong> tab. No image needed here.</p>
                </div>
              ) : (
                <>
                  <div className="admin-input-group">
                    <label htmlFor="banner-title">Poster Title *</label>
                    <input
                      id="banner-title"
                      type="text"
                      required
                      placeholder="e.g. Admissions Open 2026-27"
                      value={bannerForm.title}
                      onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                    />
                  </div>

                  <div className="admin-input-group">
                    <label htmlFor="banner-subtitle">Subtitle</label>
                    <textarea
                      id="banner-subtitle"
                      rows={2}
                      placeholder="Optional short line shown under the title"
                      value={bannerForm.subtitle}
                      onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                    />
                  </div>

                  <div className="admin-input-group">
                    <label>Poster Image * (PNG, JPG, or WEBP only)</label>
                    <div className="image-upload-flex">
                      <label className="btn-file-upload">
                        <Crop size={16} />
                        <span>Upload & Adjust Poster</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={(e) => handleOpenImageCropper(e, 'banner')}
                          style={{ display: 'none' }}
                        />
                      </label>
                      <span className="or-divider">OR</span>
                      <input
                        type="url"
                        placeholder="Paste image URL ending in .png, .jpg, or .webp"
                        value={bannerForm.image_url}
                        onChange={(e) => setBannerForm({ ...bannerForm, image_url: e.target.value })}
                        onBlur={(e) => {
                          const url = e.target.value.trim();
                          if (url && !isValidBannerImageUrl(url)) {
                            alert('Please paste a direct image link ending in .png, .jpg/.jpeg, or .webp');
                          }
                        }}
                        className="input-url"
                      />
                    </div>
                    {bannerForm.image_url && (
                      <img
                        src={bannerForm.image_url}
                        alt="Poster preview"
                        style={{ marginTop: '10px', width: '140px', borderRadius: '10px', border: '2px solid var(--primary-red, #C41202)' }}
                      />
                    )}
                  </div>

                  <div className="admin-input-group">
                    <label htmlFor="banner-link">Link URL (optional)</label>
                    <input
                      id="banner-link"
                      type="text"
                      placeholder="e.g. admissions or https://..."
                      value={bannerForm.link_url}
                      onChange={(e) => setBannerForm({ ...bannerForm, link_url: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div className="form-grid-2col">
                <div className="admin-input-group">
                  <label htmlFor="banner-order">Display Order</label>
                  <input
                    id="banner-order"
                    type="number"
                    min="1"
                    value={bannerForm.display_order}
                    onChange={(e) => setBannerForm({ ...bannerForm, display_order: e.target.value })}
                  />
                </div>

                <div className="admin-input-group">
                  <label htmlFor="banner-active">Status</label>
                  <select
                    id="banner-active"
                    className="admin-select"
                    value={bannerForm.is_active ? 'active' : 'inactive'}
                    onChange={(e) => setBannerForm({ ...bannerForm, is_active: e.target.value === 'active' })}
                  >
                    <option value="active">Active (visible on site)</option>
                    <option value="inactive">Inactive (hidden)</option>
                  </select>
                </div>
              </div>

              <div className="slide-modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsBannerModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary" disabled={formSubmitting}>
                  {formSubmitting ? 'Saving...' : editingBanner ? 'Update Banner' : 'Publish Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 7: UNIVERSAL CROPPER MODAL
         ========================================================= */}
      {selectedAdmission && selectedAdmissionSchool && (
        <div className="admin-modal-backdrop" onClick={() => {
          if (!admissionActionLoading) {
            setSelectedAdmission(null);
            setSelectedAdmissionSchool(null);
            setAdmissionPhotoUrls({});
          }
        }}>
          <div
            className="admission-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admission-detail-header">
              <div>
                <div className={`admission-school-badge ${selectedAdmissionSchool}`}>
                  {selectedAdmissionSchool === 'icse' ? 'ICSE / ISC' : 'MATRICULATION'}
                </div>
                <h2>{getAdmissionStudentName(selectedAdmission, selectedAdmissionSchool)}</h2>
                <p>{selectedAdmission.application_no || 'Admission Application'} · Submitted {selectedAdmission.created_at ? new Date(selectedAdmission.created_at).toLocaleString('en-GB') : '—'}</p>
              </div>
              <button
                className="slide-modal-close"
                onClick={() => {
                  setSelectedAdmission(null);
                  setSelectedAdmissionSchool(null);
                  setAdmissionPhotoUrls({});
                }}
                disabled={admissionActionLoading}
              >
                <X size={20} />
              </button>
            </div>

            <div className="admission-detail-toolbar">
              <label>
                <span>Status</span>
                <select
                  value={selectedAdmission.status || 'new'}
                  onChange={(e) => updateAdmissionStatus(selectedAdmission, selectedAdmissionSchool, e.target.value)}
                  disabled={admissionActionLoading}
                >
                  <option value="new">New</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </label>

              <button
                className="btn-action-delete"
                onClick={() => deleteAdmissionApplication(selectedAdmission, selectedAdmissionSchool)}
                disabled={admissionActionLoading}
              >
                <Trash2 size={15} /> Delete Application
              </button>
            </div>

            <div className="admission-detail-body">
              <section className="admission-photo-section">
                <h3><Camera size={17} /> Photographs</h3>
                <div className="admission-photo-grid">
                  {getAdmissionPhotoFields(selectedAdmission, selectedAdmissionSchool).map(({ key, label }) => (
                    <div className="admission-photo-card" key={key}>
                      {admissionPhotoLoading ? (
                        <div className="admission-photo-placeholder"><RefreshCw className="spin-icon" size={22} /></div>
                      ) : admissionPhotoUrls[key] ? (
                        <img src={admissionPhotoUrls[key]} alt={label} />
                      ) : (
                        <div className="admission-photo-placeholder">
                          <Camera size={24} />
                          <span>No photo</span>
                        </div>
                      )}
                      <strong>{label}</strong>
                      <span className="admission-photo-readonly">
                        <Eye size={14} /> View Only
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {(() => {
                const hiddenKeys = new Set([
                  'id',
                  'student_photo_path',
                  'student_photo_url',
                  'father_photo_url',
                  'mother_photo_url'
                ]);

                const sections = [
                  {
                    title: 'Application',
                    keys: ['application_no', 'status', 'created_at', 'updated_at', 'admission_standard', 'academic_year']
                  },
                  {
                    title: 'Student / Child Details',
                    keys: selectedAdmissionSchool === 'icse'
                      ? ['student_name', 'gender', 'dob', 'dob_words', 'religion', 'caste', 'community', 'nationality', 'aadhar_number', 'emis_number', 'mother_tongue', 'last_school_name', 'last_school_class', 'is_staff_ward', 'staff_ward_parent_name']
                      : ['first_name', 'middle_name', 'last_name', 'gender', 'dob', 'dob_words', 'blood_group', 'religion', 'caste', 'community', 'aadhar_number', 'nationality', 'languages_known', 'mother_tongue', 'residential_address', 'correspondence_address', 'distance_from_school', 'sms_phone']
                  },
                  {
                    title: 'Father / Guardian',
                    keys: selectedAdmissionSchool === 'icse'
                      ? ['father_name', 'father_qualification', 'father_occupation', 'father_annual_income', 'father_office_address', 'father_phone', 'father_residential_address', 'father_residential_phone']
                      : ['father_name', 'father_age', 'father_nationality', 'father_qualification', 'father_office_address', 'father_occupation', 'father_designation', 'father_tel', 'father_annual_income', 'father_mobile_2', 'father_aadhar']
                  },
                  {
                    title: 'Mother',
                    keys: selectedAdmissionSchool === 'icse'
                      ? ['mother_name', 'mother_qualification', 'mother_occupation', 'mother_annual_income', 'mother_office_address', 'mother_phone', 'mother_residential_address', 'mother_residential_phone']
                      : ['mother_name', 'mother_age', 'mother_nationality', 'mother_qualification', 'mother_office_address', 'mother_occupation', 'mother_designation', 'mother_tel', 'mother_annual_income', 'mother_mobile_2', 'mother_aadhar']
                  },
                  {
                    title: 'Declaration & Enclosures',
                    keys: selectedAdmissionSchool === 'icse'
                      ? ['enc_transfer_certificate', 'enc_birth_certificate', 'enc_community_certificate', 'enc_aadhar_xerox', 'enc_passport_xerox', 'declaration_agreed', 'guardian_signature_name']
                      : ['enc_birth_certificate', 'enc_transfer_certificate', 'enc_child_photos', 'enc_parent_photos', 'enc_aadhar_copy', 'enc_community_certificate', 'enc_passport_permit', 'declarant_name', 'declaration_agreed', 'guardian_signature_name']
                  }
                ];

                const pretty = (key) => key
                  .replace(/_url$/, '')
                  .replace(/_path$/, '')
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (c) => c.toUpperCase());

                const formatValue = (value) => {
                  if (value === null || value === undefined || value === '') return '—';
                  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
                  if (Array.isArray(value)) return value.length ? JSON.stringify(value, null, 2) : '—';
                  if (typeof value === 'object') return JSON.stringify(value, null, 2);
                  return String(value);
                };

                return (
                  <div className="admission-detail-sections">
                    {sections.map((section) => {
                      const available = section.keys.filter((key) => !hiddenKeys.has(key) && Object.prototype.hasOwnProperty.call(selectedAdmission, key));
                      if (!available.length) return null;

                      return (
                        <section className="admission-detail-section" key={section.title}>
                          <h3>{section.title}</h3>
                          <div className="admission-detail-grid">
                            {available.map((key) => (
                              <div className="admission-detail-field" key={key}>
                                <span>{pretty(key)}</span>
                                <strong className={typeof selectedAdmission[key] === 'object' ? 'pre-value' : ''}>
                                  {formatValue(selectedAdmission[key])}
                                </strong>
                              </div>
                            ))}
                          </div>
                        </section>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {cropperOpen && (
        <div className="admin-modal-backdrop" onClick={() => setCropperOpen(false)}>
          <div className="admin-cropper-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="cropper-modal-header">
              <div>
                <h3 className="cropper-title"><Crop size={18} /> Interactive Image Alignment</h3>
                <p className="cropper-subtitle">Drag image to position and use zoom controls to fit the frame.</p>
              </div>
              <button className="slide-modal-close" onClick={() => setCropperOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="cropper-modal-body">
              <div 
               // crop ratio class
            className={`cropper-canvas-wrapper ${cropperMode === 'carousel' ? 'banner-crop-ratio' : cropperMode === 'avatar' || cropperMode === 'faculty' ? 'avatar-crop-ratio' : cropperMode === 'banner' ? 'poster-crop-ratio' : 'gallery-crop-ratio'}`}

            
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
              >
                <canvas 
                  ref={cropCanvasRef} 
                  width={cropperMode === 'carousel' ? 720 : cropperMode === 'avatar' ? 440 : cropperMode === 'banner' ? 360 : 680} 
                  height={cropperMode === 'carousel' ? 338 : cropperMode === 'avatar' ? 440 : cropperMode === 'banner' ? 440 : 442} 
                  className="cropper-canvas" 
                />

                <div className="cropper-guidelines-overlay">
                  <div className="grid-line horizontal h1"></div>
                  <div className="grid-line horizontal h2"></div>
                  <div className="grid-line vertical v1"></div>
                  <div className="grid-line vertical v2"></div>
                </div>

                <div className="cropper-drag-hint">
                  <Move size={14} /> Drag image to position & center
                </div>
              </div>

              <div className="cropper-controls-panel">
                <div className="zoom-control-group">
                  <button 
                    type="button" 
                    className="btn-zoom"
                    onClick={() => setCropZoom((prev) => Math.max(1, prev - 0.15))}
                  >
                    <ZoomOut size={16} />
                  </button>

                  <div className="slider-container">
                    <label>Zoom Level ({cropZoom.toFixed(2)}x)</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="3" 
                      step="0.02" 
                      value={cropZoom} 
                      onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                      className="cropper-zoom-range"
                    />
                  </div>

                  <button 
                    type="button" 
                    className="btn-zoom"
                    onClick={() => setCropZoom((prev) => Math.min(3, prev + 0.15))}
                  >
                    <ZoomIn size={16} />
                  </button>
                </div>

                <button 
                  type="button" 
                  className="btn-cropper-reset"
                  onClick={() => { setCropZoom(1); setCropOffset({ x: 0, y: 0 }); }}
                >
                  <RotateCcw size={14} /> Reset Fit
                </button>
              </div>
            </div>

            <div className="cropper-modal-footer">
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={() => setCropperOpen(false)}
                disabled={uploadingImage}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-admin-primary" 
                onClick={handleApplyCropAndUpload}
                disabled={uploadingImage}
              >
                {uploadingImage ? 'Cropping & Uploading...' : 'Apply Fit & Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isFacultyModalOpen && !cropperOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsFacultyModalOpen(false)}>
          <div className="admin-slide-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="slide-modal-header">
              <div>
                <h3>{editingFaculty ? 'Edit Faculty Record' : 'Add New Faculty Member'}</h3>
                <p>Enter the teacher's serial number, full name, and qualification.</p>
              </div>
              <button className="slide-modal-close" onClick={() => setIsFacultyModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveFaculty} className="slide-modal-form">
              <div className="form-grid-2col">
                <div className="admin-input-group">
                  <label htmlFor="faculty-sno">S.No *</label>
                  <input
                    id="faculty-sno"
                    type="number"
                    min="1"
                    required
                    value={facultyForm.s_no}
                    onChange={(e) => setFacultyForm({ ...facultyForm, s_no: e.target.value })}
                  />
                </div>

                <div className="admin-input-group">
                  <label htmlFor="faculty-order">Display Sequence Order</label>
                  <input
                    id="faculty-order"
                    type="number"
                    min="1"
                    value={facultyForm.display_order}
                    onChange={(e) => setFacultyForm({ ...facultyForm, display_order: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-input-group">
                <label htmlFor="faculty-name">Name of the Teacher *</label>
                <input
                  id="faculty-name"
                  type="text"
                  required
                  placeholder="e.g. Mrs. R. Priya"
                  value={facultyForm.name}
                  onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                />
              </div>

              <div className="admin-input-group">
                <label htmlFor="faculty-qual">Qualification *</label>
                <input
                  id="faculty-qual"
                  type="text"
                  required
                  placeholder="e.g. M.Sc, B.Ed"
                  value={facultyForm.qualification}
                  onChange={(e) => setFacultyForm({ ...facultyForm, qualification: e.target.value })}
                />
              </div>
              <div className="admin-input-group">
  <label>Profile Photo (Optional)</label>
  <div className="image-upload-flex">
    <label className="btn-file-upload">
      <Crop size={16} />
      <span>Upload & Crop Photo</span>
      <input 
        type="file" 
        accept="image/*" 
        onChange={(e) => handleOpenImageCropper(e, 'faculty')}
        style={{ display: 'none' }}
      />
    </label>
    <span className="or-divider">OR</span>
    <input
      type="url"
      placeholder="Paste photo URL"
      value={facultyForm.photo_url}
      onChange={(e) => setFacultyForm({ ...facultyForm, photo_url: e.target.value })}
      className="input-url"
    />
  </div>
  {facultyForm.photo_url && (
    <img
      src={facultyForm.photo_url}
      alt="Faculty preview"
      style={{ marginTop: '10px', width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-red, #C41202)' }}
    />
  )}
</div>

              <div className="admin-checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={facultyForm.is_active}
                    onChange={(e) => setFacultyForm({ ...facultyForm, is_active: e.target.checked })}
                  />
                  <span>Visible on website Faculty table</span>
                </label>
              </div>

              <div className="slide-modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsFacultyModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary" disabled={formSubmitting}>
                  {formSubmitting ? 'Saving...' : editingFaculty ? 'Update Record' : 'Add Faculty Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}