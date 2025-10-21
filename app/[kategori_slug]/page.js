'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Logo from '../../components/Logo'
import { supabase } from '../../lib/supabase'

export default function CategoryDetail() {
    const params = useParams()
    const router = useRouter()
    const [category, setCategory] = useState(null)
    const [districts, setDistricts] = useState([])
    const [selectedDistrict, setSelectedDistrict] = useState(null)
    const [isSearchMode, setIsSearchMode] = useState(false)
    const [districtQuery, setDistrictQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [relatedCategories, setRelatedCategories] = useState([])

    useEffect(() => {
        if (params.kategori_slug) {
            fetchCategory()
            fetchRelatedCategories()
        }
    }, [params.kategori_slug])

    const fetchCategory = async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('slug', params.kategori_slug)
                .eq('is_active', true)
                .single()

            if (error) throw error
            setCategory(data)
        } catch (error) {
            console.error('Kategori yükleme hatası:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchRelatedCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('level', 1)
                .eq('is_active', true)
                .neq('slug', params.kategori_slug)
                .order('display_order')
                .limit(6)

            if (error) throw error
            setRelatedCategories(data || [])
        } catch (error) {
            console.error('İlgili kategoriler yükleme hatası:', error)
        }
    }

    const searchDistricts = async (query) => {
        if (query.length < 2) {
            setDistricts([])
            return
        }

        try {
            const { data, error } = await supabase
                .from('districts')
                .select(`
          *,
          cities(name, slug)
        `)
                .ilike('name', `%${query}%`)
                .limit(10)

            if (error) throw error
            setDistricts(data || [])
        } catch (error) {
            console.error('İlçe arama hatası:', error)
            setDistricts([])
        }
    }

    const handleDistrictSearch = (query) => {
        setDistrictQuery(query)
        if (query) {
            searchDistricts(query)
        } else {
            setDistricts([])
        }
    }

    const handleDistrictSelect = (district) => {
        setSelectedDistrict(district)
        setDistrictQuery('')
        setDistricts([])
        setIsSearchMode(false)

        // Liste sayfasına yönlendir
        const url = `/${category.slug}/${district.cities.slug}/${district.slug}`
        router.push(url)
    }

    const openSearchMode = () => {
        setIsSearchMode(true)
    }

    const closeSearchMode = () => {
        setIsSearchMode(false)
        setDistrictQuery('')
        setDistricts([])
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center min-h-96">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
                </div>
                <Footer />
            </div>
        )
    }

    if (!category) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center min-h-96">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Kategori bulunamadı</h1>
                        <p className="text-gray-600 mb-4">Aradığınız kategori mevcut değil.</p>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-[#FF6000] text-white px-6 py-2 rounded-lg hover:bg-[#ea580c] transition-colors"
                        >
                            Ana Sayfaya Dön
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="relative h-80 md:h-96 bg-gradient-to-br from-[#FF6000] via-[#ea580c] to-[#c2410c] overflow-hidden">
                    {category.image_url && (
                        <div className="absolute inset-0">
                            <Image
                                src={category.image_url}
                                alt={category.picture_alt_text || category.name}
                                fill
                                sizes="100vw"
                                className="object-cover opacity-30"
                            />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    <div className="relative z-10 flex items-center justify-center h-full">
                        <div className="text-center text-white px-4 max-w-4xl mx-auto">
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-lg leading-tight">
                                {category.name}
                            </h1>
                            {category.tagline && (
                                <p className="text-xl md:text-2xl opacity-95 drop-shadow-md mb-8 max-w-3xl mx-auto leading-relaxed">
                                    {category.tagline}
                                </p>
                            )}
                            <div className="px-4 py-6">
                                <div className="max-w-lg mx-auto">
                                    <button
                                        onClick={openSearchMode}
                                        className="w-full flex items-center border-2 border-white rounded-2xl px-6 py-4 bg-white shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                                    >
                                        <svg className="h-6 w-6 text-gray-400 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="text-gray-500 text-lg font-medium">
                                            {selectedDistrict ? `${selectedDistrict.name}, ${selectedDistrict.cities?.name}` : 'Konum seçin'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* İstatistik Bölümü */}
                <section className="py-12 md:py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                {category.name} Kategorisinde
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Binlerce kaliteli işletme ve hizmet sağlayıcısı
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-[#FF6000] mb-2">1.2K+</div>
                                <div className="text-gray-600 font-medium">İşletme</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-[#FF6000] mb-2">15K+</div>
                                <div className="text-gray-600 font-medium">Aylık Ziyaret</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-[#FF6000] mb-2">4.7★</div>
                                <div className="text-gray-600 font-medium">Ortalama Puan</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-[#FF6000] mb-2">85%</div>
                                <div className="text-gray-600 font-medium">Memnuniyet</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Kategori Açıklaması */}
                {category.description && (
                    <section className="py-12 md:py-16 bg-gray-50">
                        <div className="max-w-4xl mx-auto px-4">
                            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Hakkında</h2>
                                <p className="text-gray-600 leading-relaxed text-lg">{category.description}</p>
                            </div>
                        </div>
                    </section>
                )}

                {/* İlgili Kategoriler */}
                <section className="py-12 md:py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                Diğer Popüler Kategoriler
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Keşfetmek isteyebileceğiniz diğer hizmetler
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                            {relatedCategories.map((relatedCategory, index) => {
                                const gradientColors = [
                                    'from-blue-500 to-purple-600',
                                    'from-green-500 to-teal-600',
                                    'from-orange-500 to-red-600',
                                    'from-pink-500 to-rose-600',
                                    'from-indigo-500 to-blue-600',
                                    'from-emerald-500 to-green-600'
                                ]

                                return (
                                    <a
                                        key={relatedCategory.id}
                                        href={`/${relatedCategory.slug}`}
                                        className="group block"
                                    >
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-[#FF6000]/10 transition-all duration-300 hover:-translate-y-1">
                                            <div className={`relative h-24 md:h-28 bg-gradient-to-br ${gradientColors[index % gradientColors.length]} overflow-hidden`}>
                                                {relatedCategory.icon_url ? (
                                                    <Image
                                                        src={relatedCategory.icon_url}
                                                        alt={relatedCategory.picture_alt_text || relatedCategory.name}
                                                        fill
                                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                                        className="object-contain group-hover:scale-110 transition-transform duration-300 p-2"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full">
                                                        <svg className="h-8 w-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-3 md:p-4 flex flex-col h-20 md:h-24">
                                                <h3 className="font-semibold text-gray-900 text-sm md:text-base group-hover:text-[#ea580c] transition-colors duration-200 line-clamp-2">
                                                    {relatedCategory.name}
                                                </h3>
                                                {relatedCategory.tagline && (
                                                    <p className="text-xs md:text-sm text-gray-500 mt-1 line-clamp-2 group-hover:text-gray-600 transition-colors duration-200 flex-1">
                                                        {relatedCategory.tagline}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </a>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Kullanıcı Yorumları */}
                <section className="py-12 md:py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                {category.name} Kategorisinde Deneyimler
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Bu kategorideki işletmelerden memnun kalan kullanıcılarımız
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                            <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg">
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
                                    "{category.name} kategorisinde EnCivar sayesinde harika işletmeler keşfettim. Hizmet kalitesi çok yüksek."
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

                            <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg">
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
                                    "Bu kategorideki işletmelerin hepsi çok profesyonel. EnCivar'ın kalite kontrolü gerçekten işe yarıyor."
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

                            <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg">
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
                                    "Fiyat performans açısından mükemmel seçenekler buldum. Kesinlikle tavsiye ederim."
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
                            {category.name} Kategorisinde İşletmenizi Ekleyin
                        </h2>
                        <p className="text-lg md:text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
                            {category.name} kategorisinde faaliyet gösteren işletmenizi EnCivar'a ekleyin ve
                            binlerce potansiyel müşteriye ulaşın. Ücretsiz kayıt olun!
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

            {/* Konum Arama Modal */}
            {isSearchMode && (
                <div className="fixed inset-0 bg-white z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                        <button
                            onClick={closeSearchMode}
                            className="text-gray-600 hover:text-gray-900 font-medium text-sm"
                        >
                            Geri
                        </button>
                        <div className="flex-shrink-0">
                            <Logo showText={true} />
                        </div>
                        <div className="w-12"></div>
                    </div>

                    {/* Arama Alanı */}
                    <div className="p-4">
                        <div className="relative">
                            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                                <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Konum arayın"
                                    value={districtQuery}
                                    onChange={(e) => handleDistrictSearch(e.target.value)}
                                    className="flex-1 outline-none text-gray-900 placeholder-gray-500"
                                    autoFocus
                                />
                            </div>

                            {/* Sonuçlar */}
                            {districts.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-10">
                                    {districts.map((district) => (
                                        <button
                                            key={district.id}
                                            onClick={() => handleDistrictSelect(district)}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                        >
                                            <div className="font-medium text-gray-900">{district.name}</div>
                                            <div className="text-sm text-gray-500">{district.cities?.name}</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}
