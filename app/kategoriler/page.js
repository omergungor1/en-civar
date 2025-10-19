'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { supabase } from '../../lib/supabase'

export default function CategoriesPage() {
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
                .eq('is_active', true)
                .order('display_order')

            if (error) throw error
            setCategories(data || [])
        } catch (error) {
            console.error('Kategoriler yükleme hatası:', error)
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

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Sayfa Başlığı */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Tüm Kategoriler</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Yakınınızdaki tüm hizmetleri ve işletmeleri keşfedin. Aradığınız kategoriyi bulun ve en iyi seçenekleri görün.
                        </p>
                    </div>

                    {/* Kategoriler Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <a
                                key={category.id}
                                href={`/kategoriler/${category.slug}`}
                                className="group block"
                            >
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                    {/* Kategori görseli */}
                                    <div className="relative h-32 bg-gray-100">
                                        {category.image_url ? (
                                            <Image
                                                src={category.image_url}
                                                alt={category.picture_alt_text || category.name}
                                                fill
                                                className="object-contain group-hover:scale-105 transition-transform duration-200"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Kategori bilgileri */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                                            {category.name}
                                        </h3>
                                        {category.tagline && (
                                            <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                                                {category.tagline}
                                            </p>
                                        )}
                                        {category.full_path && (
                                            <p className="text-xs text-gray-400">
                                                {category.full_path}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* Sonuç bulunamadı */}
                    {categories.length === 0 && (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Kategori bulunamadı</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Henüz hiç kategori eklenmemiş.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
