import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="mb-8">
                        <h1 className="text-9xl font-bold text-primary-500 mb-4">404</h1>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Sayfa Bulunamadı</h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Link
                            href="/"
                            className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
                        >
                            Ana Sayfaya Dön
                        </Link>

                        <div className="text-gray-500">
                            <p>Veya aşağıdaki sayfalardan birini ziyaret edebilirsiniz:</p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 mt-6">
                            <Link
                                href="/kategoriler"
                                className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Tüm Kategoriler
                            </Link>
                            <Link
                                href="/isletme-ekle"
                                className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                                İşletme Ekle
                            </Link>
                            <Link
                                href="/iletisim"
                                className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                                İletişim
                            </Link>
                            <Link
                                href="/hakkimizda"
                                className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Hakkımızda
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
