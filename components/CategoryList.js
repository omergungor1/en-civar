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
            <div className="px-4 py-6">
                <div className="grid grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 rounded-lg h-24 mb-2"></div>
                            <div className="bg-gray-200 rounded h-4"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="px-4 py-6">
            <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => (
                    <a
                        key={category.id}
                        href={`/kategoriler/${category.slug}`}
                        className="group block"
                    >
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                            {/* Kategori görseli */}
                            <div className="relative h-24 bg-gray-100">
                                {category.image_url ? (
                                    <Image
                                        src={category.image_url}
                                        alt={category.picture_alt_text || category.name}
                                        fill
                                        className="object-contain group-hover:scale-105 transition-transform duration-200"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Kategori bilgileri */}
                            <div className="p-3">
                                <h3 className="font-medium text-gray-900 text-sm group-hover:text-primary-600 transition-colors">
                                    {category.name}
                                </h3>
                                {category.tagline && (
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                        {category.tagline}
                                    </p>
                                )}
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            {/* Tüm kategoriler linki */}
            <div className="mt-6 text-center">
                <a
                    href="/kategoriler"
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                    Tüm kategorileri gör
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </a>
            </div>
        </div>
    )
}
