'use client'

import { useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Header({ isSearchMode = false, onCancel, onSearch }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()

    // Aktif sekme kontrolü
    const isActive = (path) => {
        if (path === '/') {
            return pathname === '/'
        }
        return pathname.startsWith(path)
    }

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Sol taraf - İptal butonu (sadece arama modunda) */}
                    <div className="flex md:hidden flex-shrink-0">
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
                        <a href="/">
                            <Image
                                src="/logo.png"
                                alt="EnCivar"
                                width={120}
                                height={32}
                                className="h-22 md:h-28 w-auto"
                            />
                        </a>
                    </div>

                    {/* Sağ taraf - Hamburger menü veya Ara butonu */}
                    <div className="flex-shrink-0">
                        {isSearchMode ? (
                            <button
                                onClick={onSearch}
                                className="bg-[#FF6000] text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#ea580c] transition-colors"
                            >
                                Ara
                            </button>
                        ) : (
                            <>
                                {/* Desktop menü (sağ taraf) */}
                                <div className="hidden md:flex items-center space-x-8">
                                    <a
                                        href="/"
                                        className={`font-medium text-sm transition-colors duration-200 ${isActive('/')
                                            ? 'text-[#FF6000] font-semibold'
                                            : 'text-gray-600 hover:text-[#FF6000]'
                                            }`}
                                    >
                                        Ana Sayfa
                                    </a>
                                    <a
                                        href="/kategoriler"
                                        className={`font-medium text-sm transition-colors duration-200 ${isActive('/kategoriler')
                                            ? 'text-[#FF6000] font-semibold'
                                            : 'text-gray-600 hover:text-[#FF6000]'
                                            }`}
                                    >
                                        Kategoriler
                                    </a>
                                    <a
                                        href="/isletme-ekle"
                                        className={`font-medium text-sm transition-colors duration-200 ${isActive('/isletme-ekle')
                                            ? 'text-[#FF6000] font-semibold'
                                            : 'text-gray-600 hover:text-[#FF6000]'
                                            }`}
                                    >
                                        İşletme Ekle
                                    </a>
                                    <a
                                        href="/iletisim"
                                        className={`font-medium text-sm transition-colors duration-200 ${isActive('/iletisim')
                                            ? 'text-[#FF6000] font-semibold'
                                            : 'text-gray-600 hover:text-[#FF6000]'
                                            }`}
                                    >
                                        İletişim
                                    </a>
                                    <a
                                        href="/hakkimizda"
                                        className={`font-medium text-sm transition-colors duration-200 ${isActive('/hakkimizda')
                                            ? 'text-[#FF6000] font-semibold'
                                            : 'text-gray-600 hover:text-[#FF6000]'
                                            }`}
                                    >
                                        Hakkımızda
                                    </a>
                                </div>

                                {/* Mobil hamburger menü */}
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="md:hidden text-gray-600 hover:text-gray-900 p-2"
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
                            </>
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
                            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive('/')
                                ? 'text-[#FF6000] bg-orange-50 font-semibold'
                                : 'text-gray-600 hover:text-[#FF6000] hover:bg-gray-50'
                                }`}
                        >
                            Ana Sayfa
                        </a>
                        <a
                            href="/kategoriler"
                            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive('/kategoriler')
                                ? 'text-[#FF6000] bg-orange-50 font-semibold'
                                : 'text-gray-600 hover:text-[#FF6000] hover:bg-gray-50'
                                }`}
                        >
                            Kategoriler
                        </a>
                        <a
                            href="/isletme-ekle"
                            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive('/isletme-ekle')
                                ? 'text-[#FF6000] bg-orange-50 font-semibold'
                                : 'text-gray-600 hover:text-[#FF6000] hover:bg-gray-50'
                                }`}
                        >
                            İşletme Ekle
                        </a>
                        <a
                            href="/iletisim"
                            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive('/iletisim')
                                ? 'text-[#FF6000] bg-orange-50 font-semibold'
                                : 'text-gray-600 hover:text-[#FF6000] hover:bg-gray-50'
                                }`}
                        >
                            İletişim
                        </a>
                        <a
                            href="/hakkimizda"
                            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive('/hakkimizda')
                                ? 'text-[#FF6000] bg-orange-50 font-semibold'
                                : 'text-gray-600 hover:text-[#FF6000] hover:bg-gray-50'
                                }`}
                        >
                            Hakkımızda
                        </a>
                    </div>
                </div>
            )}
        </header>
    )
}
