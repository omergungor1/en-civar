'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../components/Header'
import SearchBar from '../components/SearchBar'
import CategoryList from '../components/CategoryList'
import Footer from '../components/Footer'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const router = useRouter()

  const handleSearch = (category, district) => {
    if (category && district) {
      // URL oluşturma: /[il_slug]/[ilce_slug]/[kategori_slug]
      const url = `/${district.cities.slug}/${district.slug}/${category.slug}`
      router.push(url)
    }
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
  }

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Ana içerik */}
      <main className="flex-1">
        {/* Arama barı */}
        <SearchBar
          onSearch={handleSearch}
          selectedCategory={selectedCategory}
          selectedDistrict={selectedDistrict}
          onCategorySelect={handleCategorySelect}
          onDistrictSelect={handleDistrictSelect}
        />

        {/* Kategori listesi */}
        <CategoryList />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
