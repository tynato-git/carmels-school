import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Users as UsersIcon,
  Phone,
  Calendar,
  School,
  Send,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ShieldAlert,
  PenLine,
  HeartPulse,
  Ear,
  Eye,
  Baby,
  Plus,
  Trash2,
  Camera,
  Megaphone
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Admission.css';
import './Admissionicse.css';
import './Admissionmatric.css';
 

const CLASS_OPTIONS = [
  'LKG', 'UKG',
  'Std I', 'Std II', 'Std III', 'Std IV', 'Std V',
  'Std VI', 'Std VII', 'Std VIII',
  'Std IX', 'Std X', 'Std XI', 'Std XII'
];
 
const currentYear = new Date().getFullYear();
const DEFAULT_ACADEMIC_YEAR = `${currentYear}-${String(currentYear + 1).slice(-2)}`;
 
const HEARD_ABOUT_OPTIONS = ['Newspaper', 'Website', 'Magazine', 'Friends', 'Teachers', 'Pamphlets'];
 
const INITIAL_FORM = {
  admission_standard: '',
  academic_year: DEFAULT_ACADEMIC_YEAR,
  guardian1_name: '',
  guardian2_name: '',
 
  first_name: '',
  middle_name: '',
  last_name: '',
  gender: '',
  dob: '',
  dob_words: '',
  blood_group: '',
  religion: '',
  caste: '',
  community: '',
  aadhar_number: '',
  nationality: 'Indian',
  languages_known: '',
  mother_tongue: '',
 
  residential_address: '',
  correspondence_address: '',
  father_mobile: '',
  mother_mobile: '',
  residential_email: '',
  correspondence_email: '',
  distance_from_school: '',
  sms_phone: '',
 
  father_photo_url: '',
  mother_photo_url: '',
  student_photo_url: '',
 
  father_name: '',
  father_age: '',
  father_nationality: '',
  father_qualification: '',
  father_office_address: '',
  father_occupation: '',
  father_designation: '',
  father_tel: '',
  father_annual_income: '',
  father_mobile_2: '',
  father_aadhar: '',
 
  mother_name: '',
  mother_age: '',
  mother_nationality: '',
  mother_qualification: '',
  mother_office_address: '',
  mother_occupation: '',
  mother_designation: '',
  mother_tel: '',
  mother_annual_income: '',
  mother_mobile_2: '',
 
  is_staff_ward: false,
  staff_ward_parent_name: '',
 
  emis_number: '',
  previous_board: '',
  awards_won: '',
 
  birth_details: '',
  birth_cry: '',
 
  hearing_difficulty: '',
  hearing_consultation_done: '',
  hearing_explain: '',
 
  vision_consultation_done: '',
  vision_spectacles: '',
 
  milestone_sitting: '',
  milestone_standing: '',
  milestone_walking: '',
  milestone_speech: '',
 
  medication_details: '',
  allergy_details: '',
 
  enc_birth_certificate: false,
  enc_transfer_certificate: false,
  enc_child_photos: false,
  enc_parent_photos: false,
  enc_aadhar_copy: false,
  enc_community_certificate: false,
  enc_passport_permit: false,
 
  heard_about_sources: [],
 
  declarant_name: '',
  declaration_agreed: false,
  guardian_signature_name: ''
};
 
const normalizeIndianMobile = (value) => {
  const digits = String(value || '').replace(/\D/g, '');

  if (!digits) return null;

  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }

  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) {
    return digits;
  }

  return null;
};

