# Carmel's School - Supabase Database Schema & Reference

This file documents all database tables, storage buckets, Row Level Security (RLS) policies, and queries used across Carmel's School website.

---

## 1. Hero Carousel Slides (`carousel_slides`)

Stores banner slides displayed dynamically on the Home page hero section (Maximum limit: 5 active slides).

### SQL: Create Table & Policies
```sql
CREATE TABLE IF NOT EXISTS public.carousel_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag TEXT DEFAULT 'Welcome to Carmel''s School',
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    button_text TEXT DEFAULT 'Contact Us',
    button_link TEXT DEFAULT 'contact',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.carousel_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access for carousel slides" ON public.carousel_slides FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access for carousel slides" ON public.carousel_slides FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

---

## 2. Campus Photo Gallery (`campus_gallery`)

Stores photos displayed dynamically in the **Campus Photo Gallery** on the Campuses & Home page.

### SQL: Create Table & Policies
```sql
CREATE TABLE IF NOT EXISTS public.campus_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'Campus',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.campus_gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for campus gallery" ON public.campus_gallery FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access for campus gallery" ON public.campus_gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

---

## 3. Media Posts (`media_posts`) - Blog, News & Events, Awards

Stores articles and dynamic cards for **Blog Stories**, **News & Events**, and **Awards & Achievements**.

### SQL: Create Table & Policies
```sql
CREATE TABLE IF NOT EXISTS public.media_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL DEFAULT 'blog', -- 'blog' | 'news' | 'awards'
    category TEXT NOT NULL DEFAULT 'academics',
    school TEXT NOT NULL DEFAULT 'all',
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    story TEXT,
    image_url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.media_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for media posts" ON public.media_posts FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access for media posts" ON public.media_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

---

## 4. Academic Results & Stats (`result_stats` & `academic_toppers`)

Stores board exam percentage highlights and top student achiever cards (Maximum limit: 5 Topper Cards).

### SQL: Create Tables & Policies
```sql
CREATE TABLE IF NOT EXISTS public.result_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stat_number TEXT NOT NULL,
    label TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.result_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for result stats" ON public.result_stats FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access for result stats" ON public.result_stats FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.academic_toppers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rank TEXT NOT NULL DEFAULT 'Rank 1',
    percentage TEXT NOT NULL DEFAULT '98.0%',
    name TEXT NOT NULL,
    photo_url TEXT,
    total_score TEXT NOT NULL,
    stream TEXT NOT NULL,
    badge_color TEXT DEFAULT 'gold',
    centums TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.academic_toppers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for academic toppers" ON public.academic_toppers FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access for academic toppers" ON public.academic_toppers FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

---

## 5. Careers & Job Openings (`career_jobs` & `career_applications`)

Stores dynamic job vacancies (No static fallback) and candidate job applications.

