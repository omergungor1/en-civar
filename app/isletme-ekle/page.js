'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { supabase } from '../../lib/supabase'

export default function BusinessAddPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        tagline: '',
        description: '',
        phone: '',
        whatsapp: '',
        email: '',
        website: '',
        address: '',
        district_id: '',
        category_id: '',
        latitude: '',
        longitude: ''
    })
    const [districts, setDistricts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        fetchInitialData()
    }, [])

    const fetchInitialData = async () => {
        try {
            // İlçeleri al
            const { data: districtsData, error: districtsError } = await supabase
                .from('districts')
                .select(`
          *,
          cities(name)
        `)
                .order('name')

            if (!districtsError) {
                setDistricts(districtsData || [])
            }

            // Kategorileri al
            const { data: categoriesData, error: categoriesError } = await supabase
                .from('categories')
                .select('*')
                .eq('is_active', true)
                .eq('is_selectable', true)
                .order('name')

            if (!categoriesError) {
                setCategories(categoriesData || [])
            }
        } catch (error) {
            console.error('Veri yükleme hatası:', error)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Hata temizleme
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'İşletme adı gereklidir'
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Telefon numarası gereklidir'
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Adres gereklidir'
        }

        if (!formData.district_id) {
            newErrors.district_id = 'İlçe seçimi gereklidir'
        }

        if (!formData.category_id) {
            newErrors.category_id = 'Kategori seçimi gereklidir'
        }

        // Telefon formatı kontrolü
        if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
            newErrors.phone = 'Geçerli bir telefon numarası giriniz'
        }

        // Email formatı kontrolü
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Geçerli bir email adresi giriniz'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)

        try {
            const { error } = await supabase
                .from('business_submissions')
                .insert([{
                    ...formData,
                    status: 'pending',
                    created_at: new Date().toISOString()
                }])

            if (error) throw error

            setSubmitted(true)
            setFormData({
                name: '',
                tagline: '',
                description: '',
                phone: '',
                whatsapp: '',
                email: '',
                website: '',
                address: '',
                district_id: '',
                category_id: '',
                latitude: '',
                longitude: ''
            })

        } catch (error) {
            console.error('Form gönderme hatası:', error)
            alert('Form gönderilirken bir hata oluştu. Lütfen tekrar deneyin.')
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />

                <main className="py-12">
                    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                Başvurunuz Alındı!
                            </h1>

                            <p className="text-gray-600 mb-6">
                                İşletme bilgileriniz başarıyla gönderildi. Ekibimiz en kısa sürede inceleme yaparak
                                işletmenizi sisteme ekleyecektir. Bu süreç genellikle 1-2 iş günü sürmektedir.
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push('/')}
                                    className="w-full bg-[#FF6000] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#ea580c] transition-colors"
                                >
                                    Ana Sayfaya Dön
                                </button>

                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                >
                                    Yeni İşletme Ekle
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Sayfa Başlığı */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">İşletme Ekle</h1>
                        <p className="text-gray-600">
                            İşletmenizi EnCivar'a ekleyerek müşterilerinize ulaşın. Bilgilerinizi doldurun,
                            ekibimiz inceleme yaparak işletmenizi sisteme ekleyecektir.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* İşletme Adı */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    İşletme Adı *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.name ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Örn: Usta Ali Çiçekçilik"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Slogan */}
                            <div>
                                <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-2">
                                    Slogan
                                </label>
                                <input
                                    type="text"
                                    id="tagline"
                                    name="tagline"
                                    value={formData.tagline}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Örn: En taze çiçekler, en uygun fiyatlar"
                                />
                            </div>

                            {/* Açıklama */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Açıklama
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="İşletmeniz hakkında detaylı bilgi verin..."
                                />
                            </div>

                            {/* İletişim Bilgileri */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Telefon *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.phone ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="Örn: 0532 123 45 67"
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                                        WhatsApp
                                    </label>
                                    <input
                                        type="tel"
                                        id="whatsapp"
                                        name="whatsapp"
                                        value={formData.whatsapp}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Örn: 0532 123 45 67"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.email ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="ornek@email.com"
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                                        Website
                                    </label>
                                    <input
                                        type="url"
                                        id="website"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="https://www.ornek.com"
                                    />
                                </div>
                            </div>

                            {/* Adres */}
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                    Adres *
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.address ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Tam adres bilginizi giriniz"
                                />
                                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                            </div>

                            {/* Konum ve Kategori */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="district_id" className="block text-sm font-medium text-gray-700 mb-2">
                                        İlçe *
                                    </label>
                                    <select
                                        id="district_id"
                                        name="district_id"
                                        value={formData.district_id}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.district_id ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">İlçe seçin</option>
                                        {districts.map((district) => (
                                            <option key={district.id} value={district.id}>
                                                {district.name}, {district.cities?.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.district_id && <p className="mt-1 text-sm text-red-600">{errors.district_id}</p>}
                                </div>

                                <div>
                                    <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                                        Kategori *
                                    </label>
                                    <select
                                        id="category_id"
                                        name="category_id"
                                        value={formData.category_id}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.category_id ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Kategori seçin</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
                                </div>
                            </div>

                            {/* Koordinatlar */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
                                        Enlem (Latitude)
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        id="latitude"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Örn: 40.123456"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">
                                        Boylam (Longitude)
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        id="longitude"
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Örn: 29.123456"
                                    />
                                </div>
                            </div>

                            {/* Gönder Butonu */}
                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#FF6000] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#ea580c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Gönderiliyor...' : 'İşletme Ekle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
