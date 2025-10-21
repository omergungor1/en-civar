import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Sayfa Başlığı */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Gizlilik Politikası</h1>
                        <p className="text-gray-600">
                            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <div className="prose prose-gray max-w-none">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Giriş</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                EnCivar olarak, kullanıcılarımızın gizliliğini korumak bizim için çok önemlidir.
                                Bu gizlilik politikası, kişisel verilerinizin nasıl toplandığını, kullanıldığını
                                ve korunduğunu açıklamaktadır.
                            </p>

                            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Toplanan Bilgiler</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Platformumuzda aşağıdaki türde bilgileri toplayabiliriz:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                                <li>İletişim formları aracılığıyla sağladığınız kişisel bilgiler (ad, email, telefon)</li>
                                <li>İşletme ekleme formları aracılığıyla sağladığınız işletme bilgileri</li>
                                <li>Web sitesi kullanım verileri (IP adresi, tarayıcı bilgileri, sayfa görüntüleme)</li>
                                <li>Çerezler ve benzeri teknolojiler aracılığıyla toplanan veriler</li>
                            </ul>

                            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Bilgilerin Kullanımı</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Topladığımız bilgileri aşağıdaki amaçlarla kullanırız:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                                <li>Hizmetlerimizi sağlamak ve geliştirmek</li>
                                <li>Kullanıcı deneyimini iyileştirmek</li>
                                <li>İletişim taleplerinize yanıt vermek</li>
                                <li>Yasal yükümlülüklerimizi yerine getirmek</li>
                                <li>Güvenlik ve dolandırıcılık önleme</li>
                            </ul>

                            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Bilgi Paylaşımı</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Kişisel bilgilerinizi üçüncü taraflarla paylaşmayız, ancak aşağıdaki durumlar hariç:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                                <li>Yasal zorunluluklar</li>
                                <li>Mahkeme kararları</li>
                                <li>Kullanıcının açık rızası</li>
                                <li>Hizmet sağlayıcılarımızla (veri işleme amaçlı)</li>
                            </ul>

                            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Veri Güvenliği</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Kişisel verilerinizi korumak için uygun teknik ve idari güvenlik önlemleri alırız.
                                Ancak, internet üzerinden veri iletiminin %100 güvenli olmadığını unutmayın.
                            </p>

                            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Çerezler</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Web sitemizde kullanıcı deneyimini iyileştirmek için çerezler kullanırız.
                                Çerezleri tarayıcı ayarlarınızdan kontrol edebilirsiniz.
                            </p>

                            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. KVKK Uyumu</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu olarak
                                hareket ederiz ve bu kanunun gerektirdiği tüm yükümlülükleri yerine getiririz.
                            </p>

                            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Haklarınız</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                KVKK kapsamında aşağıdaki haklara sahipsiniz:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                                <li>İşlenen kişisel verileriniz hakkında bilgi talep etme</li>
                                <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                                <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
                                <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme</li>
                                <li>Kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
                            </ul>

                            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. İletişim</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Gizlilik politikamız hakkında sorularınız varsa, bizimle iletişime geçebilirsiniz:
                            </p>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-600 mb-2"><strong>Email:</strong> info@encivar.com</p>
                                <p className="text-gray-600 mb-2"><strong>Telefon:</strong> +90 (542) 821 22 05</p>
                                <p className="text-gray-600"><strong>Adres:</strong> İstanbul Caddesi, Osmangazi, Bursa, Türkiye</p>
                            </div>

                            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Değişiklikler</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler
                                durumunda kullanıcılarımızı bilgilendiririz.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
