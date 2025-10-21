'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Logo from './Logo'

export default function SearchBar({ onSearch, selectedCategory, selectedDistrict, onCategorySelect, onDistrictSelect }) {
    const [isSearchMode, setIsSearchMode] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryQuery, setCategoryQuery] = useState('')
    const [districtQuery, setDistrictQuery] = useState('')
    const [categories, setCategories] = useState([])
    const [districts, setDistricts] = useState([])
    const [showCategories, setShowCategories] = useState(false)
    const [showDistricts, setShowDistricts] = useState(false)

    // Seçilen değerler için ayrı state'ler
    const [selectedCategoryName, setSelectedCategoryName] = useState('')
    const [selectedDistrictName, setSelectedDistrictName] = useState('')

    const categoryInputRef = useRef(null)
    const districtInputRef = useRef(null)

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
          cities(name)
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

    // Kategori input değişikliği
    useEffect(() => {
        if (categoryQuery) {
            searchCategories(categoryQuery)
            setShowCategories(true)
        } else {
            setCategories([])
            setShowCategories(false)
        }
    }, [categoryQuery])

    // İlçe input değişikliği
    useEffect(() => {
        if (districtQuery) {
            searchDistricts(districtQuery)
            setShowDistricts(true)
        } else {
            setDistricts([])
            setShowDistricts(false)
        }
    }, [districtQuery])

    // Arama modunu açma
    const openSearchMode = () => {
        setIsSearchMode(true)
        setTimeout(() => {
            categoryInputRef.current?.focus()
        }, 100)
    }

    // Arama modunu kapatma
    const closeSearchMode = () => {
        setIsSearchMode(false)
        setCategoryQuery('')
        setDistrictQuery('')
        setCategories([])
        setDistricts([])
        setShowCategories(false)
        setShowDistricts(false)
    }

    // Arama yapma
    const handleSearch = () => {
        if (selectedCategory && selectedDistrict) {
            onSearch(selectedCategory, selectedDistrict)
        }
    }

    // Kategori seçme
    const handleCategorySelect = (category) => {
        setSelectedCategoryName(category.name)
        onCategorySelect(category)
        setCategoryQuery('')
        setShowCategories(false)
        setTimeout(() => {
            districtInputRef.current?.focus()
        }, 100)
    }

    // İlçe seçme
    const handleDistrictSelect = async (district) => {
        try {
            // İlçe bilgisini şehir bilgisiyle birlikte al
            const { data, error } = await supabase
                .from('districts')
                .select(`
                    *,
                    cities(name, slug)
                `)
                .eq('id', district.id)
                .single()

            if (error) throw error

            onDistrictSelect(data)
            setSelectedDistrictName(data.name)
            setDistrictQuery('')
            setShowDistricts(false)
        } catch (error) {
            console.error('İlçe seçme hatası:', error)
            // Fallback: orijinal district objesini kullan
            onDistrictSelect(district)
            setSelectedDistrictName(district.name)
            setDistrictQuery('')
            setShowDistricts(false)
        }
    }

    if (isSearchMode) {
        return (
            <div className="fixed inset-0 bg-white z-50">
                {/* Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                    <button
                        onClick={closeSearchMode}
                        className="text-gray-600 hover:text-gray-900 font-medium text-sm"
                    >
                        İptal
                    </button>
                    <div className="flex-shrink-0">
                        <Logo showText={true} />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="bg-[#FF6000] text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#ea580c] transition-colors"
                    >
                        Ara
                    </button>
                </div>

                {/* Arama alanları */}
                <div className="p-4 space-y-4">
                    {/* Kategori arama */}
                    <div className="relative">
                        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                            <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                ref={categoryInputRef}
                                type="text"
                                placeholder="Ne lazım? Çilingir, Lokanta vs."
                                value={selectedCategoryName || categoryQuery}
                                onChange={(e) => {
                                    setCategoryQuery(e.target.value)
                                    setSelectedCategoryName('')
                                }}
                                className="flex-1 outline-none text-gray-900 placeholder-gray-500"
                            />
                        </div>

                        {/* Kategori sonuçları */}
                        {showCategories && categories.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-10">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategorySelect(category)}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                    >
                                        <div className="font-medium text-gray-900">{category.name}</div>
                                        <div className="text-sm text-gray-500">{category.full_path}</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* İlçe arama */}
                    <div className="relative">
                        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                            <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <input
                                ref={districtInputRef}
                                type="text"
                                placeholder="Konum seçin"
                                value={selectedDistrictName || districtQuery}
                                onChange={(e) => {
                                    setDistrictQuery(e.target.value)
                                    setSelectedDistrictName('')
                                }}
                                className="flex-1 outline-none text-gray-900 placeholder-gray-500"
                            />
                        </div>

                        {/* İlçe sonuçları */}
                        {showDistricts && districts.length > 0 && (
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
        )
    }

    return (
        <div className="px-4 py-4">
            <div
                onClick={openSearchMode}
                className="flex items-center border-2 border-white rounded-2xl px-2 md:px-4 py-2 md:py-4 bg-white shadow-xl cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            >
                <svg className="h-6 w-6 text-gray-400 mr-2 md:mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-gray-500 text-lg font-medium">Ne lazım? Çilingir, Lokanta vs.</span>
                <div className="ml-auto">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
            </div>
        </div>
    )
}
