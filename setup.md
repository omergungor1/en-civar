# Proje Tanımı
Bu bir local servis projesidir. Adı EnCivar -> Bu proje Yelp in Türkiye için olan versiyonunu yapıyoruz. 
Bu nextjs projesi User side olan versiyon. Hiçbir admin panel işlemini içermez. Neredeyse tüm apiler get tir.
Admin için ayrı bir nextjs projesi vardır. Bu projeden tamamen ayrıdır. 
En Civar User projesi tamamen statiktir, CDN ile serve edilir. Vercele deploy edilecektir. Gerekli ayarlamaları yapmalısın. 
Tasarımda sayfa gereksinimlerini mobile göre anlatacağım. Mobili webe uyarlarsın. Tüm site responsive olmalı.
Tasarım modern olmalı, yelp ve benzeri modern local rehber sitelerinin tasarımlarına benzetebilirsin.
Tüm site Türkçe olacaktır. 
Gerekli tablolar






Teknik detaylar:
- Nextjs kullanıyoruz
- Bu tablolar çoktan supaya eklendi, gerekli RLS ayarları yapıldı: cities,districts,businesses,business_photos,categories,business_categories,business_districts,business_hours,contact_forms.
- İki ayrı bucket te eklendi: business-photos ve category-images
- Veri tabanı ve storage için supabase psql ve bucket kullanıyoruz. Gerekli supa bağlantılarını yap.
- Tüm proje build esnasında render edilmelidir. Kullanıcıya her zaman hazır html css olarak yani statik olarak site gitmelidir. 
- User side encivar projesi Vercel CDN ile serve edilmelidir. Işık hızında kullanıcıda açılmalıdır. 
- Mobile first yaklaşımı ile projeyi yapmalıyız. Kullanıcılarımızın büyük kısmı mobil cihazlar ile sitemizi kullanıyor.
- Gereksiz kütüphaneler kullanma, sadece gereken ve çok kullanılan, popüler, ücretsiz, hatasız kütüphaneleri tercih etmeliyiz. 
- Değişken isimlendirirken her zaman İngilice ve tümü küçük ve alt tire ile bağlayarak kullanalım. Örn: call_rate gibi
- EnCivar User side için gereken apileri de bu nextjs projesinde yazacağız. Gereken apileri doğru kategorize etmeliyiz.
- Komponent mantığını iyi kullan. 
- Kullanılacak renkler için bir yere renk tercihlerini ekle. Site rengi ile oynayacağımız zaman oradan kolayca tüm siteyi güncelleyebilelim. Gereken tüm renkleri oraya ekle.





Sayfalar: 
1- Ana Sayfa
/ → Ana sayfa
Ana sayfada şunlar olacak:
--->Header başladı (Bu header sadece ana sayfaya özgü)
- En üstte ortada enCivar logosu, sağda hamburger menü, sol şimdilik boş kalsın. (Header içi) 
- altında bir hizmet arama barı. (Bir insput, sola yaslı bir büyüteç ikonu, Yanında placeholder olarak Ne lazım? Çilingir, Lokanta vs. yazabilir.) (Arama butonu olmasına gerek yok. İnputa focus olunca ara butonu görünür oluyor) (Header içi)
---> Header bitti
--->Body başladı
- Onların da altında ana kategori buton ve kategori görsellerini listele. Sadece level 1 olan kategorileri listelemen yeterli. Max 6 kategori listelenmeli ve display_order sıralamasına göre listelensin.
---> Body bitti
--->Footer başladı
Footer alanı (standart footer komponenti)
---> Footer bitti

-> Kategori inputuna focus olunca tüm ekranı beyaz bir örtü kaplıyor (Aynı konumda logo, hamburger menü ve kategori inputu var. KAtegori inputu altında aynı tasarımda konum inputu var. Solunda Map ikonu var.) KAtegori ikonuna bir kez basınca beyaz ekran geliyor, kategori inputuna focus oluyor ve yazabiliyorsun. Yazdıkça kategoriler listeleniyor. Sadece is_selectable=true ve is_active=true olan kategoriler listeleniyor. Kullanıcının yazdığı metne göre name, tagline, title,description, slug,seo_title,
seo_description, meta_keywords, picture_alt_text ile içinde geçiyor mu diye kontrol et ve ilgili kategorileri listele. Kullanıcı input altında bu kategorileri görebilir (name ve full_pathi kategori adı altında daha küçük olarak > işareti ile göstererek listele). 
-> Aynı kategori listeleme gibi konum da da ilçe listeleme yapmalısın. Kullanıcı bir ilçe adı veya il adı girebilir. Kullanıcı girdikçe sen altta ilçeleri listelemelisin. Örneğin Bursa yazarsa bursanın ilçelerini listele. Nilü yazınca name alanını filtreleyerek benzer ilçeleri listele. Kullanıcı birini seçebilmeli. 
->Bu arka plan beyaz, kategori ve konum inputu çıktığı zaman üstteki header kısmı da değişiyor. En solda İptal, ortada logo, sağda Ara butonları gelmelidir.
-> Kategori ve ilçe seçildikten sonra ara butonu ile ilgili listeleme sayfasına redirect yapılmalıdır.




2- Hizmet Detay Sayfası
/kategoriler/[kategori_slug] → Hizmet detay landing

