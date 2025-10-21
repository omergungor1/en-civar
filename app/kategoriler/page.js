'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { supabase } from '../../lib/supabase'

export default function CategoriesPage() {
    const [categories, setCategories] = useState([])
    const [subcategoryCounts, setSubcategoryCounts] = useState({})
    const [subcategories, setSubcategories] = useState({})
    const [expandedCategory, setExpandedCategory] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            // Ana kategorileri (level=1) çek
            const { data: mainCategories, error: mainError } = await supabase
                .from('categories')
                .select('*')
                .eq('level', 1)
                .eq('is_active', true)
                .order('display_order')

            if (mainError) throw mainError

            // Her ana kategori için alt kategori sayısını çek
            const counts = {}
            for (const category of mainCategories || []) {
                const { count, error: countError } = await supabase
                    .from('categories')
                    .select('*', { count: 'exact', head: true })
                    .eq('parent_id', category.id)
                    .eq('is_active', true)

                if (countError) {
                    console.error(`Alt kategori sayısı hatası (${category.name}):`, countError)
                    counts[category.id] = 0
                } else {
                    counts[category.id] = count || 0
                }
            }

            setCategories(mainCategories || [])
            setSubcategoryCounts(counts)
        } catch (error) {
            console.error('Kategoriler yükleme hatası:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchSubcategories = async (parentId) => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('parent_id', parentId)
                .eq('is_active', true)
                .order('display_order')

            if (error) throw error

            setSubcategories(prev => ({
                ...prev,
                [parentId]: data || []
            }))
        } catch (error) {
            console.error('Alt kategoriler yükleme hatası:', error)
        }
    }

    const toggleCategory = async (categoryId) => {
        if (expandedCategory === categoryId) {
            // Kapat
            setExpandedCategory(null)
        } else {
            // Aç
            setExpandedCategory(categoryId)

            // Alt kategoriler henüz yüklenmemişse yükle
            if (!subcategories[categoryId]) {
                await fetchSubcategories(categoryId)
            }
        }
    }

    // Renkli gradient arka planlar
    const gradientColors = [
        'from-blue-500 to-purple-600',
        'from-green-500 to-teal-600',
        'from-orange-500 to-red-600',
        'from-pink-500 to-rose-600',
        'from-indigo-500 to-blue-600',
        'from-emerald-500 to-green-600',
        'from-yellow-500 to-orange-600',
        'from-purple-500 to-pink-600',
        'from-cyan-500 to-blue-600',
        'from-lime-500 to-green-600',
        'from-red-500 to-pink-600',
        'from-violet-500 to-purple-600'
    ]

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <Header />
                <div className="flex items-center justify-center min-h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#FF6000] border-t-transparent mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">Kategoriler yükleniyor...</p>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Header />

            <main className="py-8 md:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Sayfa Başlığı */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#FF6000] to-[#ea580c] rounded-full mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Tüm Kategoriler</h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Civarındaki tüm hizmetleri ve işletmeleri keşfedin. Aradığınız kategoriyi bulun ve en iyi seçenekleri görün.
                        </p>
                        <div className="mt-6 inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
                            <svg className="w-4 h-4 text-[#FF6000] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">{categories.length} ana kategori</span>
                        </div>
                    </div>

                    {/* Kategoriler Listesi */}
                    <div className="space-y-6">
                        {categories.map((category, index) => (
                            <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                {/* Ana Kategori Kartı */}
                                <div
                                    className="group cursor-pointer"
                                    onClick={() => toggleCategory(category.id)}
                                >
                                    <div className="flex items-center p-4 md:p-6 hover:bg-gray-50 transition-colors duration-200">
                                        {/* Kategori görseli */}
                                        <div className={`relative h-16 w-16 md:h-20 md:w-20 bg-gradient-to-br ${gradientColors[index % gradientColors.length]} rounded-lg overflow-hidden flex-shrink-0 mr-4`}>
                                            {category.icon_url ? (
                                                <Image
                                                    src={category.icon_url}
                                                    alt={category.picture_alt_text || category.name}
                                                    fill
                                                    className="object-contain group-hover:scale-110 transition-transform duration-300 p-2"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <svg className="h-6 w-6 md:h-8 md:w-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Kategori bilgileri */}
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 group-hover:text-[#ea580c] transition-colors duration-200 text-lg md:text-xl mb-1">
                                                {category.name}
                                            </h3>
                                            {category.tagline && (
                                                <p className="text-sm text-gray-500 line-clamp-2 mb-2 group-hover:text-gray-600 transition-colors duration-200">
                                                    {category.tagline}
                                                </p>
                                            )}
                                            {subcategoryCounts[category.id] > 0 && (
                                                <div className="flex items-center text-[#FF6000]">
                                                    <span className="text-sm font-medium mr-2">
                                                        {subcategoryCounts[category.id]} alt kategori
                                                    </span>
                                                    <svg className={`w-4 h-4 transition-transform duration-200 ${expandedCategory === category.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Tıklama göstergesi */}
                                        <div className="flex items-center text-gray-400">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Alt Kategoriler */}
                                {expandedCategory === category.id && subcategories[category.id] && (
                                    <div className="border-t border-gray-100 bg-gray-50">
                                        <div className="p-4 md:p-6">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                                                Alt Kategoriler
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                                {subcategories[category.id].map((subcategory) => (
                                                    <a
                                                        key={subcategory.id}
                                                        href={`/${subcategory.slug}`}
                                                        className="group/sub block"
                                                    >
                                                        <div className="bg-white rounded-lg p-3 hover:shadow-md hover:shadow-[#FF6000]/10 transition-all duration-200 hover:-translate-y-1">
                                                            <div className="flex items-center">
                                                                <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center mr-3 flex-shrink-0">
                                                                    {subcategory.icon_url ? (
                                                                        <Image
                                                                            src={subcategory.icon_url}
                                                                            alt={subcategory.picture_alt_text || subcategory.name}
                                                                            width={32}
                                                                            height={32}
                                                                            className="object-contain rounded-md"
                                                                        />
                                                                    ) : (
                                                                        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h5 className="font-medium text-gray-900 group-hover/sub:text-[#ea580c] transition-colors duration-200 text-sm truncate">
                                                                        {subcategory.name}
                                                                    </h5>
                                                                    {subcategory.tagline && (
                                                                        <p className="text-xs text-gray-500 truncate">
                                                                            {subcategory.tagline}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <svg className="w-3 h-3 text-gray-400 group-hover/sub:text-[#FF6000] transition-colors duration-200 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Sonuç bulunamadı */}
                    {categories.length === 0 && (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mb-6">
                                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Kategori bulunamadı</h3>
                            <p className="text-gray-500 mb-6">
                                Henüz hiç kategori eklenmemiş.
                            </p>
                            <a
                                href="/"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FF6000] to-[#ea580c] text-white font-semibold rounded-full hover:from-[#ea580c] hover:to-[#c2410c] hover:shadow-lg hover:shadow-[#FF6000]/25 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                Ana sayfaya dön
                                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </a>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
