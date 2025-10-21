'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from './Logo'
import { supabase } from '../lib/supabase'

export default function SearchModal({ currentCategory, currentDistrict, currentCity }) {
    const router = useRouter()
    const [isSearchMode, setIsSearchMode] = useState(false)

    // Arama modalı için state'ler
    const [categories, setCategories] = useState([])
    const [districts, setDistricts] = useState([])
    const [categoryQuery, setCategoryQuery] = useState('')
    const [districtQuery, setDistrictQuery] = useState('')
    const [showCategories, setShowCategories] = useState(false)
    const [showDistricts, setShowDistricts] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedDistrict, setSelectedDistrict] = useState(null)

    // Kategori arama fonksiyonu
    const searchCategories = async (query) => {
        if (query.length < 2) {
            setCategories([])
            return
        }

        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('is_selectable', true)
                .eq('is_active', true)
                .or(`name.ilike.%${query}%,tagline.ilike.%${query}%,title.ilike.%${query}%,description.ilike.%${query}%,slug.ilike.%${query}%,seo_title.ilike.%${query}%,seo_description.ilike.%${query}%,picture_alt_text.ilike.%${query}%`)
                .order('display_order')
                .limit(10)

            if (error) throw error
            setCategories(data || [])
        } catch (error) {
            console.error('Kategori arama hatası:', error)
            setCategories([])
        }
    }

    // İlçe arama fonksiyonu
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

    const openSearchMode = () => {
        setIsSearchMode(true)
        // Mevcut kategori ve ilçe bilgilerini seçili olarak ayarla
        setSelectedCategory(currentCategory)
        setSelectedDistrict({ ...currentDistrict, cities: currentCity })
    }

    const closeSearchMode = () => {
        setIsSearchMode(false)
        setCategoryQuery('')
        setDistrictQuery('')
        setCategories([])
        setDistricts([])
        setShowCategories(false)
        setShowDistricts(false)
    }

    const handleSearch = () => {
        if (selectedCategory && selectedDistrict) {
            const url = `/${selectedCategory.slug}/${selectedDistrict.cities.slug}/${selectedDistrict.slug}`
            router.push(url)
        }
    }

    const handleCategorySelect = (category) => {
        setSelectedCategory(category)
        setCategoryQuery('')
        setShowCategories(false)
    }

    const handleDistrictSelect = (district) => {
        setSelectedDistrict(district)
        setDistrictQuery('')
        setShowDistricts(false)
    }

    return (
        <>
            {/* Arama Barı */}
            <button
                onClick={openSearchMode}
                className="w-full flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-white shadow-sm hover:border-primary-300 transition-colors"
            >
                <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-gray-900">
                    {currentCategory.name} • {currentDistrict.name}, {currentCity.name}
                </span>
            </button>

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
                            <Logo showText={true} />
                        </div>
                        <div className="w-12"></div>
                    </div>

                    {/* Arama İçeriği */}
                    <div className="p-4 space-y-4">
                        {/* Kategori Seçimi */}
                        <div className="relative">
                            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                                <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Kategori ara..."
                                    value={selectedCategory?.name || categoryQuery}
                                    onChange={(e) => {
                                        setCategoryQuery(e.target.value)
                                        if (e.target.value) {
                                            searchCategories(e.target.value)
                                            setShowCategories(true)
                                        } else {
                                            setCategories([])
                                            setShowCategories(false)
                                        }
                                    }}
                                    className="flex-1 outline-none text-gray-900 placeholder-gray-500"
                                />
                                {(selectedCategory?.name || categoryQuery) && (
                                    <button
                                        onClick={() => {
                                            setSelectedCategory(null)
                                            setCategoryQuery('')
                                            setCategories([])
                                            setShowCategories(false)
                                        }}
                                        className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Kategori Sonuçları */}
                            {showCategories && categories.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-10">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategorySelect(cat)}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                        >
                                            <div className="font-medium text-gray-900">{cat.name}</div>
                                            <div className="text-sm text-gray-500">{cat.full_path}</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* İlçe Seçimi */}
                        <div className="relative">
                            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                                <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="İlçe ara..."
                                    value={selectedDistrict?.name || districtQuery}
                                    onChange={(e) => {
                                        setDistrictQuery(e.target.value)
                                        if (e.target.value) {
                                            searchDistricts(e.target.value)
                                            setShowDistricts(true)
                                        } else {
                                            setDistricts([])
                                            setShowDistricts(false)
                                        }
                                    }}
                                    className="flex-1 outline-none text-gray-900 placeholder-gray-500"
                                />
                                {(selectedDistrict?.name || districtQuery) && (
                                    <button
                                        onClick={() => {
                                            setSelectedDistrict(null)
                                            setDistrictQuery('')
                                            setDistricts([])
                                            setShowDistricts(false)
                                        }}
                                        className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* İlçe Sonuçları */}
                            {showDistricts && districts.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-10">
                                    {districts.map((dist) => (
                                        <button
                                            key={dist.id}
                                            onClick={() => handleDistrictSelect(dist)}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                        >
                                            <div className="font-medium text-gray-900">{dist.name}</div>
                                            <div className="text-sm text-gray-500">{dist.cities?.name}</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Ara Butonu */}
                        <button
                            onClick={handleSearch}
                            className="w-full bg-[#FF6000] text-white px-4 py-3 rounded-lg font-medium hover:bg-[#ea580c] transition-colors"
                        >
                            Ara
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
