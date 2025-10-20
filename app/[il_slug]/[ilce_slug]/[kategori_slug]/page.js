'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import { supabase } from '../../../../lib/supabase'

export default function ListingPage() {
    const params = useParams()
    const router = useRouter()
    const [businesses, setBusinesses] = useState([])
    const [category, setCategory] = useState(null)
    const [district, setDistrict] = useState(null)
    const [city, setCity] = useState(null)
    const [subCategories, setSubCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [isSearchMode, setIsSearchMode] = useState(false)

    useEffect(() => {
        if (params.il_slug && params.ilce_slug && params.kategori_slug) {
            fetchData()
        }
    }, [params])

    const fetchData = async () => {
        try {
            // Şehir bilgisini al
            const { data: cityData, error: cityError } = await supabase
                .from('cities')
                .select('*')
                .eq('slug', params.il_slug)
                .single()

            if (cityError) throw cityError
            setCity(cityData)

            // İlçe bilgisini al
            const { data: districtData, error: districtError } = await supabase
                .from('districts')
                .select(`
          *,
          cities(*)
        `)
                .eq('slug', params.ilce_slug)
                .eq('city_id', cityData.id)
                .single()

            if (districtError) throw districtError
            setDistrict(districtData)

            // Kategori bilgisini al
            const { data: categoryData, error: categoryError } = await supabase
                .from('categories')
                .select('*')
                .eq('slug', params.kategori_slug)
                .single()

            if (categoryError) throw categoryError
            setCategory(categoryData)

            // Alt kategorileri al
            const { data: subCategoriesData, error: subCategoriesError } = await supabase
                .from('categories')
                .select('*')
                .eq('parent_id', categoryData.id)
                .eq('is_active', true)
                .order('display_order')

            if (!subCategoriesError) {
                setSubCategories(subCategoriesData || [])
            }

            // İşletmeleri al - business_categories ve business_districts tabloları üzerinden
            // Önce bu kategori ve ilçede hizmet veren işletmeleri bul
            const { data: businessDistrictsData, error: businessDistrictsError } = await supabase
                .from('business_districts')
                .select('business_id')
                .eq('district_id', districtData.id)

            if (businessDistrictsError) throw businessDistrictsError

            const businessIds = businessDistrictsData?.map(item => item.business_id) || []

            if (businessIds.length > 0) {
                // Bu işletmelerden seçilen kategoride hizmet verenleri al
                const { data: businessesData, error: businessesError } = await supabase
                    .from('business_categories')
                    .select(`
                        businesses(
                            *,
                            business_photos(*)
                        )
                    `)
                    .eq('category_id', categoryData.id)
                    .in('business_id', businessIds)

                if (businessesError) throw businessesError

                // İşletme verilerini düzelt
                const businesses = businessesData?.map(item => item.businesses).filter(Boolean) || []
                setBusinesses(businesses)
            } else {
                setBusinesses([])
            }

        } catch (error) {
            console.error('Veri yükleme hatası:', error)
        } finally {
            setLoading(false)
        }
    }

    const openSearchMode = () => {
        setIsSearchMode(true)
    }

    const closeSearchMode = () => {
        setIsSearchMode(false)
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

    if (!category || !district || !city) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center min-h-96">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Sayfa bulunamadı</h1>
                        <p className="text-gray-600 mb-4">Aradığınız sayfa mevcut değil.</p>
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

            <main className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Arama Barı */}
                    <div className="mb-6">
                        <button
                            onClick={openSearchMode}
                            className="w-full flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-white shadow-sm hover:border-primary-300 transition-colors"
                        >
                            <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="text-gray-900">
                                {category.name} • {district.name}, {city.name}
                            </span>
                        </button>
                    </div>

                    {/* Alt Kategori Filtreleri */}
                    {subCategories.length > 0 && (
                        <div className="mb-6">
                            <div className="flex flex-wrap gap-2">
                                {subCategories.map((subCategory) => (
                                    <a
                                        key={subCategory.id}
                                        href={`/${city.slug}/${district.slug}/${subCategory.slug}`}
                                        className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-[#fff7ed] hover:border-primary-300 hover:text-primary-700 transition-colors"
                                    >
                                        {subCategory.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Breadcrumb */}
                    <nav className="mb-6">
                        <ol className="flex items-center space-x-2 text-sm text-gray-500">
                            <li>
                                <a href="/" className="hover:text-primary-600">enCivar</a>
                            </li>
                            <li className="flex items-center">
                                <svg className="h-4 w-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                                <a href={`/kategoriler/${category.slug}`} className="hover:text-primary-600">{city.name}</a>
                            </li>
                            <li className="flex items-center">
                                <svg className="h-4 w-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>{district.name}</span>
                            </li>
                            <li className="flex items-center">
                                <svg className="h-4 w-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>{category.name}</span>
                            </li>
                        </ol>
                    </nav>

                    {/* Sayfa Başlığı */}
                    <div className="mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            {district.name}, {city.name} yakınlarındaki en iyi {businesses.length} {category.name.toLowerCase()}
                        </h1>
                        <p className="text-gray-600">
                            {district.name}, {city.name} bölgesindeki {category.name.toLowerCase()} hizmeti veren işletmeleri keşfedin.
                        </p>
                    </div>

                    {/* İşletme Listesi */}
                    <div className="space-y-4">
                        {businesses.map((business) => {
                            const coverPhoto = business.business_photos?.find(photo => photo.is_cover) || business.business_photos?.[0]

                            return (
                                <div key={business.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    {/* İşletme Görseli */}
                                    <div className="w-full h-48">
                                        {coverPhoto ? (
                                            <Image
                                                src={coverPhoto.image_url}
                                                alt={business.name}
                                                width={400}
                                                height={192}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* İşletme Bilgileri */}
                                    <div className="p-4">
                                        <div className="mb-3">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{business.name}</h3>
                                            {business.tagline && (
                                                <p className="text-sm text-gray-600 mb-2">{business.tagline}</p>
                                            )}

                                            {/* Rating */}
                                            <div className="flex items-center space-x-1 mb-2">
                                                <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="text-sm font-medium text-gray-900">{business.rating || '0.0'}</span>
                                                <span className="text-sm text-gray-500">({business.review_count || 0} değerlendirme)</span>
                                            </div>

                                            {/* Adres */}
                                            {business.address && (
                                                <p className="text-sm text-gray-600">{business.address}</p>
                                            )}
                                        </div>

                                        {/* Aksiyon Butonları - Mobil uyumlu */}
                                        <div className="grid grid-cols-2 gap-2">
                                            {business.phone && (
                                                <a
                                                    href={`tel:${business.phone}`}
                                                    className="flex items-center justify-center px-3 py-2 bg-[#FF6000] text-white text-sm rounded-md hover:bg-[#ea580c] transition-colors"
                                                >
                                                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    Ara
                                                </a>
                                            )}
                                            {business.phone && (
                                                <a
                                                    href={`https://wa.me/${business.phone}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center px-3 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors"
                                                >
                                                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                                    </svg>
                                                    WhatsApp
                                                </a>
                                            )}
                                            <a
                                                href={`/isletme/${business.slug}`}
                                                className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
                                            >
                                                Profil
                                            </a>
                                            <a
                                                href={`https://maps.google.com/?q=${encodeURIComponent(business.address || '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
                                            >
                                                Yol Tarifi
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Sonuç bulunamadı */}
                    {businesses.length === 0 && (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">İşletme bulunamadı</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Bu bölgede henüz {category.name.toLowerCase()} hizmeti veren işletme eklenmemiş.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* Arama Modal */}
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
                            <img src="/logo.png" alt="EnCivar" className="h-22 md:h-28 w-auto" />
                        </div>
                        <div className="w-12"></div>
                    </div>

                    {/* Arama İçeriği */}
                    <div className="p-4">
                        <p className="text-gray-600 text-center">
                            Arama özelliği yakında eklenecek.
                        </p>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}
