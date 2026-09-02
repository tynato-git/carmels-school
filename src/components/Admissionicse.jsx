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
  Camera,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import './Admissionicse.css';
 
// ==========================================================
// BACKEND NOTE
// This form inserts into a Supabase table `icse_admission_applications`.
// Run once in Supabase SQL editor:
//
// create table public.icse_admission_applications (
//   id uuid primary key default gen_random_uuid(),
//
//   -- Student
//   student_name text not null,
//   student_photo_path text,
//   gender text,
//   dob date,
//   dob_words text,
//   religion text,
//   caste text,
//   community text,
//   nationality text,
//   aadhar_number text,
//   emis_number text,
//   mother_tongue text,
//   admission_standard text not null,
//   academic_year text,
//   last_school_name text,
//   last_school_class text,
//   is_staff_ward boolean default false,
//   staff_ward_parent_name text,
//
//   -- Father / Guardian
//   father_name text,
//   father_qualification text,
//   father_occupation text,
//   father_annual_income text,
//   father_office_address text,
//   father_phone text,
//   father_residential_address text,
//   father_residential_phone text,
//
//   -- Mother
//   mother_name text,
//   mother_qualification text,
//   mother_occupation text,
//   mother_annual_income text,
//   mother_office_address text,
//   mother_phone text,
//   mother_residential_address text,
//   mother_residential_phone text,
//
//   -- Contact & Emergency
//   sms_phone text not null,
//   emergency_contact_no text,
//   emergency_contact_person text,
//   emergency_relationship text,
//
//   -- Enclosures
//   enc_transfer_certificate boolean default false,
//   enc_birth_certificate boolean default false,
//   enc_community_certificate boolean default false,
//   enc_aadhar_xerox boolean default false,
//   enc_passport_xerox boolean default false,
//
//   -- Declaration
//   declaration_agreed boolean not null,
//   guardian_signature_name text not null,
//
//   status text default 'new',
//   created_at timestamptz default now(),
//   updated_at timestamptz default now()
// );
// alter table public.icse_admission_applications enable row level security;
// create policy "Allow public insert" on public.icse_admission_applications for insert to anon with check (true);
// create policy "Allow authenticated read" on public.icse_admission_applications for select to authenticated using (true);
//
// -- Student photos are NOT stored in the public `carmel_media` bucket.
// -- Create a PRIVATE bucket and let the authenticated admin dashboard
// -- generate short-lived signed URLs when a photo is displayed:
// insert into storage.buckets (id, name, public)
// values ('carmel_admission_photos', 'carmel_admission_photos', false)
// on conflict (id) do update set public = false;
//
// create policy "Allow ICSE admission photo upload"
// on storage.objects for insert to anon
// with check (bucket_id = 'carmel_admission_photos' and name like 'admissions/icse/%');
//
// create policy "Allow authenticated admin photo view"
// on storage.objects for select to authenticated
// using (bucket_id = 'carmel_admission_photos');
//
// create policy "Allow authenticated admin photo delete"
// on storage.objects for delete to authenticated
// using (bucket_id = 'carmel_admission_photos');
//
// Admissions are kept in the dedicated admission table; do not duplicate them in `enquiries`.
// ==========================================================
 
const CLASS_OPTIONS = [
  'Montessori / Pre-KG', 'LKG', 'UKG',
  'Std I', 'Std II', 'Std III', 'Std IV', 'Std V',
  'Std VI', 'Std VII', 'Std VIII',
  'Std IX', 'Std X', 'Std XI', 'Std XII'
];
 
const currentYear = new Date().getFullYear();
const DEFAULT_ACADEMIC_YEAR = `${currentYear}-${String(currentYear + 1).slice(-2)}`;

const STUDENT_PHOTO_BUCKET = 'carmel_admission_photos';
const MAX_STUDENT_PHOTO_SIZE = 8 * 1024 * 1024;
const ALLOWED_STUDENT_PHOTO_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

const getTodayISO = () => new Date().toISOString().slice(0, 10);

