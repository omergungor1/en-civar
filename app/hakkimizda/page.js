import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-6">Hakkımızda</h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            EnCivar, Türkiye'nin en kapsamlı yerel rehberi olarak, civarındaki en iyi işletmeleri
                            keşfetmenizi sağlayan modern bir platformdur.
                        </p>
                    </div>

                    {/* Misyon */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Misyonumuz</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            EnCivar olarak misyonumuz, Türkiye'nin her köşesindeki kaliteli işletmeleri
                            kullanıcılarımızla buluşturmak ve yerel ekonomiyi desteklemektir. Teknolojiyi
                            kullanarak, kullanıcılarımızın ihtiyaçlarına en uygun hizmetleri kolayca
                            bulmalarını sağlıyoruz.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Amacımız, hem işletmelerin büyümesine katkıda bulunmak hem de kullanıcılarımıza
                            en iyi deneyimi sunmaktır.
                        </p>
                    </div>

                    {/* Vizyon */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Vizyonumuz</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Türkiye'nin en güvenilir ve kapsamlı yerel rehberi olmak, kullanıcılarımızın
                            ilk tercihi haline gelmek ve yerel işletmelerin dijital dönüşümünde öncü rol oynamak.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Gelecekte, Türkiye'nin her şehrinde, her mahallesinde EnCivar'ı görmek ve
                            kullanıcılarımızın günlük hayatlarının vazgeçilmez bir parçası olmak istiyoruz.
                        </p>
                    </div>

                    {/* Değerlerimiz */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Değerlerimiz</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-[#ffedd5] rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Güvenilirlik</h3>
                                    <p className="text-gray-600">
                                        Sunduğumuz tüm bilgilerin doğruluğunu sağlamak ve kullanıcılarımıza
                                        güvenilir bir platform sunmak önceliğimizdir.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-[#ffedd5] rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Hız</h3>
                                    <p className="text-gray-600">
                                        Kullanıcılarımızın ihtiyaçlarına hızlıca yanıt vermek ve en kısa sürede
                                        aradıklarını bulmalarını sağlamak.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-[#ffedd5] rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Kalite</h3>
                                    <p className="text-gray-600">
                                        Platformumuzda yer alan tüm işletmelerin kaliteli hizmet vermesini
                                        sağlamak ve kullanıcı deneyimini sürekli iyileştirmek.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-[#ffedd5] rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Topluluk</h3>
                                    <p className="text-gray-600">
                                        Yerel toplulukları desteklemek ve işletmelerin büyümesine katkıda
                                        bulunarak ekonomik gelişime destek olmak.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hikayemiz */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Hikayemiz</h2>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            EnCivar, 2024 yılında Türkiye'nin yerel rehber ihtiyacını karşılamak amacıyla
                            kuruldu. Kurucu ekibimiz, kullanıcıların yakınlarındaki kaliteli işletmeleri
                            bulmakta yaşadığı zorlukları gözlemleyerek bu platformu geliştirdi.
                        </p>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Teknoloji ve yerel bilgiyi birleştirerek, hem kullanıcıların hem de işletmelerin
                            hayatını kolaylaştıran bir çözüm sunuyoruz. Modern web teknolojileri kullanarak
                            hızlı, güvenilir ve kullanıcı dostu bir deneyim sunuyoruz.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Bugün, binlerce kullanıcıya hizmet veren EnCivar, sürekli gelişen ve büyüyen
                            bir platform olarak yoluna devam ediyor.
                        </p>
                    </div>

                    {/* İstatistikler */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                            <div className="text-3xl font-bold text-primary-600 mb-2">1000+</div>
                            <div className="text-gray-600">Kayıtlı İşletme</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                            <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
                            <div className="text-gray-600">Şehir</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                            <div className="text-3xl font-bold text-primary-600 mb-2">100+</div>
                            <div className="text-gray-600">Kategori</div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-[#FF6000] rounded-lg p-8 text-center text-white">
                        <h2 className="text-2xl font-bold mb-4">Bizimle İletişime Geçin</h2>
                        <p className="mb-6 opacity-90">
                            Sorularınız, önerileriniz veya iş birliği teklifleriniz için bizimle iletişime geçin.
                        </p>
                        <a
                            href="/iletisim"
                            className="inline-block bg-white text-[#FF6000] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                        >
                            İletişim Sayfası
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
