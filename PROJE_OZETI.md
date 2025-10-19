# EnCivar - Yerel Rehber Projesi

## 🎉 Proje Tamamlandı!

EnCivar, Türkiye'nin yerel rehberi olarak tasarlanan modern bir Next.js projesidir. Yelp benzeri bir platform olarak, kullanıcıların yakınlarındaki işletmeleri keşfetmesini sağlar.

## 📋 Tamamlanan Özellikler

### ✅ Ana Sayfalar
- **Ana Sayfa** (`/`) - Kategori arama ve listeleme
- **Kategori Detay** (`/kategoriler/[kategori_slug]`) - Kategori bilgileri ve konum seçimi
- **Tüm Kategoriler** (`/kategoriler`) - Kategori listesi
- **Liste Sayfası** (`/[il_slug]/[ilce_slug]/[kategori_slug]`) - İşletme listesi
- **İşletme Profili** (`/[il_slug]/[ilce_slug]/[isletme_slug]`) - Detaylı işletme bilgileri

### ✅ Form Sayfaları
- **İşletme Ekle** (`/isletme-ekle`) - İşletme başvuru formu
- **İletişim** (`/iletisim`) - İletişim formu

### ✅ Bilgi Sayfaları
- **Hakkımızda** (`/hakkimizda`) - Şirket bilgileri
- **Gizlilik Politikası** (`/gizlilik-politikasi`) - KVKK uyumlu gizlilik politikası
- **Kullanım Şartları** (`/kullanim-sartlari`) - Kullanım koşulları
- **404 Sayfası** (`/404`) - Özel hata sayfası

## 🛠️ Teknik Özellikler

### Frontend
- **Next.js 15.5.6** - En güncel Next.js sürümü
- **React 19.1.0** - En güncel React sürümü
- **Tailwind CSS 4** - Modern CSS framework
- **Inter Font** - Google Fonts entegrasyonu
- **Mobile First** - Responsive tasarım
- **App Router** - Modern Next.js routing

### Backend Entegrasyonu
- **Supabase** - PostgreSQL veritabanı ve storage
- **Real-time** - Canlı veri güncellemeleri
- **Authentication** - Kullanıcı kimlik doğrulama hazır
- **Storage** - Dosya yükleme sistemi

### Komponentler
- **Header** - Responsive navigasyon
- **SearchBar** - Gelişmiş arama sistemi
- **CategoryList** - Kategori kartları
- **Footer** - Site bilgileri ve linkler

## 🎨 Tasarım Özellikleri

### Renk Paleti
- **Primary**: Mavi tonları (#0ea5e9)
- **Secondary**: Gri tonları
- **Accent**: Altın sarısı (#f59e0b)
- **Success**: Yeşil tonları
- **Warning**: Sarı tonları
- **Error**: Kırmızı tonları

### UI/UX
- **Modern tasarım** - Yelp benzeri arayüz
- **Türkçe içerik** - Tamamen Türkçe
- **Responsive** - Tüm cihazlarda uyumlu
- **Accessibility** - Erişilebilirlik standartları
- **SEO optimized** - Arama motoru optimizasyonu

## 📁 Proje Yapısı

```
en-civar/
├── app/                          # Next.js App Router
│   ├── [il_slug]/               # Dinamik şehir rotaları
│   │   └── [ilce_slug]/
│   │       ├── [kategori_slug]/ # Kategori listesi
│   │       └── [isletme_slug]/  # İşletme profili
│   ├── kategoriler/             # Kategori sayfaları
│   │   └── [kategori_slug]/
│   ├── isletme-ekle/            # İşletme ekleme
│   ├── iletisim/                # İletişim
│   ├── hakkimizda/              # Hakkımızda
│   ├── gizlilik-politikasi/     # Gizlilik
│   ├── kullanim-sartlari/       # Kullanım şartları
│   ├── globals.css              # Global stiller
│   ├── layout.js                # Ana layout
│   ├── page.js                  # Ana sayfa
│   └── not-found.js             # 404 sayfası
├── components/                   # React komponentleri
│   ├── Header.js                # Site başlığı
│   ├── SearchBar.js             # Arama çubuğu
│   ├── CategoryList.js          # Kategori listesi
│   └── Footer.js                # Site alt bilgisi
├── lib/                         # Yardımcı kütüphaneler
│   ├── supabase.js              # Supabase bağlantısı
│   └── colors.js                # Renk paleti
├── public/                      # Statik dosyalar
├── tailwind.config.js           # Tailwind yapılandırması
└── package.json                 # Proje bağımlılıkları
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 18+ 
- npm veya yarn
- Supabase hesabı

### Kurulum
```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build
npm run start
```

### Supabase Yapılandırması
1. `.env.local` dosyası oluşturun:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Supabase'de gerekli tabloları oluşturun:
- `cities` - Şehirler
- `districts` - İlçeler  
- `categories` - Kategoriler
- `businesses` - İşletmeler
- `business_photos` - İşletme fotoğrafları
- `business_categories` - İşletme-kategori ilişkisi
- `business_hours` - Çalışma saatleri
- `contact_forms` - İletişim formları
- `business_submissions` - İşletme başvuruları

## 📱 Özellikler

### Arama Sistemi
- **Kategori arama** - Gerçek zamanlı kategori filtreleme
- **Konum arama** - İlçe bazlı arama
- **Akıllı öneriler** - Kullanıcı dostu arayüz

### İşletme Yönetimi
- **Detaylı profiller** - Fotoğraf, iletişim, çalışma saatleri
- **Değerlendirme sistemi** - Puan ve yorum sistemi
- **İletişim araçları** - Telefon, WhatsApp, yol tarifi

### SEO ve Performans
- **Statik rendering** - Hızlı yükleme
- **Meta tags** - Arama motoru optimizasyonu
- **Breadcrumb navigation** - SEO dostu navigasyon
- **Responsive images** - Optimize edilmiş görseller

## 🔧 Geliştirme Notları

### Kod Standartları
- **JavaScript** - TypeScript kullanılmadı (kullanıcı tercihi)
- **Türkçe değişkenler** - İngilizce ve alt tire formatı
- **Komponent yapısı** - Yeniden kullanılabilir komponentler
- **Error handling** - Kapsamlı hata yönetimi

### Performans
- **Image optimization** - Next.js Image komponenti
- **Lazy loading** - Gerektiğinde yükleme
- **Code splitting** - Otomatik kod bölme
- **CDN ready** - Vercel deployment hazır

## 🎯 Gelecek Geliştirmeler

### Önerilen Özellikler
- **Kullanıcı sistemi** - Kayıt/giriş sistemi
- **Favoriler** - Beğenilen işletmeler
- **Yorum sistemi** - Kullanıcı değerlendirmeleri
- **Harita entegrasyonu** - Google Maps
- **Push notifications** - Bildirim sistemi
- **Admin paneli** - İçerik yönetimi

### Teknik İyileştirmeler
- **Caching** - Redis cache sistemi
- **Analytics** - Kullanıcı analitikleri
- **PWA** - Progressive Web App
- **Multi-language** - Çoklu dil desteği

## 📞 Destek

Proje ile ilgili sorularınız için:
- **Email**: info@encivar.com
- **Telefon**: +90 (212) 123 45 67

---

**EnCivar** - Türkiye'nin Yerel Rehberi 🏪📍
