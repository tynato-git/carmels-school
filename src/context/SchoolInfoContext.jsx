import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const DEFAULT_SCHOOL_INFO = {
  school_name: "Carmel's Schools",
  tagline: "Matriculation Hr. Sec. School & ICSE School • Trichy",
  about_summary: "At Carmel's School, our campuses are thoughtfully equipped to support every learner's journey, from structured academics and sports to creativity, discovery, and safety. Every facility is designed to enable growth, comfort, and all-round development.",
  admission_year: "2026-27",
  phone_primary: "7868023528",
  phone_secondary: "7868023548",
  whatsapp_number: "7868023528",
  email_matric: "carmels.matric.school@gmail.com",
  email_icse: "carmels.english.school@gmail.com",
  email_general: "carmels.matric.school@gmail.com",
  address_line: "Carmel Gardens, Ramalinga Nagar West Extn., Woraiyur, Trichy - 620003, Tamil Nadu.",
  city: "Trichy",
  pincode: "620003",
  google_maps_link: "https://maps.app.goo.gl/CvAP2GwhALXCewoH8",
  map_embed_url: "https://maps.google.com/maps?q=10.8193,78.67554&t=k&z=17&ie=UTF8&iwloc=&output=embed",
  office_hours: "Monday - Saturday: 8:30 AM - 4:00 PM",
  facebook_url: "https://www.facebook.com/carmelsschools/",
  instagram_url: "https://www.instagram.com/carmelsschool/",
  youtube_url: "https://www.youtube.com/@carmelsschool"
};

const SchoolInfoContext = createContext({
  schoolInfo: DEFAULT_SCHOOL_INFO,
  loading: false,
  refreshSchoolInfo: () => {}
});

export function SchoolInfoProvider({ children }) {
  const [schoolInfo, setSchoolInfo] = useState(DEFAULT_SCHOOL_INFO);
  const [loading, setLoading] = useState(true);

  const fetchSchoolInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('school_info')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setSchoolInfo({
          ...DEFAULT_SCHOOL_INFO,
          ...data
        });
      } else {
        setSchoolInfo(DEFAULT_SCHOOL_INFO);
      }
    } catch (err) {
      console.log('Using default school info fallback:', err);
      setSchoolInfo(DEFAULT_SCHOOL_INFO);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchoolInfo();
  }, []);

  return (
    <SchoolInfoContext.Provider value={{ schoolInfo, loading, refreshSchoolInfo: fetchSchoolInfo }}>
      {children}
    </SchoolInfoContext.Provider>
  );
}

export function useSchoolInfo() {
  return useContext(SchoolInfoContext);
}
