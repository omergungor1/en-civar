'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Header({ isSearchMode = false, onCancel, onSearch }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Sol taraf - İptal butonu (sadece arama modunda) */}
                    <div className="flex-shrink-0">
                        {isSearchMode ? (
                            <button
                                onClick={onCancel}
                                className="text-gray-600 hover:text-gray-900 font-medium text-sm"
                            >
                                İptal
                            </button>
                        ) : (
                            <div className="w-8"></div> // Boş alan
                        )}
                    </div>

                    {/* Orta - Logo */}
                    <div className="flex-shrink-0">
                        <Image
                            src="/logo.png"
                            alt="EnCivar"
                            width={120}
                            height={32}
                            className="h-22 w-auto"
                        />
                    </div>

                    {/* Sağ taraf - Hamburger menü veya Ara butonu */}
                    <div className="flex-shrink-0">
                        {isSearchMode ? (
                            <button
                                onClick={onSearch}
                                className="bg-primary-500 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary-600 transition-colors"
                            >
                                Ara
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-600 hover:text-gray-900 p-2"
                                aria-label="Menüyü aç"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobil menü */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
                        <a
                            href="/"
                            className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                        >
                            Ana Sayfa
                        </a>
                        <a
                            href="/kategoriler"
                            className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                        >
                            Tüm Kategoriler
                        </a>
                        <a
                            href="/isletme-ekle"
                            className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                        >
                            İşletme Ekle
                        </a>
                        <a
                            href="/iletisim"
                            className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                        >
                            İletişim
                        </a>
                        <a
                            href="/hakkimizda"
                            className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                        >
                            Hakkımızda
                        </a>
                    </div>
                </div>
            )}
        </header>
    )
}