-> Hizmet detay sayfası bir kategori seçilmiş ancak henüz konum seçilmemiş sayfa gibi düşünebiliriz. 
-> Bu sayfada kategori adı, kategori sloganı, arka planda kategori resmi olacak. Konum butonu en üstte olsun ana sayfa gibi. Konum inputuna tıklayınca beyaz bir perde ekranı kaplasın yine. Konum için ilçe adı yazdıkça districts tablosundan benzer ilçeler filtrelenerek listelenmeli, kullanıcı istediği ilçeyi seçebilmelidir. Konum inputuna focus olunca üstte ortada encivar logosu, solda iptal (tıklanırsa açılan konum perdesi kapanır) ve sağda ara butonları çıkmalıdır. 
-> konum seçilince ilgili listeye redirect etmeliyiz. /[il_slug]/[ilce_slug]/[kategori_slug]



3- Kategori Liste Sayfası (Category Directory)
/kategoriler → Tüm kategoriler
-> Tüm kategorileri listele, kategori görsellerini de göster.


4- Liste Sayfası
/[il_slug]/[ilce_slug]/[kategori_slug] → Liste sayfası
-> En üstte ortada logo, sağda hamburger menü
-> Bir altında custom kategori ve konum inputu (Tek bir input gibi gözükecek, en solda büyüteç ikonu. İlk kategori adı, yanında da konum bilgisi. ilçe,il adı. Kullanıcı kategori veya konum üzerine tıklarsa beyaz bir perde açılmalı ve üstte kategori altta konum inputu yer almalıdır. Ana sayfadakine arama barındaki yaklaşımın aynısı. Bu kategori ve konum seçme ekranı üstünde solda geri, ortada logo, sağda menü hamburger bar var. Geri butonu beyaz perdeyi kapatır ve liste ekranına geri dönmeyi sağlar.)
-> Bu custom kategori-konum inputu altında batch benzeri filtre butonları var. Seçili kategorinin alt kategorileri varsa onlar listeleniyor. Kullanıcı alt kategoriye tıklarsa o kategoriye redirect etmeliyiz. Örneğin Yol yardım aratmış, altta filtrelerde Çekici, Lastikçi, Çilingir, Anahtarcı vs. filtreleri listeleniyor. Alt kategori yoksa filtre de gözükmez.
-> Hemen altına Breadcrumb ekleyerek SEO avantajından faydalanalım. enCivar > İstanbul > Kartal > Oto & Yol Yardım > Oto Çekici şeklinde google seo için avantajlı yol yapısı listelenmelidir. 
-> Bread crump navigasyon altında Yelp benzeri bir blog başlığı gibi seo avantajlı bir cümle yazacak h1. (Örnek: Gemlik, Bursa yakınlarındaki en iyi 10 oto tamirci)
-> Hemen altında İşletme kartları listelenmelidir. business_card komponenti yapalım, her işletme için bu komponenti kullan. İşletme kartında Ara, Whatsapp, İşletme profili, yol tarifi butonları olmalıdır. Ayrıca işletme resimlerinden is_cover=true gösterebilirsin. İşletme adı, sloganını,puanı ve yorum sayısı vs yazdır.


5- İşletme Profili Sayfası
/[il_slug]/[ilce_slug]/[isletme_slug] -> businesses tablosunda slug alanında full_path yazacak (/ankara/cankaya/mavi-cam-balkon)
-> header (solda geri, ortada logo, sağda hamburger menü)
-> breadcrump navigasyon olmalı -> enCivar > Bursa > Gemlik > Usta Ali Çiçekçilik
-> İşletme adı,sloganı, puanı ve yorum sayısı, verdiği hizmetler, çalışma saatleri adres,Ara, WP, Yol tarifi al butonları, işletme görsellerini vs. göster.


6- İşletme Ekle
/isletme-ekle
-> Temel bir işletme ekleme formu olacak. Kullanıcı bilgileri giriyor, biz sonra bunu businesses tablosuna ekleyeceğiz. Yani kullanıcıların eklediği işletmeleri ayrı bir tablo yap ve oraya kaydet. Bu tablo henüz oluşturulmadı. Bunu sen tasarla ve supa için sql bilgileri bana ver. Gerekli RLS ayarlarını yapmayı unutma. Kullanıcılar login olmadan işletme ekleyecek. Bunu unutma. Bu nedenle bu form public olarak erişilebilir ve kaydedilebilir olmalıdır. İşletme başarı ile eklenince form boşaltılmalıdır, gizlenmelidir, Tebrik mesajı kapatılamayacak şekilde gelmelidir. Kullanıcı ana sayfaya yönlendiren buton eklenebilir. 



7- İletişim Sayfası
/iletisim → Form
-> contact_form için bir arayüz. Herkes iletişim formu ile bizimle iletişime geçebilir.



8- Hakkımızda
/hakkimizda
-> enCivar için temel bir hakkımızda sayfası hazırla


9- KVKK & Gizlilik Politikası (Privacy Policy)
/gizlilik-politikasi
-> enCivar için bir yerel rehberdir, bilgilerden ve doğruluğundan firmamız sorumlu değildir vs gerekli açıklamalar olmalıdır.



10- Kullanım Şartları (Terms)
/kullanim-sartlari
-> enCivar için bir yerel rehberdir, bilgilerden ve doğruluğundan firmamız sorumlu değildir vs gerekli açıklamalar olmalıdır.


11- Custom 404 Sayfası
/404 → 404 custom