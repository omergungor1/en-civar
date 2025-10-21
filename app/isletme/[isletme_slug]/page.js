'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { supabase } from '../../../lib/supabase'

export default function BusinessProfile() {
    const params = useParams()
    const router = useRouter()
    const [business, setBusiness] = useState(null)
    const [city, setCity] = useState(null)
    const [district, setDistrict] = useState(null)
    const [category, setCategory] = useState(null)
    const [photos, setPhotos] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedPhoto, setSelectedPhoto] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        if (params.isletme_slug) {
            fetchBusinessData()
        }
    }, [params])

    // ESC tuşu ile modal'ı kapatma
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                closePhotoModal()
            }
        }

        if (isModalOpen) {
            document.addEventListener('keydown', handleEscKey)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey)
            document.body.style.overflow = 'unset'
        }
    }, [isModalOpen])

    const fetchBusinessData = async () => {
        try {
            // İşletme bilgisini al (şehir ve ilçe bilgileriyle birlikte)
            const { data: businessData, error: businessError } = await supabase
                .from('businesses')
                .select(`
                    *,
                    districts(
                        *,
                        cities(*)
                    ),
                    business_categories(categories(*)),
                    business_hours(day_of_week,open_time,close_time,is_24_hours,is_closed)
                `)
                .eq('slug', params.isletme_slug)
                .single()

            if (businessError) throw businessError
            setBusiness(businessData)

            // Şehir ve ilçe bilgilerini ayarla
            if (businessData.districts) {
                setDistrict(businessData.districts)
                setCity(businessData.districts.cities)
            }

            // Ana kategoriyi al
            if (businessData.business_categories?.[0]?.categories) {
                setCategory(businessData.business_categories[0].categories)
            }

            // İşletme fotoğraflarını al
            const { data: photosData, error: photosError } = await supabase
                .from('business_photos')
                .select('*')
                .eq('business_id', businessData.id)
                .order('is_cover', { ascending: false })

            if (!photosError) {
                setPhotos(photosData || [])
            }

        } catch (error) {
            console.error('Veri yükleme hatası:', error)
        } finally {
            setLoading(false)
        }
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

    if (!business || !district || !city) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center min-h-96">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">İşletme bulunamadı</h1>
                        <p className="text-gray-600 mb-4">Aradığınız işletme mevcut değil.</p>
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

    const coverPhoto = photos.find(photo => photo.is_cover) || photos[0]

    const openPhotoModal = (photo) => {
        setSelectedPhoto(photo)
        setIsModalOpen(true)
    }

    const closePhotoModal = () => {
        setIsModalOpen(false)
        setSelectedPhoto(null)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                                <a href={`/${category?.slug}/${city.slug}/${district.slug}`} className="hover:text-primary-600">{city.name}</a>
                            </li>
                            <li className="flex items-center">
                                <svg className="h-4 w-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                                <a href={`/${category?.slug}/${city.slug}/${district.slug}`} className="hover:text-primary-600">{district.name}</a>
                            </li>
                            <li className="flex items-center">
                                <svg className="h-4 w-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>{business.name}</span>
                            </li>
                        </ol>
                    </nav>

                    {/* İşletme Başlığı */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* İşletme Görseli */}
                            <div className="w-full md:w-48 h-48 flex-shrink-0">
                                {coverPhoto ? (
                                    <Image
                                        src={coverPhoto.image_url}
                                        alt={business.name}
                                        width={192}
                                        height={192}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                                        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* İşletme Bilgileri */}
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{business.name}</h1>
                                {business.tagline && (
                                    <p className="text-lg text-gray-600 mb-4">{business.tagline}</p>
                                )}

                                {/* Puan ve Değerlendirme */}
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="flex items-center space-x-1">
                                        <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-lg font-semibold text-gray-900">{business.rating || '0.0'}</span>
                                        <span className="text-gray-500">({business.review_count || 0} değerlendirme)</span>
                                    </div>
                                </div>

                                {/* Aksiyon Butonları */}
                                <div className="flex flex-wrap gap-3">
                                    {business.phone && (
                                        <a
                                            href={`tel:${business.phone}`}
                                            className="flex items-center px-4 py-2 bg-[#FF6000] text-white rounded-lg font-medium hover:bg-[#ea580c] transition-colors"
                                        >
                                            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                                        >
                                            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                            </svg>
                                            WhatsApp
                                        </a>
                                    )}
                                    <a
                                        href={`https://maps.google.com/?q=${encodeURIComponent(business.address || '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Yol Tarifi
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* İşletme Detayları */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Sol Kolon - Detaylar */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Açıklama */}
                            {business.description && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Hakkında</h2>
                                    <p className="text-gray-600 leading-relaxed">{business.description}</p>
                                </div>
                            )}

                            {/* Fotoğraflar */}
                            {photos.length > 0 && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Fotoğraflar</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {photos.map((photo) => (
                                            <div
                                                key={photo.id}
                                                className="aspect-square cursor-pointer hover:opacity-80 transition-opacity"
                                                onClick={() => openPhotoModal(photo)}
                                            >
                                                <Image
                                                    src={photo.image_url}
                                                    alt={business.name}
                                                    width={200}
                                                    height={200}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sağ Kolon - Bilgiler */}
                        <div className="space-y-6">
                            {/* İletişim Bilgileri */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">İletişim</h2>

                                <div className="space-y-4">
                                    {business.address && (
                                        <div className="flex items-start">
                                            <svg className="h-5 w-5 text-primary-500 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <div>
                                                <h3 className="font-medium text-gray-900">Adres</h3>
                                                <p className="text-gray-600">{business.address}</p>
                                            </div>
                                        </div>
                                    )}

                                    {business.phone && (
                                        <div className="flex items-start">
                                            <svg className="h-5 w-5 text-primary-500 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <div>
                                                <h3 className="font-medium text-gray-900">Telefon</h3>
                                                <p className="text-gray-600">{business.phone}</p>
                                            </div>
                                        </div>
                                    )}

                                    {business.email && (
                                        <div className="flex items-start">
                                            <svg className="h-5 w-5 text-primary-500 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <div>
                                                <h3 className="font-medium text-gray-900">Email</h3>
                                                <p className="text-gray-600">{business.email}</p>
                                            </div>
                                        </div>
                                    )}

                                    {business.website && (
                                        <div className="flex items-start">
                                            <svg className="h-5 w-5 text-primary-500 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            <div>
                                                <h3 className="font-medium text-gray-900">Website</h3>
                                                <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                                                    {business.website}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Çalışma Saatleri */}
                            {business.business_hours && business.business_hours.length > 0 && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Çalışma Saatleri</h2>
                                    <div className="space-y-2 text-sm">
                                        {business.business_hours.map((day, index) => (
                                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                                <span className="text-gray-700 font-medium">
                                                    {day.day_of_week === 0 ? 'Pazartesi' :
                                                        day.day_of_week === 1 ? 'Salı' :
                                                            day.day_of_week === 2 ? 'Çarşamba' :
                                                                day.day_of_week === 3 ? 'Perşembe' :
                                                                    day.day_of_week === 4 ? 'Cuma' :
                                                                        day.day_of_week === 5 ? 'Cumartesi' :
                                                                            day.day_of_week === 6 ? 'Pazar' : 'Bilinmeyen'}
                                                </span>
                                                <span className={`font-medium ${day.is_close
                                                    ? 'text-red-600'
                                                    : day.is_24_hours
                                                        ? 'text-green-600'
                                                        : 'text-gray-900'
                                                    }`}>
                                                    {day.is_close
                                                        ? 'Kapalı'
                                                        : day.is_24_hours
                                                            ? '24 Saat Açık'
                                                            : `${day.open_time.toString().substring(0, 5)} - ${day.close_time.toString().substring(0, 5)}`
                                                    }
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Kategoriler */}
                            {business.business_categories && business.business_categories.length > 0 && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Hizmetler</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {business.business_categories.map((bc, index) => (
                                            <span key={index} className="px-3 py-1 bg-[#ffedd5] text-primary-700 rounded-full text-sm">
                                                {bc.categories?.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Fotoğraf Modal */}
            {isModalOpen && selectedPhoto && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl max-h-full">
                        <button
                            onClick={closePhotoModal}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                        >
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <Image
                            src={selectedPhoto.image_url}
                            alt={business.name}
                            width={800}
                            height={600}
                            className="max-w-full max-h-full object-contain rounded-lg"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
