import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Sayfa Başlığı */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Kullanım Şartları</h1>
                        <p className="text-gray-600">
                            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <div className="prose prose-gray max-w-none">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Genel Hükümler</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Bu kullanım şartları, EnCivar platformunu kullanırken uymanız gereken kuralları
                                belirler. Platformumuzu kullanarak bu şartları kabul etmiş sayılırsınız.
                            </p>

                            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Hizmet Tanımı</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                EnCivar, Türkiye'deki yerel işletmeleri kullanıcılarla buluşturan bir rehber
                                platformudur. Platformumuzda işletme bilgileri, değerlendirmeler, fotoğraflar
                                ve iletişim bilgileri yer almaktadır.
                            </p>

                            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Kullanıcı Yükümlülükleri</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Platformumuzu kullanırken aşağıdaki kurallara uymanız gerekmektedir:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                                <li>Doğru ve güncel bilgiler sağlamak</li>
                                <li>Başkalarının haklarına saygı göstermek</li>
                                <li>Yasadışı faaliyetlerde bulunmamak</li>
                                <li>Platformun güvenliğini tehdit edecek eylemlerde bulunmamak</li>
                                <li>Telif haklarına saygı göstermek</li>
                                <li>Spam veya zararlı içerik paylaşmamak</li>
                            </ul>

                            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. İçerik Politikası</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Platformumuzda paylaştığınız içeriklerden siz sorumlusunuz. Aşağıdaki içerikleri
                                paylaşmak yasaktır:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                                <li>Yanıltıcı veya yanlış bilgiler</li>
                                <li>Hakaret içeren veya saldırgan içerikler</li>
                                <li>Telif hakkı ihlali yapan içerikler</li>
                                <li>Spam veya reklam içerikleri</li>
                                <li>Yasadışı faaliyetleri teşvik eden içerikler</li>
                                <li>Kişisel bilgileri izinsiz paylaşan içerikler</li>
                            </ul>

                            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. İşletme Bilgileri</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Platformumuzda yer alan işletme bilgileri, işletme sahipleri veya kullanıcılar
                                tarafından sağlanmaktadır. Bu bilgilerin doğruluğundan EnCivar sorumlu değildir.
                                Kullanıcılarımızın işletme bilgilerini doğrulamaları önerilir.
                            </p>

                            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Fikri Mülkiyet Hakları</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Platformumuzun tüm içeriği, tasarımı ve yazılımı EnCivar'a aittir. Bu içerikler
                                telif hakkı, marka hakkı ve diğer fikri mülkiyet hakları ile korunmaktadır.
                                İzinsiz kullanım yasaktır.
                            </p>

                            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Sorumluluk Sınırları</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                EnCivar, platformumuzda yer alan bilgilerin doğruluğu, güncelliği veya
                                eksiksizliği konusunda garanti vermez. Kullanıcılarımızın platformumuzu
                                kendi sorumluluklarında kullanmaları gerekmektedir.
                            </p>

                            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Hizmet Kesintileri</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Platformumuzda teknik bakım, güncelleme veya diğer nedenlerle geçici
                                kesintiler yaşanabilir. Bu durumlardan dolayı sorumluluk kabul etmeyiz.
                            </p>

                            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Hesap Askıya Alma ve Sonlandırma</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Bu kullanım şartlarını ihlal eden kullanıcıların hesaplarını askıya alma
                                veya sonlandırma hakkımız saklıdır. Bu durumda önceden bildirim yapma
                                yükümlülüğümüz yoktur.
                            </p>

                            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Değişiklikler</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Bu kullanım şartlarını zaman zaman güncelleyebiliriz. Önemli değişiklikler
                                durumunda kullanıcılarımızı bilgilendiririz. Değişiklikler yayınlandığı
                                tarihten itibaren geçerli olur.
                            </p>

                            <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Uygulanacak Hukuk</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Bu kullanım şartları Türk hukukuna tabidir. Herhangi bir uyuşmazlık
                                durumunda İstanbul mahkemeleri yetkilidir.
                            </p>

                            <h2 className="text-xl font-semibold text-gray-900 mb-4">12. İletişim</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Bu kullanım şartları hakkında sorularınız varsa, bizimle iletişime geçebilirsiniz:
                            </p>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-600 mb-2"><strong>Email:</strong> info@encivar.com</p>
                                <p className="text-gray-600 mb-2"><strong>Telefon:</strong> +90 (212) 123 45 67</p>
                                <p className="text-gray-600"><strong>Adres:</strong> Maslak Mahallesi, Büyükdere Caddesi No: 123, Sarıyer/İstanbul</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
