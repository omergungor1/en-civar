-- =====================================
-- ENCIVAR DATABASE SCHEMA
-- =====================================

-- Şehirler
CREATE TABLE public.cities (
  id int4 PRIMARY KEY ,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  latitude numeric(10,6),
  longitude numeric(10,6)
);

-- İlçeler
CREATE TABLE public.districts (
  id int4 PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id int4 REFERENCES public.cities(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  latitude numeric(10,6),
  longitude numeric(10,6)
);

-- İşletmeler
CREATE TABLE public.businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tagline text,
  authorized_person text,
  email text,
  phone text,
  website text,
  description text,
  address text,
  latitude numeric(10,6),
  longitude numeric(10,6),
  rating numeric(2,1),
  review_count int DEFAULT 0,
  price_level smallint,
  verified boolean DEFAULT false,
  status text CHECK (status IN ('active','pending','suspended')) DEFAULT 'pending',
  city_id uuid REFERENCES public.cities(id),
  district_id uuid REFERENCES public.districts(id),
  created_at timestamptz DEFAULT now()
);

-- İşletme görselleri
CREATE TABLE public.business_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES public.businesses(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  is_cover boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Kategoriler
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  tagline text,
  title text,
  description text,
  slug text UNIQUE NOT NULL,
  image_url text,
  icon_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  level smallint DEFAULT 1,
  display_order integer,
  seo_title text,
  seo_description text,
  meta_keywords text[],
  picture_alt_text text,
  is_selectable boolean DEFAULT false
);

-- İşletme <-> Kategori ilişkisi
CREATE TABLE public.business_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES public.businesses(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.categories(id) ON DELETE CASCADE
);

-- İşletme - İlçe ilişkisi
CREATE TABLE public.business_districts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES public.businesses(id) ON DELETE CASCADE,
  city_id int4 REFERENCES public.cities(id) ON DELETE CASCADE,
  district_id int4 REFERENCES public.districts(id) ON DELETE CASCADE
);

-- İşletme çalışma saatleri
CREATE TABLE public.business_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid REFERENCES public.businesses(id) ON DELETE CASCADE,
  day_of_week int CHECK (day_of_week BETWEEN 0 AND 6),
  open_time time,
  close_time time,
  is_closed boolean DEFAULT false,
  is_24_hours boolean DEFAULT false
);

-- İletişim formları
CREATE TABLE public.contact_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  email text,
  message text,
  created_at timestamptz DEFAULT now()
);