export default function AdmissionMatric({ onBack, onNavigateHome }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [siblings, setSiblings] = useState([]); // {name, age, institution, standard}
  const [previousStudy, setPreviousStudy] = useState([]); // {year, school, standard, marks}
  const [uploadingPhoto, setUploadingPhoto] = useState(null); // 'father' | 'mother' | 'student' | null
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
 
  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };
 
  const toggleHeardAbout = (option) => {
    setForm((prev) => {
      const has = prev.heard_about_sources.includes(option);
      return {
        ...prev,
        heard_about_sources: has
          ? prev.heard_about_sources.filter((o) => o !== option)
          : [...prev.heard_about_sources, option]
      };
    });
  };
 
  // --- Siblings dynamic rows ---
  const addSibling = () => setSiblings((prev) => [...prev, { name: '', age: '', institution: '', standard: '' }]);
  const removeSibling = (idx) => setSiblings((prev) => prev.filter((_, i) => i !== idx));
  const updateSibling = (idx, field, value) => {
    setSiblings((prev) => prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));
  };
 
  // --- Previous study dynamic rows ---
  const addPreviousStudy = () => setPreviousStudy((prev) => [...prev, { year: '', school: '', standard: '', marks: '' }]);
  const removePreviousStudy = (idx) => setPreviousStudy((prev) => prev.filter((_, i) => i !== idx));
  const updatePreviousStudy = (idx, field, value) => {
    setPreviousStudy((prev) => prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));
  };
 
  // --- Simple photo upload (no crop — direct upload) ---
  const handlePhotoUpload = async (e, who) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('Photo must be under 8MB.');
      e.target.value = '';
      return;
    }
    setUploadingPhoto(who);
    try {
      const ext = file.name.split('.').pop();
      const filePath = `admissions/matric/${who}_${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('carmel_admission_photos')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });
      if (uploadError) throw uploadError;
 
      // Store the private Storage path in the application row.
      // Admin pages should generate a signed URL when displaying the photo.
      setForm((prev) => ({ ...prev, [`${who}_photo_url`]: filePath }));
    } catch (err) {
      alert('Photo upload failed: ' + err.message);
    } finally {
      setUploadingPhoto(null);
      e.target.value = '';
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
 
    if (
      !form.admission_standard ||
      !form.guardian1_name.trim() ||
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.sms_phone.trim()
    ) {
      setSubmitError(
        'Please fill in Admission Required For, Parent / Guardian Name 1, First Name, Last Name, and the SMS phone number — these are required.'
      );
      return;
    }

    if (!form.student_photo_url) {
      setSubmitError('Student photo is required. Please upload the student photo.');
      return;
    }

    const fatherMobile = form.father_mobile.trim() || null;
const motherMobile = form.mother_mobile.trim() || null;

    const smsMobile = normalizeIndianMobile(form.sms_phone);
    if (!smsMobile) {
      setSubmitError('Preferred SMS phone number must be a valid 10-digit Indian mobile number.');
      return;
    }

    const fatherAadhar = String(form.father_aadhar || '').replace(/\D/g, '');
    if (fatherAadhar && fatherAadhar.length !== 12) {
      setSubmitError('Father / Guardian Aadhar number must contain 12 digits.');
      return;
    }

    if (!form.declaration_agreed) {
      setSubmitError('Please confirm the declaration at the bottom of the form before submitting.');
      return;
    }
    if (!form.declarant_name.trim() || !form.guardian_signature_name.trim()) {
      setSubmitError('Please fill in the declarant name and signature at the bottom of the form.');
      return;
    }
    if (form.is_staff_ward && !form.staff_ward_parent_name.trim()) {
      setSubmitError('Please enter the staff parent name for a staff-ward application.');
      return;
    }
 
    setSubmitting(true);
    try {
      const { error } = await supabase.from('matric_admission_applications').insert([
        {
          admission_standard: form.admission_standard,
          academic_year: form.academic_year || null,
          guardian1_name: form.guardian1_name || null,
          guardian2_name: form.guardian2_name || null,
 
          first_name: form.first_name,
          middle_name: form.middle_name || null,
          last_name: form.last_name || null,
          gender: form.gender || null,
          dob: form.dob || null,
          dob_words: form.dob_words || null,
          blood_group: form.blood_group || null,
          religion: form.religion || null,
          caste: form.caste || null,
          community: form.community || null,
          aadhar_number: form.aadhar_number || null,
          nationality: form.nationality || null,
          languages_known: form.languages_known || null,
          mother_tongue: form.mother_tongue || null,
 
          residential_address: form.residential_address || null,
          correspondence_address: form.correspondence_address || null,
          father_mobile: fatherMobile,
          mother_mobile: motherMobile,
          residential_email: form.residential_email || null,
          correspondence_email: form.correspondence_email || null,
          distance_from_school: form.distance_from_school || null,
          sms_phone: smsMobile,
 
          father_photo_url: form.father_photo_url || null,
          mother_photo_url: form.mother_photo_url || null,
          student_photo_url: form.student_photo_url || null,
 
          father_name: form.father_name || null,
          father_age: form.father_age || null,
          father_nationality: form.father_nationality || null,
          father_qualification: form.father_qualification || null,
          father_office_address: form.father_office_address || null,
          father_occupation: form.father_occupation || null,
          father_designation: form.father_designation || null,
          father_tel: form.father_tel || null,
          father_annual_income: form.father_annual_income || null,
          father_mobile_2: form.father_mobile_2 || null,
          father_aadhar: fatherAadhar || null,
 
          mother_name: form.mother_name || null,
          mother_age: form.mother_age || null,
          mother_nationality: form.mother_nationality || null,
          mother_qualification: form.mother_qualification || null,
          mother_office_address: form.mother_office_address || null,
          mother_occupation: form.mother_occupation || null,
          mother_designation: form.mother_designation || null,
          mother_tel: form.mother_tel || null,
          mother_annual_income: form.mother_annual_income || null,
          mother_mobile_2: form.mother_mobile_2 || null,
 
          siblings: siblings.filter((s) => s.name.trim()),
          is_staff_ward: form.is_staff_ward,
          staff_ward_parent_name: form.staff_ward_parent_name || null,
 
          previous_study: previousStudy.filter((p) => p.school.trim()),
          emis_number: form.emis_number || null,
          previous_board: form.previous_board || null,
          awards_won: form.awards_won || null,
 
          birth_details: form.birth_details || null,
          birth_cry: form.birth_cry || null,
 
          hearing_difficulty: form.hearing_difficulty || null,
          hearing_consultation_done: form.hearing_consultation_done || null,
          hearing_explain: form.hearing_explain || null,
 
          vision_consultation_done: form.vision_consultation_done || null,
          vision_spectacles: form.vision_spectacles || null,
 
          milestone_sitting: form.milestone_sitting || null,
          milestone_standing: form.milestone_standing || null,
          milestone_walking: form.milestone_walking || null,
          milestone_speech: form.milestone_speech || null,
 
          medication_details: form.medication_details || null,
          allergy_details: form.allergy_details || null,
 
          enc_birth_certificate: form.enc_birth_certificate,
          enc_transfer_certificate: form.enc_transfer_certificate,
          enc_child_photos: form.enc_child_photos,
          enc_parent_photos: form.enc_parent_photos,
          enc_aadhar_copy: form.enc_aadhar_copy,
          enc_community_certificate: form.enc_community_certificate,
          enc_passport_permit: form.enc_passport_permit,
 
          heard_about_sources: form.heard_about_sources,
 
          declarant_name: form.declarant_name,
          declaration_agreed: form.declaration_agreed,
          guardian_signature_name: form.guardian_signature_name
        }
      ]);
 
      if (error) {
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          setSubmitError('The admission form is being set up on our end. Please call the school office directly for now: 0431-2774403 / +91 78680 23528.');
        } else {
          setSubmitError('Something went wrong submitting your application: ' + error.message);
        }
        return;
      }
 


      setSubmitted(true);
      setForm(INITIAL_FORM);
      setSiblings([]);
      setPreviousStudy([]);
    } catch (err) {
      setSubmitError('Something went wrong. Please try again or call the school office.');
    } finally {
      setSubmitting(false);
    }
  };
 
  const YesNo = ({ field }) => (
    <div className="radio-pill-group">
      <label className="radio-pill">
        <input type="radio" name={field} checked={form[field] === 'Yes'} onChange={() => setForm((p) => ({ ...p, [field]: 'Yes' }))} />
        Yes
      </label>
      <label className="radio-pill">
        <input type="radio" name={field} checked={form[field] === 'No'} onChange={() => setForm((p) => ({ ...p, [field]: 'No' }))} />
        No
      </label>
    </div>
  );
 
  return (
    <div className="admission-page-container">
      <header className="admission-topbar">
        <div className="admission-topbar-inner">
          <button className="admission-back-link" onClick={onBack}>
            <ArrowLeft size={16} /> Back to School Selection
          </button>
        </div>
      </header>
 
      <section className="admission-hero-section">
        <div className="admission-container text-center">
          <span className="sub-badge">Carmel's Matriculation Hr. Sec. School</span>
          <h1 className="admission-title">
            <School size={30} className="admission-title-icon" />
            Matriculation Admission Application
          </h1>
          <p className="admission-subtitle">
            Carmel Gardens, Ramalinganagar West Extn., Woraiyur, Trichy-03
            &bull; carmels_school@yahoo.com &bull; 0431-2774403, +91 78680 23528
          </p>
        </div>
      </section>
 
      <section className="admission-form-section">
        <div className="admission-container icse-form-container">
          <div className="admission-form-card">
 
            {submitted ? (
              <div className="admission-success-state">
                <CheckCircle2 size={48} className="success-icon" />
                <h2>Application Submitted!</h2>
                <p>
                  Thank you for applying to Carmel's Matriculation Hr. Sec. School. Please bring the
                  original documents listed in the Enclosures section, stapled to the top left-hand
                  corner of a printout, when you visit the school office. Our admissions team will
                  contact you on the phone number provided.
                </p>
                <button className="btn-admission-primary" onClick={() => setSubmitted(false)}>
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="admission-form icse-form">
 
                {submitError && (
                  <div className="admission-alert admission-alert-danger">
                    <AlertCircle size={18} />
                    <span>{submitError}</span>
                  </div>
                )}
 
                {/* ============ ADMISSION FOR + DECLARATION LINE ============ */}
                <div className="admission-form-block">
                  <h3 className="admission-block-title">
                    <School size={17} /> Admission Details
                  </h3>
 
                  <div className="admission-grid-2col">
                    <div className="admission-input-group">
                      <label htmlFor="mat-standard">Admission Required For *</label>
                      <select id="mat-standard" required className="admission-select" value={form.admission_standard} onChange={set('admission_standard')}>
                        <option value="">Select a class</option>
                        {CLASS_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="admission-input-group">
                      <label htmlFor="mat-year">Academic Year</label>
                      <input id="mat-year" type="text" placeholder="2026-27" value={form.academic_year} onChange={set('academic_year')} />
                    </div>
                  </div>
 
                  <p className="admission-block-hint">
                    "We, the undersigned, wish to admit our son/daughter/ward as a day scholar at Carmel's Matriculation Higher Secondary School."
                  </p>
                  <div className="admission-grid-2col">
                    <div className="admission-input-group">
                      <label htmlFor="mat-guardian1">Parent / Guardian Name 1 *</label>
                      <input id="mat-guardian1" type="text" required value={form.guardian1_name} onChange={set('guardian1_name')} />
                    </div>
                    <div className="admission-input-group">
                      <label htmlFor="mat-guardian2">Parent / Guardian Name 2</label>
                      <input id="mat-guardian2" type="text" value={form.guardian2_name} onChange={set('guardian2_name')} />
                    </div>
                  </div>
                </div>
 
                {/* ============ PHOTOS ============ */}
                <div className="admission-form-block">
                  <h3 className="admission-block-title">
                    <Camera size={17} /> Photos
                  </h3>
                  <p className="admission-block-hint">Student photo is required. Father / Guardian and Mother photos are optional.</p>
 
                  <div className="photo-affix-grid">
                    {[
                      { key: 'father', label: 'Photo of Father', required: false },
                      { key: 'mother', label: 'Photo of Mother', required: false },
                      { key: 'student', label: 'Photo of Student', required: true }
                    ].map(({ key, label, required }) => (
                      <div className="photo-affix-box" key={key}>
                        {form[`${key}_photo_url`] ? (
                          <img src={form[`${key}_photo_url`]} alt={label} className="photo-affix-preview" />
                        ) : (
                          <div className="photo-affix-placeholder">
                            <Camera size={22} />
                            <span>{label}{required ? ' *' : ''}</span>
                          </div>
                        )}
                        <label className="photo-affix-upload-btn">
                          {uploadingPhoto === key ? 'Uploading...' : form[`${key}_photo_url`] ? 'Replace' : 'Upload'}
                          <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, key)} disabled={uploadingPhoto === key} style={{ display: 'none' }} />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
 
                {/* ============ A. CHILD INFORMATION ============ */}
                <div className="admission-form-block">
                  <h3 className="admission-block-title">
                    <User size={17} /> A. Information of the Child
                  </h3>
 
                  <div className="admission-grid-3col">
                    <div className="admission-input-group">
                      <label htmlFor="first-name">First Name *</label>
                      <input id="first-name" type="text" required value={form.first_name} onChange={set('first_name')} />
                    </div>
                    <div className="admission-input-group">
                      <label htmlFor="middle-name">Middle Name</label>
                      <input id="middle-name" type="text" value={form.middle_name} onChange={set('middle_name')} />
                    </div>
                    <div className="admission-input-group">
                      <label htmlFor="last-name">Last Name *</label>
                      <input id="last-name" type="text" required value={form.last_name} onChange={set('last_name')} />
                    </div>
                  </div>
 
                  <div className="admission-grid-2col">
                    <div className="admission-input-group">
                      <label required>Gender *</label>
                      <div className="radio-pill-group">
                        <label className="radio-pill">
                          <input type="radio" name="mat-gender" checked={form.gender === 'Male'} onChange={() => setForm((p) => ({ ...p, gender: 'Male' }))} />
                          Male
                        </label>
                        <label className="radio-pill">
                          <input type="radio" name="mat-gender" checked={form.gender === 'Female'} onChange={() => setForm((p) => ({ ...p, gender: 'Female' }))} />
                          Female
                        </label>
                      </div>
                    </div>
                    <div className="admission-input-group">
                      <label htmlFor="mat-dob">Date of Birth *</label>
                      <div className="admission-input-icon-wrap">
                        <Calendar size={16} className="input-icon" />
                        <input id="mat-dob" type="date" value={form.dob} onChange={set('dob')} />
                      </div>
                    </div>
                  </div>
 
                  <div className="admission-input-group">
                    <label htmlFor="mat-dob-words">Date of Birth in Words *</label>
                    <input id="mat-dob-words" type="text" value={form.dob_words} onChange={set('dob_words')} />
                  </div>
 
                  <div className="admission-grid-3col">
                    <div className="admission-input-group">
                      <label htmlFor="mat-blood">Blood Group *</label>
                      <input id="mat-blood" type="text" placeholder="e.g. O+" value={form.blood_group} onChange={set('blood_group')} />
                    </div>
                    <div className="admission-input-group">
                      <label htmlFor="mat-religion">Religion *</label>
                      <input id="mat-religion" type="text" value={form.religion} onChange={set('religion')} />
                    </div>
                    <div className="admission-input-group">
                      <label htmlFor="mat-caste">Caste *</label>
                      <input id="mat-caste" type="text" value={form.caste} onChange={set('caste')} />
                    </div>
                  </div>
 
                  <div className="admission-grid-2col">
                    <div className="admission-input-group">
                      <label htmlFor="mat-community">Community *</label>
                      <input id="mat-community" type="text" value={form.community} onChange={set('community')} />
                    </div>
                    <div className="admission-input-group">
                      <label htmlFor="mat-aadhar">Aadhar No. *</label>
                      <input id="mat-aadhar" type="text" value={form.aadhar_number} onChange={set('aadhar_number')} />
                    </div>
                  </div>
 
                  <div className="admission-grid-3col">
                    <div className="admission-input-group">
                      <label htmlFor="mat-nationality">Nationality *</label>
                      <input id="mat-nationality" type="text" value={form.nationality} onChange={set('nationality')} />
                    </div>
                    <div className="admission-input-group">
                      <label htmlFor="mat-languages">Languages Known *</label>
                      <input id="mat-languages" type="text" value={form.languages_known} onChange={set('languages_known')} />
                    </div>
                    <div className="admission-input-group">
                      <label htmlFor="mat-mother-tongue">Mother Tongue *</label>
                      <input id="mat-mother-tongue" type="text" value={form.mother_tongue} onChange={set('mother_tongue')} />
                    </div>
                  </div>
 
                  <div className="admission-grid-2col">
                    <div className="admission-input-group">
                      <label htmlFor="mat-res-addr">Residential Address</label>
                      <textarea id="mat-res-addr" rows={2} value={form.residential_address} onChange={set('residential_address')} />
                    </div>
                    <div className="admission-input-group">
                      <label htmlFor="mat-corr-addr">Correspondence Address</label>
                      <textarea id="mat-corr-addr" rows={2} value={form.correspondence_address} onChange={set('correspondence_address')} />
                    </div>
                  </div>
 
                  <div className="admission-grid-2col">
                    <div className="admission-input-group">
                      <label htmlFor="mat-father-mobile">Father's Mobile No.</label>
                      <input id="mat-father-mobile" type="tel" value={form.father_mobile} onChange={set('father_mobile')} />
                    </div>
                    <div className="admission-input-group">
                      <label htmlFor="mat-mother-mobile">Mother's Mobile No.</label>
                      <input id="mat-mother-mobile" type="tel" value={form.mother_mobile} onChange={set('mother_mobile')} />
                    </div>
                  </div>
 
                  <div className="admission-grid-2col">
                    <div className="admission-input-group">
                      <label htmlFor="mat-res-email">Email ID</label>
                      <input id="mat-res-email" type="email" value={form.residential_email} onChange={set('residential_email')} />
                    </div>
                    <div className="admission-input-group">
                      <label htmlFor="mat-corr-email">Email ID (Correspondence)</label>
                      <input id="mat-corr-email" type="email" value={form.correspondence_email} onChange={set('correspondence_email')} />
                    </div>
                  </div>
 
                  <div className="admission-grid-2col">
                    <div className="admission-input-group">
                      <label htmlFor="mat-distance">Distance from School (in kms)</label>
                      <input id="mat-distance" type="text" value={form.distance_from_school} onChange={set('distance_from_school')} />
                    </div>
                    <div className="admission-input-group">
                      <label htmlFor="mat-sms">Preferred Phone Number for School SMS *</label>
                      <div className="admission-input-icon-wrap">
                        <Phone size={16} className="input-icon" />
                        <input id="mat-sms" type="tel" required value={form.sms_phone} onChange={set('sms_phone')} />
                      </div>
                    </div>
                  </div>
                </div>
 
                {/* ============ FAMILY INFORMATION ============ */}
                <div className="admission-form-block">
                  <h3 className="admission-block-title">
                    <UsersIcon size={17} /> Family Information
                  </h3>
 
                  <div className="parent-details-grid">
                    <div className="parent-column">
                      <span className="parent-column-heading">Father / Guardian</span>
                      <div className="admission-input-group"><label>Name</label><input type="text" value={form.father_name} onChange={set('father_name')} /></div>
                      <div className="admission-grid-2col">
                        <div className="admission-input-group"><label>Age</label><input type="text" value={form.father_age} onChange={set('father_age')} /></div>
                        <div className="admission-input-group"><label>Nationality *</label><input type="text" value={form.father_nationality} onChange={set('father_nationality')} /></div>
                      </div>
                      <div className="admission-input-group"><label>Educational Qualification</label><input type="text" value={form.father_qualification} onChange={set('father_qualification')} /></div>
                      <div className="admission-input-group"><label>Occupation</label><input type="text" value={form.father_occupation} onChange={set('father_occupation')} /></div>
                      <div className="admission-input-group"><label>Designation</label><input type="text" value={form.father_designation} onChange={set('father_designation')} /></div>
                      <div className="admission-input-group"><label>Office Address</label><textarea rows={2} value={form.father_office_address} onChange={set('father_office_address')} /></div>
                      <div className="admission-grid-2col">
                        <div className="admission-input-group"><label>Tel</label><input type="tel" value={form.father_tel} onChange={set('father_tel')} /></div>
                        <div className="admission-input-group"><label>Mobile</label><input type="tel" value={form.father_mobile_2} onChange={set('father_mobile_2')} /></div>
                      </div>
                      <div className="admission-grid-2col">
                        <div className="admission-input-group"><label>Annual Income</label><input type="text" value={form.father_annual_income} onChange={set('father_annual_income')} /></div>
                        <div className="admission-input-group">
                          <label>Aadhar No. for Father / Guardian</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={12}
                            value={form.father_aadhar}
                            onChange={set('father_aadhar')}
                          />
                        </div>
                      </div>
                    </div>
 
                    <div className="parent-column">
                      <span className="parent-column-heading">Mother / Guardian</span>
                      <div className="admission-input-group"><label>Name</label><input type="text" value={form.mother_name} onChange={set('mother_name')} /></div>
                      <div className="admission-grid-2col">
                        <div className="admission-input-group"><label>Age</label><input type="text" value={form.mother_age} onChange={set('mother_age')} /></div>
                        <div className="admission-input-group"><label>Nationality *</label><input type="text" value={form.mother_nationality} onChange={set('mother_nationality')} /></div>
                      </div>
                      <div className="admission-input-group"><label>Educational Qualification</label><input type="text" value={form.mother_qualification} onChange={set('mother_qualification')} /></div>
                      <div className="admission-input-group"><label>Occupation</label><input type="text" value={form.mother_occupation} onChange={set('mother_occupation')} /></div>
                      <div className="admission-input-group"><label>Designation</label><input type="text" value={form.mother_designation} onChange={set('mother_designation')} /></div>
                      <div className="admission-input-group"><label>Office Address</label><textarea rows={2} value={form.mother_office_address} onChange={set('mother_office_address')} /></div>
                      <div className="admission-grid-2col">
                        <div className="admission-input-group"><label>Tel</label><input type="tel" value={form.mother_tel} onChange={set('mother_tel')} /></div>
                        <div className="admission-input-group"><label>Mobile</label><input type="tel" value={form.mother_mobile_2} onChange={set('mother_mobile_2')} /></div>
                      </div>
                      <div className="admission-input-group"><label>Annual Income</label><input type="text" value={form.mother_annual_income} onChange={set('mother_annual_income')} /></div>
                    </div>
                  </div>
                </div>
 
                {/* ============ SIBLINGS ============ */}
                <div className="admission-form-block">
                  <h3 className="admission-block-title">
                    <UsersIcon size={17} /> Details of Siblings of the Student
                  </h3>
 
                  {siblings.length > 0 && (
                    <div className="dynamic-table">
                      <div className="dynamic-table-header">
                        <span>Name</span><span>Age</span><span>Institution</span><span>Standard</span><span></span>
                      </div>
                      {siblings.map((row, idx) => (
                        <div className="dynamic-table-row" key={idx}>
                          <input type="text" value={row.name} onChange={(e) => updateSibling(idx, 'name', e.target.value)} placeholder="Name" />
                          <input type="text" value={row.age} onChange={(e) => updateSibling(idx, 'age', e.target.value)} placeholder="Age" />
                          <input type="text" value={row.institution} onChange={(e) => updateSibling(idx, 'institution', e.target.value)} placeholder="Institution" />
                          <input type="text" value={row.standard} onChange={(e) => updateSibling(idx, 'standard', e.target.value)} placeholder="Standard" />
                          <button type="button" className="dynamic-row-remove" onClick={() => removeSibling(idx)}><Trash2 size={15} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button type="button" className="dynamic-row-add" onClick={addSibling}><Plus size={15} /> Add Sibling</button>
 
                  <div className="staff-ward-panel" style={{ marginTop: 16 }}>
                    <div className="staff-ward-toggle">
                      <div>
                        <span className="staff-ward-kicker">Staff benefit</span>
                        <strong>Is this application for a staff ward?</strong>
                        <p>Select this only if the student's parent is a staff member of the school.</p>
                      </div>
                      <label className="staff-ward-switch">
                        <input type="checkbox" checked={form.is_staff_ward} onChange={set('is_staff_ward')} />
                        <span className="staff-ward-switch-ui" />
                        <span>{form.is_staff_ward ? 'Yes' : 'No'}</span>
                      </label>
                    </div>

                    {form.is_staff_ward && (
                      <div className="admission-input-group staff-ward-name-field">
                        <label htmlFor="mat-staff-parent">Name of the Parent (Staff) *</label>
                        <input id="mat-staff-parent" type="text" required placeholder="Enter the staff parent's name" value={form.staff_ward_parent_name} onChange={set('staff_ward_parent_name')} />
                      </div>
                    )}
                  </div>
                </div>
 
                {/* ============ B. PREVIOUS STUDY ============ */}
                <div className="admission-form-block">
                  <h3 className="admission-block-title">
                    <School size={17} /> B. Details of Previous Study
                  </h3>
 
                  {previousStudy.length > 0 && (
                    <div className="dynamic-table">
                      <div className="dynamic-table-header">
                        <span>Year</span><span>School</span><span>Standard/Grade</span><span>Marks (Final Exam)</span><span></span>
                      </div>
                      {previousStudy.map((row, idx) => (
                        <div className="dynamic-table-row" key={idx}>
                          <input type="text" value={row.year} onChange={(e) => updatePreviousStudy(idx, 'year', e.target.value)} placeholder="Year" />
                          <input type="text" value={row.school} onChange={(e) => updatePreviousStudy(idx, 'school', e.target.value)} placeholder="School" />
                          <input type="text" value={row.standard} onChange={(e) => updatePreviousStudy(idx, 'standard', e.target.value)} placeholder="Standard" />
                          <input type="text" value={row.marks} onChange={(e) => updatePreviousStudy(idx, 'marks', e.target.value)} placeholder="Marks / Grade" />
                          <button type="button" className="dynamic-row-remove" onClick={() => removePreviousStudy(idx)}><Trash2 size={15} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button type="button" className="dynamic-row-add" onClick={addPreviousStudy}><Plus size={15} /> Add Previous School</button>
 
                  <div className="admission-grid-2col" style={{ marginTop: 16 }}>
                    <div className="admission-input-group">
                      <label htmlFor="mat-emis">EMIS No.</label>
                      <input id="mat-emis" type="text" value={form.emis_number} onChange={set('emis_number')} />
                    </div>
                    <div className="admission-input-group">
                      <label htmlFor="mat-board">Previous School Affiliated To</label>
                      <select id="mat-board" className="admission-select" value={form.previous_board} onChange={set('previous_board')}>
                        <option value="">Select</option>
                        <option value="State Board">State Board</option>
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
 
                  <div className="admission-input-group">
                    <label htmlFor="mat-awards">Awards Won So Far (Sports, Arts, or Academics)</label>
                    <textarea id="mat-awards" rows={2} value={form.awards_won} onChange={set('awards_won')} />
                  </div>
                </div>
 
                {/* ============ BIRTH HISTORY & MEDICAL ============ */}
                <div className="admission-form-block">
                  <h3 className="admission-block-title">
                    <HeartPulse size={17} /> Birth History & Medical Information
                  </h3>
 
                  <div className="admission-grid-2col">
                    <div className="admission-input-group">
                      <label>Birth Details</label>
                      <div className="radio-pill-group">
                        {['Normal', 'Caesarian', 'Forceps'].map((opt) => (
                          <label className="radio-pill" key={opt}>
                            <input type="radio" name="birth_details" checked={form.birth_details === opt} onChange={() => setForm((p) => ({ ...p, birth_details: opt }))} />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="admission-input-group">
                      <label>Birth Cry</label>
                      <div className="radio-pill-group">
                        {['Immediate', 'Delayed'].map((opt) => (
                          <label className="radio-pill" key={opt}>
                            <input type="radio" name="birth_cry" checked={form.birth_cry === opt} onChange={() => setForm((p) => ({ ...p, birth_cry: opt }))} />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
 
                  <span className="admission-block-subheading"><Ear size={15} style={{ verticalAlign: 'text-bottom', marginRight: 5 }} />Hearing</span>
                  <div className="admission-grid-2col">
                    <div className="admission-input-group">
                      <label>Any difficulty observed?</label>
                      <YesNo field="hearing_difficulty" />
                    </div>
                    <div className="admission-input-group">
                      <label>Any consultation with doctor done?</label>
                      <YesNo field="hearing_consultation_done" />
                    </div>
                  </div>
                  {(form.hearing_difficulty === 'Yes' || form.hearing_consultation_done === 'Yes') && (
                    <div className="admission-input-group">
                      <label htmlFor="mat-hearing-explain">If Yes, Explain</label>
                      <textarea id="mat-hearing-explain" rows={2} value={form.hearing_explain} onChange={set('hearing_explain')} />
                    </div>
                  )}
 
                  <span className="admission-block-subheading"><Eye size={15} style={{ verticalAlign: 'text-bottom', marginRight: 5 }} />Vision</span>
                  <div className="admission-grid-2col">
                    <div className="admission-input-group">
                      <label>Any consultation with doctor done?</label>
                      <YesNo field="vision_consultation_done" />
                    </div>
                    <div className="admission-input-group">
                      <label>Use of Spectacles / Corrective Lenses?</label>
                      <YesNo field="vision_spectacles" />
                    </div>
                  </div>
 
                  <span className="admission-block-subheading"><Baby size={15} style={{ verticalAlign: 'text-bottom', marginRight: 5 }} />Motor Milestones (Approx. Months)</span>
                  <div className="admission-grid-2col">
                    <div className="admission-input-group"><label>Sitting</label><input type="text" value={form.milestone_sitting} onChange={set('milestone_sitting')} /></div>
                    <div className="admission-input-group"><label>Standing</label><input type="text" value={form.milestone_standing} onChange={set('milestone_standing')} /></div>
                  </div>
                  <div className="admission-grid-2col">
                    <div className="admission-input-group"><label>Walking</label><input type="text" value={form.milestone_walking} onChange={set('milestone_walking')} /></div>
                    <div className="admission-input-group"><label>Speech</label><input type="text" value={form.milestone_speech} onChange={set('milestone_speech')} /></div>
                  </div>
 
                  <div className="admission-input-group">
                    <label htmlFor="mat-medication">Any medication taken for medical conditions (attention deficit / thyroid / other)</label>
                    <textarea id="mat-medication" rows={2} value={form.medication_details} onChange={set('medication_details')} />
                  </div>
                  <div className="admission-input-group">
                    <label htmlFor="mat-allergy">Any allergy / medical information the school should be aware of</label>
                    <textarea id="mat-allergy" rows={2} value={form.allergy_details} onChange={set('allergy_details')} />
                  </div>
                </div>
 
                {/* ============ ENCLOSURES ============ */}
                <div className="admission-form-block">
                  <h3 className="admission-block-title">
                    <FileCheck size={17} /> C. Enclosures
                  </h3>
                  <p className="admission-block-hint">All documents are mandatory at the time of admission. Staple all documents to the top left-hand corner of the printed application.</p>
 
                  <div className="enclosures-checklist">
                    <label className="checklist-item"><input type="checkbox" checked={form.enc_birth_certificate} onChange={set('enc_birth_certificate')} /><span>Birth Certificate (original &amp; photo copy)</span></label>
                    <label className="checklist-item"><input type="checkbox" checked={form.enc_transfer_certificate} onChange={set('enc_transfer_certificate')} /><span>Transfer Certificate (original copy)</span></label>
                    <label className="checklist-item"><input type="checkbox" checked={form.enc_child_photos} onChange={set('enc_child_photos')} /><span>Passport size photos of child (5 copies)</span></label>
                    <label className="checklist-item"><input type="checkbox" checked={form.enc_parent_photos} onChange={set('enc_parent_photos')} /><span>Passport size photos of parents (2 each)</span></label>
                    <label className="checklist-item"><input type="checkbox" checked={form.enc_aadhar_copy} onChange={set('enc_aadhar_copy')} /><span>Aadhar card copy of parents &amp; child</span></label>
                    <label className="checklist-item"><input type="checkbox" checked={form.enc_community_certificate} onChange={set('enc_community_certificate')} /><span>Community Certificate</span></label>
                    <label className="checklist-item"><input type="checkbox" checked={form.enc_passport_permit} onChange={set('enc_passport_permit')} /><span>Passport / Residential Permit (only for other nationality)</span></label>
                  </div>
                </div>
 
                {/* ============ MISCELLANEOUS ============ */}
                <div className="admission-form-block">
                  <h3 className="admission-block-title">
                    <Megaphone size={17} /> D. Miscellaneous
                  </h3>
                  <p className="admission-block-hint">How did you know about Carmel's Matriculation Higher Secondary School? (select all that apply)</p>
 
                  <div className="heard-about-row">
                    {HEARD_ABOUT_OPTIONS.map((opt) => (
                      <label className={`heard-about-pill ${form.heard_about_sources.includes(opt) ? 'selected' : ''}`} key={opt}>
                        <input type="checkbox" checked={form.heard_about_sources.includes(opt)} onChange={() => toggleHeardAbout(opt)} />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
 
                {/* ============ DECLARATION ============ */}
                <div className="admission-form-block declaration-block">
                  <h3 className="admission-block-title">
                    <ShieldAlert size={17} /> Declaration
                  </h3>
 
                  <div className="admission-input-group">
                    <label htmlFor="mat-declarant">
                      "I, ____________, have the authority to admit my child/ward as the parent/legal guardian." — Full name *
                    </label>
                    <input id="mat-declarant" type="text" required value={form.declarant_name} onChange={set('declarant_name')} />
                  </div>
 
                  <ul className="declaration-list">
                    <li>I undertake the responsibility of providing any evidence needed to support the information provided here, if necessary for any reason.</li>
                    <li>I declare that the statements provided in this application are correct to my knowledge, and if found otherwise, I shall abide by the decision of the management.</li>
                    <li>I agree to abide by the rules, regulations and the fee structure of the school.</li>
                  </ul>
 
                  <label className="checklist-item declaration-agree">
                    <input type="checkbox" required checked={form.declaration_agreed} onChange={set('declaration_agreed')} />
                    <span>I have read and agree to the declaration above. *</span>
                  </label>
 
                  <div className="admission-input-group signature-group">
                    <label htmlFor="mat-signature">
                      <PenLine size={15} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} />
                      Signature of Parent / Guardian — type full name to sign *
                    </label>
                    <input
                      id="mat-signature"
                      type="text"
                      required
                      placeholder="Type your full name as signature"
                      value={form.guardian_signature_name}
                      onChange={set('guardian_signature_name')}
                      className="signature-input"
                    />
                  </div>
                </div>
 
                <button type="submit" className="btn-admission-primary btn-admission-submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : <><Send size={17} /> Submit Matriculation Admission Application</>}
                </button>
 
                <p className="admission-form-note">
                  * Required fields. By submitting, you agree to be contacted by Carmel's Matriculation Hr. Sec. School regarding this application.
                </p>
              </form>
            )}
 
          </div>
        </div>
      </section>
    </div>
  );
}