const isValidDateString = (value) => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const normalizeIndianPhone = (value) => {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) return digits;
  if (digits.length === 12 && digits.startsWith('91') && /^[6-9]\d{9}$/.test(digits.slice(2))) {
    return digits.slice(2);
  }
  return null;
};

const isValidAcademicYear = (value) => {
  const match = String(value || '').trim().match(/^(\d{4})-(\d{2})$/);
  if (!match) return false;
  const start = Number(match[1]);
  const end = Number(match[2]);
  return end === (start + 1) % 100;
};

const REQUIRED_ICSE_FIELDS = [
  ['Gender', 'gender'],
  ['Date of Birth', 'dob'],
  ['Date of Birth in Words', 'dob_words'],
  ['Religion', 'religion'],
  ['Caste', 'caste'],
  ['Community', 'community'],
  ['Nationality', 'nationality'],
  ['Aadhar Number', 'aadhar_number'],
  
  ['Mother Tongue', 'mother_tongue'],
  ['Father / Guardian Name', 'father_name'],
  ['Father / Guardian Educational Qualification', 'father_qualification'],
  ['Father / Guardian Occupation', 'father_occupation'],
  ['Father / Guardian Annual Income', 'father_annual_income'],

  ['Father / Guardian Phone Number', 'father_phone'],
  ['Father / Guardian Residential Address', 'father_residential_address'],
  
  ['Mother Name', 'mother_name'],
  ['Mother Educational Qualification', 'mother_qualification'],
  ['Mother Occupation', 'mother_occupation'],
  ['Mother Annual Income', 'mother_annual_income'],
  ['Mother Phone Number', 'mother_phone'],
  ['Mother Residential Address', 'mother_residential_address'],
  
  ['School SMS Phone Number', 'sms_phone']
];

const validateStudentPhoto = (file) => {
  if (!file) return 'Please upload the student photograph before submitting.';
  if (!Object.prototype.hasOwnProperty.call(ALLOWED_STUDENT_PHOTO_TYPES, file.type)) {
    return 'Student photo must be JPG, PNG, or WebP only.';
  }
  if (file.size > MAX_STUDENT_PHOTO_SIZE) {
    return 'Student photo must be under 8MB.';
  }
  return null;
};

const readImageDimensions = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        URL.revokeObjectURL(image.src);
        resolve({ width: image.naturalWidth, height: image.naturalHeight });
      };

      image.onerror = () => {
        URL.revokeObjectURL(image.src);
        reject(new Error('The selected file is not a readable image.'));
      };

      image.src = reader.result;
    };

    reader.onerror = () => reject(new Error('Unable to read the selected image.'));
    reader.readAsDataURL(file);
  });

 
const INITIAL_FORM = {
  student_name: '',
  student_photo_path: '',
  gender: '',
  dob: '',
  dob_words: '',
  religion: '',
  caste: '',
  community: '',
  nationality: 'Indian',
  aadhar_number: '',
  emis_number: '',
  mother_tongue: '',
  admission_standard: '',
  academic_year: DEFAULT_ACADEMIC_YEAR,
  last_school_name: '',
  last_school_class: '',
  is_staff_ward: false,
  staff_ward_parent_name: '',
 
  father_name: '',
  father_qualification: '',
  father_occupation: '',
  father_annual_income: '',
  father_office_address: '',
  father_phone: '',
  father_residential_address: '',
  father_residential_phone: '',
 
  mother_name: '',
  mother_qualification: '',
  mother_occupation: '',
  mother_annual_income: '',
  mother_office_address: '',
  mother_phone: '',
  mother_residential_address: '',
  mother_residential_phone: '',
 
  sms_phone: '',
  emergency_contact_no: '',
  emergency_contact_person: '',
  emergency_relationship: '',
 
  enc_transfer_certificate: false,
  enc_birth_certificate: false,
  enc_community_certificate: false,
  enc_aadhar_xerox: false,
  enc_passport_xerox: false,
 
  declaration_agreed: false,
  guardian_signature_name: ''
};
 