### SQL: Create Tables & Policies
```sql
CREATE TABLE IF NOT EXISTS public.career_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    job_type TEXT DEFAULT 'Full-Time',
    experience TEXT DEFAULT '2+ Years',
    location TEXT DEFAULT 'Trichy, TN',
    description TEXT NOT NULL,
    requirements TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.career_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for career jobs" ON public.career_jobs FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access for career jobs" ON public.career_jobs FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.career_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    position TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    experience TEXT,
    message TEXT,
    status TEXT DEFAULT 'New',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert for candidate applications" ON public.career_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated full access for candidate applications" ON public.career_applications FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

---

## 6. School Info & Contact Settings (`school_info`)

Stores global school details, phone numbers, email addresses, campus addresses, office hours, and social links (with fallback to default if empty).

### SQL: Create Table & Policies
```sql
-- 1. Create the school_info table
CREATE TABLE IF NOT EXISTS public.school_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_name TEXT NOT NULL DEFAULT 'Carmel''s Schools',
    tagline TEXT DEFAULT 'Matriculation Hr. Sec. School & ICSE School • Trichy',
    about_summary TEXT DEFAULT 'At Carmel''s School, our campuses are thoughtfully equipped to support every learner''s journey, from structured academics and sports to creativity, discovery, and safety. Every facility is designed to enable growth, comfort, and all-round development.',
    admission_year TEXT DEFAULT '2026-27',
    phone_primary TEXT DEFAULT '7868023528',
    phone_secondary TEXT DEFAULT '7868023548',
    whatsapp_number TEXT DEFAULT '7868023528',
    email_matric TEXT DEFAULT 'carmels.matric.school@gmail.com',
    email_icse TEXT DEFAULT 'carmels.english.school@gmail.com',
    email_general TEXT DEFAULT 'carmels.matric.school@gmail.com',
    address_line TEXT DEFAULT 'Carmel Gardens, Ramalinga Nagar West Extn., Woraiyur, Trichy - 620003, Tamil Nadu.',
    city TEXT DEFAULT 'Trichy',
    pincode TEXT DEFAULT '620003',
    google_maps_link TEXT DEFAULT 'https://maps.app.goo.gl/CvAP2GwhALXCewoH8',
    map_embed_url TEXT DEFAULT 'https://maps.google.com/maps?q=10.8193,78.67554&t=k&z=17&ie=UTF8&iwloc=&output=embed',
    office_hours TEXT DEFAULT 'Monday - Saturday: 8:30 AM - 4:00 PM',
    facebook_url TEXT DEFAULT 'https://www.facebook.com/carmelsschools/',
    instagram_url TEXT DEFAULT 'https://www.instagram.com/carmelsschool/',
    youtube_url TEXT DEFAULT 'https://www.youtube.com/@carmelsschool',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.school_info ENABLE ROW LEVEL SECURITY;

-- 3. Policies
CREATE POLICY "Allow public read for school info"
    ON public.school_info FOR SELECT USING (true);

CREATE POLICY "Allow authenticated full access for school info"
    ON public.school_info FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

### SQL: Seed Initial School Info
```sql
INSERT INTO public.school_info (
    school_name,
    tagline,
    about_summary,
    admission_year,
    phone_primary,
    phone_secondary,
    whatsapp_number,
    email_matric,
    email_icse,
    email_general,
    address_line,
    city,
    pincode,
    google_maps_link,
    map_embed_url,
    office_hours,
    facebook_url,
    instagram_url,
    youtube_url
)
VALUES
(
    'Carmel''s Schools',
    'Matriculation Hr. Sec. School & ICSE School • Trichy',
    'At Carmel''s School, our campuses are thoughtfully equipped to support every learner''s journey, from structured academics and sports to creativity, discovery, and safety. Every facility is designed to enable growth, comfort, and all-round development.',
    '2026-27',
    '7868023528',
    '7868023548',
    '7868023528',
    'carmels.matric.school@gmail.com',
    'carmels.english.school@gmail.com',
    'carmels.matric.school@gmail.com',
    'Carmel Gardens, Ramalinga Nagar West Extn., Woraiyur, Trichy - 620003, Tamil Nadu.',
    'Trichy',
    '620003',
    'https://maps.app.goo.gl/CvAP2GwhALXCewoH8',
    'https://maps.google.com/maps?q=10.8193,78.67554&t=k&z=17&ie=UTF8&iwloc=&output=embed',
    'Monday - Saturday: 8:30 AM - 4:00 PM',
    'https://www.facebook.com/carmelsschools/',
    'https://www.instagram.com/carmelsschool/',
    'https://www.youtube.com/@carmelsschool'
);
```

---

## 7. Storage Bucket (`carmel_media`)

Stores uploaded image assets for hero carousel banners, campus gallery photos, media articles, and student topper portraits.

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('carmel_media', 'carmel_media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Access for carmel_media bucket"
    ON storage.objects FOR SELECT USING (bucket_id = 'carmel_media');

CREATE POLICY "Admin Upload Access for carmel_media bucket"
    ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'carmel_media');

CREATE POLICY "Admin Update Access for carmel_media bucket"
    ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'carmel_media');

CREATE POLICY "Admin Delete Access for carmel_media bucket"
    ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'carmel_media');
```
