'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '../lib/supabase'

export default function CategoryList() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('level', 1)
                .eq('is_active', true)
                .order('display_order')
                .limit(6)

            if (error) throw error
            setCategories(data || [])
        } catch (error) {
            console.error('Kategori yükleme hatası:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="px-4 py-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl h-24 md:h-28 mb-2"></div>
                            <div className="bg-gray-200 rounded h-4 mb-1"></div>
                            <div className="bg-gray-200 rounded h-3 w-3/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // Renkli gradient arka planlar
    const gradientColors = [
        'from-blue-500 to-purple-600',
        'from-green-500 to-teal-600',
        'from-orange-500 to-red-600',
        'from-pink-500 to-rose-600',
        'from-indigo-500 to-blue-600',
        'from-emerald-500 to-green-600'
    ]

    return (
        <div className="px-4 py-6 max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                {categories.map((category, index) => (
                    <a
                        key={category.id}
                        href={`/kategoriler/${category.slug}`}
                        className="group block"
                    >
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-[#FF6000]/10 transition-all duration-300 hover:-translate-y-1">
                            {/* Kategori görseli */}
                            <div className={`relative h-24 md:h-28 bg-gradient-to-br ${gradientColors[index % gradientColors.length]} overflow-hidden`}>
                                {category.icon_url ? (
                                    <Image
                                        src={category.icon_url}
                                        alt={category.picture_alt_text || category.name}
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
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            {/* Kategori bilgileri */}
                            <div className="p-3 md:p-4 flex flex-col h-20 md:h-24">
                                <h3 className="font-semibold text-gray-900 text-sm md:text-base group-hover:text-[#ea580c] transition-colors duration-200 line-clamp-2">
                                    {category.name}
                                </h3>
                                {category.tagline && (
                                    <p className="text-xs md:text-sm text-gray-500 mt-1 line-clamp-2 group-hover:text-gray-600 transition-colors duration-200 flex-1">
                                        {category.tagline}
                                    </p>
                                )}
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            {/* Tüm kategoriler linki */}
            <div className="mt-8 text-center">
                <a
                    href="/kategoriler"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FF6000] to-[#ea580c] text-white font-semibold text-sm rounded-full hover:from-[#ea580c] hover:to-[#c2410c] hover:shadow-lg hover:shadow-[#FF6000]/25 transition-all duration-300 hover:-translate-y-0.5"
                >
                    Tüm kategorileri gör
                    <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </a>
            </div>
        </div>
    )
}
