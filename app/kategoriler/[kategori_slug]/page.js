'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { supabase } from '../../../lib/supabase'

export default function CategoryDetail() {
    const params = useParams()
    const router = useRouter()
    const [category, setCategory] = useState(null)
    const [districts, setDistricts] = useState([])
    const [selectedDistrict, setSelectedDistrict] = useState(null)
    const [isSearchMode, setIsSearchMode] = useState(false)
    const [districtQuery, setDistrictQuery] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (params.kategori_slug) {
            fetchCategory()
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
        const url = `/${district.cities.slug}/${district.slug}/${category.slug}`
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
                <div className="relative h-64 md:h-80 bg-gradient-to-br from-[#FF6000] to-[#ea580c] overflow-hidden">
                    {category.image_url && (
                        <div className="absolute inset-0">
                            <Image
                                src={category.image_url}
                                alt={category.picture_alt_text || category.name}
                                fill
                                className="object-cover opacity-40"
                            />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    <div className="relative z-10 flex items-center justify-center h-full">
                        <div className="text-center text-white px-4">
                            <h1 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-lg">{category.name}</h1>
                            {category.tagline && (
                                <p className="text-lg md:text-xl opacity-95 drop-shadow-md max-w-2xl mx-auto">{category.tagline}</p>
                            )}
                            <div className="px-4 py-6">
                                <div className="max-w-md mx-auto">
                                    <button
                                        onClick={openSearchMode}
                                        className="w-full flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-white shadow-sm hover:border-primary-300 transition-colors"
                                    >
                                        <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="text-gray-500">
                                            {selectedDistrict ? `${selectedDistrict.name}, ${selectedDistrict.cities?.name}` : 'Konum seçin'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Konum Seçimi */}
                {/* <div className="px-4 py-6">
                    <div className="max-w-md mx-auto">
                        <button
                            onClick={openSearchMode}
                            className="w-full flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-white shadow-sm hover:border-primary-300 transition-colors"
                        >
                            <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-gray-500">
                                {selectedDistrict ? `${selectedDistrict.name}, ${selectedDistrict.cities?.name}` : 'Konum seçin'}
                            </span>
                        </button>
                    </div>
                </div> */}

                {/* Kategori Açıklaması */}
                {category.description && (
                    <div className="px-4 py-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Hakkında</h2>
                                <p className="text-gray-600 leading-relaxed">{category.description}</p>
                            </div>
                        </div>
                    </div>
                )}
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
                            <img src="/logo.png" alt="EnCivar" className="h-22 md:h-28 w-auto" />
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