export default function AdmissionICSE({ onBack, onNavigateHome }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [studentPhotoFile, setStudentPhotoFile] = useState(null);
  const [studentPhotoPreview, setStudentPhotoPreview] = useState('');
 
  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };
 
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubmitError(null);

    const validationError = validateStudentPhoto(file);
    if (validationError) {
      setSubmitError(validationError);
      e.target.value = '';
      return;
    }

    try {
      const { width, height } = await readImageDimensions(file);

      // Reject tiny/corrupt images while keeping the accepted formats broad.
      if (width < 300 || height < 300) {
        setSubmitError('Student photo is too small. Please upload an image at least 300 × 300 pixels.');
        e.target.value = '';
        return;
      }

      const previewReader = new FileReader();
      previewReader.onload = () => setStudentPhotoPreview(String(previewReader.result || ''));
      previewReader.readAsDataURL(file);

      // Keep the file local until the application passes all validation.
      // This prevents unused photos from being uploaded while the user is
      // still filling the form and makes Change/Remove predictable.
      setStudentPhotoFile(file);
      setForm((prev) => ({ ...prev, student_photo_path: '' }));
    } catch (err) {
      setSubmitError(err.message || 'Unable to validate the selected student photo.');
    } finally {
      e.target.value = '';
    }
  };

  const handleRemovePhoto = () => {
    setStudentPhotoFile(null);
    setStudentPhotoPreview('');
    setForm((prev) => ({ ...prev, student_photo_path: '' }));
    setSubmitError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const studentName = form.student_name.trim();
    const admissionStandard = form.admission_standard.trim();
    const academicYear = form.academic_year.trim();
    const fatherName = form.father_name.trim();
    const motherName = form.mother_name.trim();
    const guardianSignature = form.guardian_signature_name.trim();

    if (!studentName) {
      setSubmitError('Please enter the student name.');
      return;
    }

    if (!admissionStandard || !CLASS_OPTIONS.includes(admissionStandard)) {
      setSubmitError('Please select a valid admission standard.');
      return;
    }

    if (!isValidAcademicYear(academicYear)) {
      setSubmitError('Please enter the academic year in the format YYYY-YY, for example 2026-27.');
      return;
    }

    for (const [label, field] of REQUIRED_ICSE_FIELDS) {
      const value = form[field];
      if (!String(value ?? '').trim()) {
        setSubmitError(`${label} is mandatory. Please complete this field before submitting.`);
        return;
      }
    }

    if (!form.gender || !['Male', 'Female'].includes(form.gender)) {
      setSubmitError('Please select Male or Female for Gender.');
      return;
    }

    if (!isValidDateString(form.dob)) {
      setSubmitError('Please select a valid Date of Birth.');
      return;
    }

    if (form.dob > getTodayISO()) {
      setSubmitError('Date of birth cannot be a future date.');
      return;
    }

    const phoneFields = [
  ['Father / Guardian phone number', form.father_phone],
  ['Mother phone number', form.mother_phone],
  ['School SMS phone number', form.sms_phone]
];

    const normalizedPhones = {};
    for (const [label, value] of phoneFields) {
      const normalized = normalizeIndianPhone(value);
      if (!normalized) {
        setSubmitError(`${label} is mandatory and must be a valid 10-digit Indian mobile number.`);
        return;
      }
      normalizedPhones[label] = normalized;
    }

    if (!guardianSignature) {
      setSubmitError('Please type the parent/guardian name as the signature.');
      return;
    }

    if (!form.declaration_agreed) {
      setSubmitError('Please tick the declaration checkbox before submitting the application.');
      return;
    }

    if (form.is_staff_ward && !form.staff_ward_parent_name.trim()) {
      setSubmitError('Please enter the staff parent name for a staff-ward application.');
      return;
    }

    const photoValidationError = validateStudentPhoto(studentPhotoFile);
    if (photoValidationError) {
      setSubmitError(photoValidationError);
      return;
    }

    if (form.aadhar_number && !/^\d{12}$/.test(form.aadhar_number.replace(/\s/g, ''))) {
      setSubmitError('Aadhar Number must contain exactly 12 digits.');
      return;
    }

    if (form.emis_number && !/^\d+$/.test(form.emis_number.trim())) {
      setSubmitError('EMIS Number must contain digits only.');
      return;
    }

    setSubmitting(true);
    setUploadingPhoto(Boolean(studentPhotoFile));

    let uploadedPhotoPath = null;

    try {
      // The bucket is intentionally private. Store only the object path in
      // the admission row. The authenticated admin dashboard will generate
      // short-lived signed URLs when displaying the photo.
      const extension = ALLOWED_STUDENT_PHOTO_TYPES[studentPhotoFile.type];
      const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const filePath = `admissions/icse/${uniqueId}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(STUDENT_PHOTO_BUCKET)
        .upload(filePath, studentPhotoFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: studentPhotoFile.type
        });

      if (uploadError) throw new Error(`Student photo upload failed: ${uploadError.message}`);
      uploadedPhotoPath = filePath;

      const { error } = await supabase.from('icse_admission_applications').insert([
        {
          student_name: studentName,
          student_photo_path: uploadedPhotoPath,
          gender: form.gender || null,
          dob: form.dob || null,
          dob_words: form.dob_words.trim() || null,
          religion: form.religion.trim() || null,
          caste: form.caste.trim() || null,
          community: form.community.trim() || null,
          nationality: form.nationality.trim() || null,
          aadhar_number: form.aadhar_number.replace(/\s/g, '') || null,
          emis_number: form.emis_number.trim() || null,
          mother_tongue: form.mother_tongue.trim() || null,
          admission_standard: admissionStandard,
          academic_year: academicYear,
          last_school_name: form.last_school_name.trim() || null,
          last_school_class: form.last_school_class.trim() || null,
          is_staff_ward: form.is_staff_ward,
          staff_ward_parent_name: form.staff_ward_parent_name.trim() || null,

          father_name: fatherName || null,
          father_qualification: form.father_qualification.trim() || null,
          father_occupation: form.father_occupation.trim() || null,
          father_annual_income: form.father_annual_income.trim() || null,
          father_office_address: form.father_office_address.trim() || null,
          father_phone: normalizedPhones['Father / Guardian phone number'],
          father_residential_address: form.father_residential_address.trim() || null,
          

          mother_name: motherName || null,
          mother_qualification: form.mother_qualification.trim() || null,
          mother_occupation: form.mother_occupation.trim() || null,
          mother_annual_income: form.mother_annual_income.trim() || null,
          mother_office_address: form.mother_office_address.trim() || null,
          mother_phone: normalizedPhones['Mother phone number'],
          mother_residential_address: form.mother_residential_address.trim() || null,
          

          sms_phone: normalizedPhones['School SMS phone number'],
          emergency_contact_no: form.emergency_contact_no.trim() || null,
          emergency_contact_person: form.emergency_contact_person.trim() || null,
          emergency_relationship: form.emergency_relationship.trim() || null,

          enc_transfer_certificate: form.enc_transfer_certificate,
          enc_birth_certificate: form.enc_birth_certificate,
          enc_community_certificate: form.enc_community_certificate,
          enc_aadhar_xerox: form.enc_aadhar_xerox,
          enc_passport_xerox: form.enc_passport_xerox,

          declaration_agreed: true,
          guardian_signature_name: guardianSignature,
          status: 'new'
        }
      ]);

      if (error) {
        // The upload succeeded but the DB insert failed. Do not leave an
        // orphaned student photograph in storage when the user is allowed
        // to retry the application.
        if (uploadedPhotoPath) {
          await supabase.storage
            .from(STUDENT_PHOTO_BUCKET)
            .remove([uploadedPhotoPath])
            .catch(() => {});
        }

        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          setSubmitError('The admission database is not ready yet. Please contact the school office while the setup is completed.');
        } else {
          setSubmitError(`Unable to save the admission application: ${error.message}`);
        }
        return;
      }

      setSubmitted(true);
      setForm(INITIAL_FORM);
      setStudentPhotoFile(null);
      setStudentPhotoPreview('');
    } catch (err) {
      if (uploadedPhotoPath) {
        await supabase.storage
          .from(STUDENT_PHOTO_BUCKET)
          .remove([uploadedPhotoPath])
          .catch(() => {});
      }
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
      setUploadingPhoto(false);
    }
  };

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
          <span className="sub-badge">Carmel's English School</span>
          <h1 className="admission-title">
            <School size={30} className="admission-title-icon" />
            ICSE / ISC Admission Application
          </h1>
          <p className="admission-subtitle">
            Montessori / ICSE / ISC Syllabus &bull; Carmel Gardens, RamalingaNagar West Extn, Woraiyur, Trichy-3
            &bull; Ph: 0431-2774402, 7868023548
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
                  Thank you for applying to Carmel's English School. Please bring the original
                  documents listed in the Enclosures section on your visit to the school office.
                  Our admissions team will contact you on the phone number provided.
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
 
                {/* ============ 1. STUDENT DETAILS ============ */}
                <div className="admission-form-block">
                  <h3 className="admission-block-title">
                    <User size={17} /> Student Details
                  </h3>
 
                  <div className="admission-input-group">
                    <label htmlFor="icse-student-name">1. Name of the Student (as in Birth Certificate, with initials at the end) *</label>
                    <input
                      id="icse-student-name"
                      type="text"
                      required
                      placeholder="e.g. Aravind S."
                      value={form.student_name}
                      onChange={set('student_name')}
                    />
                  </div>

                  <div className="student-photo-panel">
                    <div className="student-photo-copy">
                      <div className="student-photo-icon"><Camera size={18} /></div>
                      <div>
                        <strong>Student Photograph *</strong>
                        <p>Required. JPG, PNG or WebP, up to 8MB. Minimum 300 × 300 pixels.</p>
                      </div>
                    </div>

                    <div className="student-photo-control">
                      {studentPhotoPreview ? (
                        <img src={studentPhotoPreview} alt="Student preview" className="student-photo-preview" />
                      ) : (
                        <div className="student-photo-placeholder">
                          <Camera size={24} />
                          <span>No photo selected</span>
                        </div>
                      )}

                      <div className="student-photo-actions">
                        <label className="photo-affix-upload-btn">
                          {studentPhotoFile ? 'Change Photo' : 'Upload Photo'}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handlePhotoUpload}
                            disabled={submitting}
                            hidden
                          />
                        </label>

                        {studentPhotoFile && (
                          <button
                            type="button"
                            className="photo-remove-btn"
                            onClick={handleRemovePhoto}
                            disabled={submitting}
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>

                      {studentPhotoFile && (
                        <span className="student-photo-file-name">{studentPhotoFile.name}</span>
                      )}
                    </div>
                  </div>

                  <div className="admission-grid-2col">
                    <div className="admission-input-group">
                      <label>2. Gender *</label>
                      <div className="radio-pill-group">
                        <label className="radio-pill">
                          <input type="radio" name="gender" required checked={form.gender === 'Male'} onChange={() => setForm((p) => ({ ...p, gender: 'Male' }))} />
                          Male
                        </label>
                        <label className="radio-pill">
                          <input type="radio" name="gender" checked={form.gender === 'Female'} onChange={() => setForm((p) => ({ ...p, gender: 'Female' }))} />
                          Female
                        </label>
                      </div>
                    </div>
 
                    <div className="admission-input-group">
                      <label htmlFor="icse-dob">3. Date of Birth *</label>
                      <div className="admission-input-icon-wrap">
                        <Calendar size={16} className="input-icon" />
                        <input id="icse-dob" type="date" required max={getTodayISO()} value={form.dob} onChange={set('dob')} />
                      </div>
                    </div>
                  </div>
 
                  <div className="admission-input-group">
                    <label htmlFor="icse-dob-words">Date of Birth in Words *</label>
                    <input
                      id="icse-dob-words"
                      type="text"
                      required
                      placeholder="e.g. Fifth of March, Two Thousand and Nineteen"
                      value={form.dob_words}
                      onChange={set('dob_words')}
                    />
                  </div>
 
                  <div className="admission-grid-3col">
                    <div className="admission-input-group">
                      <label htmlFor="icse-religion">4. Religion *</label>
                      <input id="icse-religion" type="text" required value={form.religion} onChange={set('religion')} />
                    </div>
                    <div className="admission-input-group">
                      <label htmlFor="icse-caste">5. Caste *</label>
                      <input id="icse-caste" type="text" required value={form.caste} onChange={set('caste')} />
                    </div>
                    <div className="admission-input-group">
                      <label htmlFor="icse-community">6. Community *</label>
                      <input id="icse-community" type="text" required value={form.community} onChange={set('community')} />
                    </div>
                  </div>
 
                  <div className="admission-grid-3col">
                    <div className="admission-input-group">
                      <label htmlFor="icse-nationality">7. Nationality *</label>
                      <input id="icse-nationality" type="text" required value={form.nationality} onChange={set('nationality')} />
                    </div>
                    <div className="admission-input-group">
                      <label htmlFor="icse-aadhar">8. Aadhar Number *</label>
                      <input id="icse-aadhar" type="text" required inputMode="numeric" maxLength={14} placeholder="XXXX XXXX XXXX" value={form.aadhar_number} onChange={set('aadhar_number')} />
                    </div>
                    <div className="admission-input-group">
                      <label htmlFor="icse-emis">9. EMIS Number </label>
                      <input id="icse-emis" type="text" inputMode="numeric" value={form.emis_number} onChange={set('emis_number')} />
                    </div>
                  </div>
 
                  <div className="admission-input-group">
                    <label htmlFor="icse-mother-tongue">10. Mother Tongue *</label>
                    <input id="icse-mother-tongue" type="text" required value={form.mother_tongue} onChange={set('mother_tongue')} />
                  </div>
 
                  <div className="admission-grid-2col">
                    <div className="admission-input-group">
                      <label htmlFor="icse-standard">11. Admission for Standard *</label>
                      <select id="icse-standard" required className="admission-select" value={form.admission_standard} onChange={set('admission_standard')}>
                        <option value="">Select a class</option>
                        {CLASS_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="admission-input-group">
                      <label htmlFor="icse-year">For the Academic Year *</label>
                      <input id="icse-year" type="text" required pattern="\d{4}-\d{2}" placeholder="2026-27" value={form.academic_year} onChange={set('academic_year')} />
                    </div>
                  </div>
 
                  <div className="admission-grid-2col">
                    <div className="admission-input-group">
                      <label htmlFor="icse-last-school">12. Last School Studied *</label>
                      <input id="icse-last-school" type="text"  value={form.last_school_name} onChange={set('last_school_name')} />
                    </div>
                    <div className="admission-input-group">
                      <label htmlFor="icse-last-class">Last Class Studied *</label>
                      <input id="icse-last-class" type="text" required value={form.last_school_class} onChange={set('last_school_class')} />
                    </div>
                  </div>

                  <div className="staff-ward-panel">
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
                        <label htmlFor="icse-staff-parent">Name of the Parent (Staff) *</label>
                        <input id="icse-staff-parent" type="text" required placeholder="Enter the staff parent's name" value={form.staff_ward_parent_name} onChange={set('staff_ward_parent_name')} />
                      </div>
                    )}
                  </div>
                </div>
 
                {/* ============ 13. PARENTS PARTICULARS ============ */}
                <div className="admission-form-block">
                  <h3 className="admission-block-title">
                    <UsersIcon size={17} /> 13. Parents Particulars
                  </h3>
 
                  <div className="parent-details-grid">
                    {/* Father / Guardian */}
                    <div className="parent-column">
                      <span className="parent-column-heading">Father / Guardian</span>
 
                      <div className="admission-input-group">
                        <label htmlFor="father-name">Name *</label>
                        <input id="father-name" required type="text" value={form.father_name} onChange={set('father_name')} />
                      </div>
                      <div className="admission-input-group">
                        <label htmlFor="father-qual">Educational Qualification *</label>
                        <input id="father-qual" required type="text" value={form.father_qualification} onChange={set('father_qualification')} />
                      </div>
                      <div className="admission-input-group">
                        <label htmlFor="father-occ">Occupation *</label>
                        <input id="father-occ" required type="text" value={form.father_occupation} onChange={set('father_occupation')} />
                      </div>
                      <div className="admission-input-group">
                        <label htmlFor="father-income">Annual Income *</label>
                        <input id="father-income" required type="text" value={form.father_annual_income} onChange={set('father_annual_income')} />
                      </div>
                      <div className="admission-input-group">
                        <label htmlFor="father-office">Office Address </label>
                        <textarea id="father-office"  rows={2} value={form.father_office_address} onChange={set('father_office_address')} />
                      </div>
                      <div className="admission-input-group">
                        <label htmlFor="father-phone">Phone Number *</label>
                        <input id="father-phone" type="tel" required inputMode="tel" value={form.father_phone} onChange={set('father_phone')} placeholder="10-digit mobile number" />
                      </div>
                      <div className="admission-input-group">
                        <label htmlFor="father-res-addr">Residential Address *</label>
                        <textarea id="father-res-addr" required rows={2} value={form.father_residential_address} onChange={set('father_residential_address')} />
                      </div>
                      
                    </div>
 
                    {/* Mother */}
                    <div className="parent-column">
                      <span className="parent-column-heading">Mother</span>
 
                      <div className="admission-input-group">
                        <label htmlFor="mother-name">Name *</label>
                        <input id="mother-name" required type="text" value={form.mother_name} onChange={set('mother_name')} />
                      </div>
                      <div className="admission-input-group">
                        <label htmlFor="mother-qual">Educational Qualification *</label>
                        <input id="mother-qual" required type="text" value={form.mother_qualification} onChange={set('mother_qualification')} />
                      </div>
                      <div className="admission-input-group">
                        <label htmlFor="mother-occ">Occupation *</label>
                        <input id="mother-occ" required type="text" value={form.mother_occupation} onChange={set('mother_occupation')} />
                      </div>
                      <div className="admission-input-group">
                        <label htmlFor="mother-income">Annual Income *</label>
                        <input id="mother-income" required type="text" value={form.mother_annual_income} onChange={set('mother_annual_income')} />
                      </div>
                      <div className="admission-input-group">
                        <label htmlFor="mother-office">Office Address </label>
                        <textarea id="mother-office"  rows={2} value={form.mother_office_address} onChange={set('mother_office_address')} />
                      </div>
                      <div className="admission-input-group">
                        <label htmlFor="mother-phone">Phone Number *</label>
                        <input id="mother-phone" type="tel" required inputMode="tel" value={form.mother_phone} onChange={set('mother_phone')} placeholder="10-digit mobile number" />
                      </div>
                      <div className="admission-input-group">
                        <label htmlFor="mother-res-addr">Residential Address *</label>
                        <textarea id="mother-res-addr" required rows={2} value={form.mother_residential_address} onChange={set('mother_residential_address')} />
                      </div>
                      
                    </div>
                  </div>
                </div>
 
                {/* ============ 14 & 15. CONTACT + EMERGENCY ============ */}
                <div className="admission-form-block">
                  <h3 className="admission-block-title">
                    <Phone size={17} /> Contact & Emergency Details
                  </h3>
 
                  <div className="admission-input-group">
                    <label htmlFor="sms-phone">14. Preferred Phone Number for School SMS *</label>
                    <div className="admission-input-icon-wrap">
                      <Phone size={16} className="input-icon" />
                      <input id="sms-phone" type="tel" required value={form.sms_phone} onChange={set('sms_phone')} placeholder="10-digit mobile number" />
                    </div>
                  </div>
 
                  <span className="admission-block-subheading">15. In Case of Emergency</span>
                  <div className="admission-grid-3col">
                    <div className="admission-input-group">
                      <label htmlFor="em-contact-no">Contact No.</label>
                      <input id="em-contact-no" type="tel" value={form.emergency_contact_no} onChange={set('emergency_contact_no')} />
                    </div>
                    <div className="admission-input-group">
                      <label htmlFor="em-contact-person">Person to be Contacted</label>
                      <input id="em-contact-person" type="text" value={form.emergency_contact_person} onChange={set('emergency_contact_person')} />
                    </div>
                    <div className="admission-input-group">
                      <label htmlFor="em-relationship">Relationship</label>
                      <input id="em-relationship" type="text" value={form.emergency_relationship} onChange={set('emergency_relationship')} />
                    </div>
                  </div>
                </div>
 
                {/* ============ ENCLOSURES ============ */}
                <div className="admission-form-block">
                  <h3 className="admission-block-title">
                    <FileCheck size={17} /> Enclosures
                  </h3>
                  <p className="admission-block-hint">
                    Tick the documents you will bring/have attached. Originals must be produced at the school office.
                  </p>
 
                  <div className="enclosures-checklist">
                    <label className="checklist-item">
                      <input type="checkbox" checked={form.enc_transfer_certificate} onChange={set('enc_transfer_certificate')} />
                      <span>1. Transfer Certificate (Original)</span>
                    </label>
                    <label className="checklist-item">
                      <input type="checkbox" checked={form.enc_birth_certificate} onChange={set('enc_birth_certificate')} />
                      <span>2. Birth Certificate (Original)</span>
                    </label>
                    <label className="checklist-item">
                      <input type="checkbox" checked={form.enc_community_certificate} onChange={set('enc_community_certificate')} />
                      <span>3. Community Certificate (Xerox)</span>
                    </label>
                    <label className="checklist-item">
                      <input type="checkbox" checked={form.enc_aadhar_xerox} onChange={set('enc_aadhar_xerox')} />
                      <span>4. Aadhar (Xerox)</span>
                    </label>
                    <label className="checklist-item">
                      <input type="checkbox" checked={form.enc_passport_xerox} onChange={set('enc_passport_xerox')} />
                      <span>5. If other Nationality — Xerox of Passport / Residential Permit</span>
                    </label>
                  </div>
                </div>
 
                {/* ============ DECLARATION ============ */}
                <div className="admission-form-block declaration-block">
                  <h3 className="admission-block-title">
                    <ShieldAlert size={17} /> Declaration
                  </h3>
 
                  <ul className="declaration-list">
                    <li>I declare that the particulars given above are correct to the best of my knowledge.</li>
                    <li>I will abide by the rules of the school if admission is obtained.</li>
                    <li>I am aware that the fees will not be refunded for any reason once the admission is obtained.</li>
                  </ul>
 
                  <label className="checklist-item declaration-agree">
                    <input type="checkbox" required aria-required="true" checked={form.declaration_agreed} onChange={set('declaration_agreed')} />
                    <span>I have read and agree to the declaration above. *</span>
                  </label>
 
                  <div className="admission-input-group signature-group">
                    <label htmlFor="signature-name">
                      <PenLine size={15} style={{ verticalAlign: 'text-bottom', marginRight: 4 }} />
                      Signature of the Parent / Guardian — type full name to sign *
                    </label>
                    <input
                      id="signature-name"
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
                  {submitting ? 'Submitting...' : <><Send size={17} /> Submit ICSE Admission Application</>}
                </button>
 
                <p className="admission-form-note">
                  * Required fields. By submitting, you agree to be contacted by Carmel's English School regarding this application.
                </p>
              </form>
            )}
 
          </div>
        </div>
      </section>
    </div>
  );
}