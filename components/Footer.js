import Logo from './Logo'

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    {/* Logo ve açıklama */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="mb-4">
                            <Logo showText={true} />
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                            EnCivar, Türkiye'nin en kapsamlı yerel rehberi. Civarındaki en iyi işletmeleri keşfedin,
                            değerlendirmeleri okuyun ve size en uygun hizmeti bulun.
                        </p>
                    </div>

                    {/* Hızlı linkler */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Hızlı Linkler</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/kategoriler" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                                    Tüm Kategoriler
                                </a>
                            </li>
                            <li>
                                <a href="/isletme-ekle" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                                    İşletme Ekle
                                </a>
                            </li>
                            <li>
                                <a href="/iletisim" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                                    İletişim
                                </a>
                            </li>
                            <li>
                                <a href="/hakkimizda" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                                    Hakkımızda
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* İletişim */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">İletişim</h3>
                        <div className="space-y-3">
                            <div className="flex items-start">
                                <svg className="h-4 w-4 text-primary-500 mt-1 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <a href="mailto:info@encivar.com" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                                    info@encivar.com
                                </a>
                            </div>
                            <div className="flex items-start">
                                <svg className="h-4 w-4 text-primary-500 mt-1 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <a href="tel:+905428212205" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                                    +90 542 821 22 05
                                </a>
                            </div>
                            <div className="flex items-start">
                                <svg className="h-4 w-4 text-primary-500 mt-1 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-gray-600 text-sm">
                                    Bursa, Türkiye
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Yasal */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Yasal</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/gizlilik-politikasi" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                                    Gizlilik Politikası
                                </a>
                            </li>
                            <li>
                                <a href="/kullanim-sartlari" className="text-gray-600 hover:text-primary-600 text-sm transition-colors">
                                    Kullanım Şartları
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Alt çizgi */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-500 text-sm">
                            © 2024 EnCivar. Tüm hakları saklıdır.
                        </p>
                        <div className="mt-4 md:mt-0 flex space-x-6">
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Twitter</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.98-.49-.98-.98s.49-.98.98-.98.98.49.98.98-.49.98-.98.98z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
