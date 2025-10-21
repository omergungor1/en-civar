'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../components/Header'
import SearchBar from '../components/SearchBar'
import CategoryList from '../components/CategoryList'
import Footer from '../components/Footer'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const router = useRouter()

  const handleSearch = (category, district) => {
    if (category && district) {
      // URL oluşturma: /[il_slug]/[ilce_slug]/[kategori_slug]
      const url = `/${category.slug}/${district.cities.slug}/${district.slug}`
      router.push(url)
    }
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
  }

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Ana içerik */}
      <main className="flex-1">
        {/* Hero Bölümü */}
        <section className="bg-gradient-to-br from-[#FF6000] via-[#ea580c] to-[#c2410c] text-white">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Civarınızdaki İşletmeleri
                <span className="block text-yellow-200">Keşfedin</span>
              </h1>
              <p className="text-lg md:text-xl text-orange-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                EnCivar ile çevrenizdeki en iyi restoranları, hizmetleri ve işletmeleri kolayca bulun.
                Binlerce kullanıcının güvendiği platformda aradığınızı hızlıca keşfedin.
              </p>
            </div>
          </div>
        </section>

        {/* Arama barı */}
        <div className="relative -mt-8 md:-mt-12 z-10">
          <SearchBar
            onSearch={handleSearch}
            selectedCategory={selectedCategory}
            selectedDistrict={selectedDistrict}
            onCategorySelect={handleCategorySelect}
            onDistrictSelect={handleDistrictSelect}
          />
        </div>

        {/* İstatistik Bölümü */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Türkiye'nin En Büyük Yerel Keşif Platformu
              </h2>
              <p className="text-gray-600 text-lg">
                Milyonlarca kullanıcı ve binlerce işletme ile büyüyen ağımız
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#FF6000] mb-2">2M+</div>
                <div className="text-gray-600 font-medium">Aylık Kullanıcı</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#FF6000] mb-2">50K+</div>
                <div className="text-gray-600 font-medium">Kayıtlı İşletme</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#FF6000] mb-2">500+</div>
                <div className="text-gray-600 font-medium">Şehir</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#FF6000] mb-2">4.8★</div>
                <div className="text-gray-600 font-medium">Ortalama Puan</div>
              </div>
            </div>
          </div>
        </section>

        {/* Kategori listesi */}
        <section className="py-8 md:py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Popüler Kategoriler
              </h2>
              <p className="text-gray-600 text-lg">
                Aradığınız hizmeti kategorilerden seçerek kolayca bulun
              </p>
            </div>
            <CategoryList />
          </div>
        </section>

        {/* Kullanıcı Yorumları */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Kullanıcılarımız Ne Diyor?
              </h2>
              <p className="text-gray-600 text-lg">
                EnCivar'ı kullanan binlerce kişinin deneyimleri
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-gray-50 rounded-xl p-6 md:p-8">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "EnCivar sayesinde mahallemdeki en iyi restoranları keşfettim. Arayüzü çok kullanışlı ve hızlı."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#FF6000] rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-gray-900">Ahmet Y.</div>
                    <div className="text-sm text-gray-500">İstanbul</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 md:p-8">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "İşletmemizi EnCivar'a ekledikten sonra müşteri sayımız %300 arttı. Harika bir platform!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#FF6000] rounded-full flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-gray-900">Mehmet K.</div>
                    <div className="text-sm text-gray-500">Ankara</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 md:p-8">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Yeni şehre taşındığımda EnCivar sayesinde çevremi çok hızlı tanıdım. Kesinlikle tavsiye ederim."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#FF6000] rounded-full flex items-center justify-center text-white font-bold">
                    E
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-gray-900">Elif S.</div>
                    <div className="text-sm text-gray-500">İzmir</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* İşletme Ekleme CTA */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-[#FF6000] to-[#ea580c] text-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              İşletmenizi EnCivar'a Ekleyin
            </h2>
            <p className="text-lg md:text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
              Sizin de işletmeniz aylık binlerce kişinin kullandığı EnCivar platformunda bulunsun.
              Ücretsiz kayıt olun ve müşteri sayınızı artırın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/isletme-ekle"
                className="inline-flex items-center px-8 py-4 bg-white text-[#FF6000] font-semibold text-lg rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                İşletme Ekle
              </a>
              <a
                href="/hakkimizda"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold text-lg rounded-full hover:bg-white hover:text-[#FF6000] transition-colors duration-300"
              >
                Daha Fazla Bilgi
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
