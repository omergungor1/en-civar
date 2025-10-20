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
        authorized_person: '',
        email: '',
        website: '',
        address: '',
        district_id: '',
        category_id: '',
        business_hours: [
            { day_of_week: 0, open_time: '09:00', close_time: '18:00', is_closed: false, is_24_hours: false },
            { day_of_week: 1, open_time: '09:00', close_time: '18:00', is_closed: false, is_24_hours: false },
            { day_of_week: 2, open_time: '09:00', close_time: '18:00', is_closed: false, is_24_hours: false },
            { day_of_week: 3, open_time: '09:00', close_time: '18:00', is_closed: false, is_24_hours: false },
            { day_of_week: 4, open_time: '09:00', close_time: '18:00', is_closed: false, is_24_hours: false },
            { day_of_week: 5, open_time: '10:00', close_time: '16:00', is_closed: true, is_24_hours: false },
            { day_of_week: 6, open_time: '00:00', close_time: '00:00', is_closed: true, is_24_hours: false },
        ]
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

    const handleHourChange = (index, field, value) => {
        setFormData(prev => {
            const updated = [...prev.business_hours]
            updated[index] = { ...updated[index], [field]: value }
            // Mantık: is_closed true ise saatleri resetle, is_24_hours true ise saatleri 00:00-24:00 gösterme yerine disable
            if (field === 'is_closed' && value) {
                updated[index].is_24_hours = false
            }
            if (field === 'is_24_hours' && value) {
                updated[index].is_closed = false
            }
            return { ...prev, business_hours: updated }
        })
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'İşletme adı gereklidir'
        }

        if (!formData.authorized_person.trim()) {
            newErrors.authorized_person = 'Yetkili adı gereklidir'
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

        // Çalışma saatleri temel kontrol
        formData.business_hours.forEach(h => {
            if (!h.is_closed && !h.is_24_hours) {
                if (!h.open_time || !h.close_time) {
                    newErrors.business_hours = 'Çalışma saatleri eksik. Açık günler için saatleri giriniz.'
                }
            }
        })

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
            const { data: created, error } = await supabase
                .from('businesses')
                .insert([{
                    name: formData.name,
                    tagline: formData.tagline,
                    description: formData.description,
                    phone: formData.phone,
                    authorized_person: formData.authorized_person,
                    email: formData.email,
                    website: formData.website,
                    address: formData.address,
                    district_id: formData.district_id,
                    status: 'pending',
                    verified: false,
                    created_at: new Date().toISOString()
                }])
                .select()
                .single()

            if (error) throw error

            // Çalışma saatlerini ve kategoriyi ekle
            if (created?.id) {
                // Çalışma saatlerini ekle
                const hoursPayload = formData.business_hours.map(h => ({
                    business_id: created.id,
                    day_of_week: h.day_of_week,
                    open_time: h.is_closed || h.is_24_hours ? null : h.open_time,
                    close_time: h.is_closed || h.is_24_hours ? null : h.close_time,
                    is_closed: h.is_closed,
                    is_24_hours: h.is_24_hours,
                }))
                const { error: hoursError } = await supabase
                    .from('business_hours')
                    .insert(hoursPayload)
                if (hoursError) throw hoursError

                // Kategoriyi ekle
                const { error: categoryError } = await supabase
                    .from('business_categories')
                    .insert([{
                        business_id: created.id,
                        category_id: formData.category_id
                    }])
                if (categoryError) throw categoryError
            }

            setSubmitted(true)
            setFormData({
                name: '',
                authorized_person: '',
                tagline: '',
                description: '',
                phone: '',
                email: '',
                website: '',
                address: '',
                district_id: '',
                category_id: '',
                business_hours: [
                    { day_of_week: 0, open_time: '09:00', close_time: '18:00', is_closed: false, is_24_hours: false },
                    { day_of_week: 1, open_time: '09:00', close_time: '18:00', is_closed: false, is_24_hours: false },
                    { day_of_week: 2, open_time: '09:00', close_time: '18:00', is_closed: false, is_24_hours: false },
                    { day_of_week: 3, open_time: '09:00', close_time: '18:00', is_closed: false, is_24_hours: false },
                    { day_of_week: 4, open_time: '09:00', close_time: '18:00', is_closed: false, is_24_hours: false },
                    { day_of_week: 5, open_time: '10:00', close_time: '16:00', is_closed: true, is_24_hours: false },
                    { day_of_week: 6, open_time: '00:00', close_time: '00:00', is_closed: true, is_24_hours: false },
                ]
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
                                    <label htmlFor="authorized_person" className="block text-sm font-medium text-gray-700 mb-2">
                                        Yetkili Adı *
                                    </label>
                                    <input
                                        type="text"
                                        id="authorized_person"
                                        name="authorized_person"
                                        value={formData.authorized_person}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.authorized_person ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="Örn: Ahmet Yılmaz"
                                    />
                                    {errors.authorized_person && <p className="mt-1 text-sm text-red-600">{errors.authorized_person}</p>}
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

                            {/* Çalışma Saatleri */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    Çalışma Saatleri
                                </label>
                                {errors.business_hours && <p className="mb-3 text-sm text-red-600">{errors.business_hours}</p>}

                                {/* Desktop görünüm */}
                                <div className="hidden md:block space-y-3">
                                    {formData.business_hours.map((h, idx) => (
                                        <div key={h.day_of_week} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-20 text-sm font-medium text-gray-700">
                                                {h.day_of_week === 0 ? 'Pazartesi' :
                                                    h.day_of_week === 1 ? 'Salı' :
                                                        h.day_of_week === 2 ? 'Çarşamba' :
                                                            h.day_of_week === 3 ? 'Perşembe' :
                                                                h.day_of_week === 4 ? 'Cuma' :
                                                                    h.day_of_week === 5 ? 'Cumartesi' : 'Pazar'}
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!h.is_closed}
                                                        onChange={(e) => handleHourChange(idx, 'is_closed', e.target.checked)}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-sm text-gray-600">Kapalı</span>
                                                </label>

                                                {!h.is_closed && (
                                                    <label className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!h.is_24_hours}
                                                            onChange={(e) => handleHourChange(idx, 'is_24_hours', e.target.checked)}
                                                            className="mr-2"
                                                        />
                                                        <span className="text-sm text-gray-600">24 Saat</span>
                                                    </label>
                                                )}
                                            </div>

                                            {!h.is_closed && !h.is_24_hours && (
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="time"
                                                        value={h.open_time || ''}
                                                        onChange={(e) => handleHourChange(idx, 'open_time', e.target.value)}
                                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                    />
                                                    <span className="text-gray-500">-</span>
                                                    <input
                                                        type="time"
                                                        value={h.close_time || ''}
                                                        onChange={(e) => handleHourChange(idx, 'close_time', e.target.value)}
                                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                    />
                                                </div>
                                            )}

                                            {!h.is_closed && h.is_24_hours && (
                                                <span className="text-sm text-green-600 font-medium">24 Saat Açık</span>
                                            )}

                                            {h.is_closed && (
                                                <span className="text-sm text-red-600 font-medium">Kapalı</span>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Mobil görünüm */}
                                <div className="md:hidden space-y-3">
                                    {formData.business_hours.map((h, idx) => (
                                        <div key={h.day_of_week} className="p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="font-medium text-gray-700">
                                                    {h.day_of_week === 0 ? 'Pazartesi' :
                                                        h.day_of_week === 1 ? 'Salı' :
                                                            h.day_of_week === 2 ? 'Çarşamba' :
                                                                h.day_of_week === 3 ? 'Perşembe' :
                                                                    h.day_of_week === 4 ? 'Cuma' :
                                                                        h.day_of_week === 5 ? 'Cumartesi' : 'Pazar'}
                                                </span>

                                                <div className="flex items-center space-x-3">
                                                    <label className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!h.is_closed}
                                                            onChange={(e) => handleHourChange(idx, 'is_closed', e.target.checked)}
                                                            className="mr-1"
                                                        />
                                                        <span className="text-xs text-gray-600">Kapalı</span>
                                                    </label>

                                                    {!h.is_closed && (
                                                        <label className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={!!h.is_24_hours}
                                                                onChange={(e) => handleHourChange(idx, 'is_24_hours', e.target.checked)}
                                                                className="mr-1"
                                                            />
                                                            <span className="text-xs text-gray-600">24 Saat</span>
                                                        </label>
                                                    )}
                                                </div>
                                            </div>

                                            {!h.is_closed && !h.is_24_hours && (
                                                <div className="grid grid-cols-2 gap-x-2 space-x-4">
                                                    <div>
                                                        <label className="block text-xs text-gray-500 mb-1">Açılış</label>
                                                        <input
                                                            type="time"
                                                            value={h.open_time || ''}
                                                            onChange={(e) => handleHourChange(idx, 'open_time', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-500 mb-1">Kapanış</label>
                                                        <input
                                                            type="time"
                                                            value={h.close_time || ''}
                                                            onChange={(e) => handleHourChange(idx, 'close_time', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {!h.is_closed && h.is_24_hours && (
                                                <div className="text-center py-2">
                                                    <span className="text-sm text-green-600 font-medium">24 Saat Açık</span>
                                                </div>
                                            )}

                                            {h.is_closed && (
                                                <div className="text-center py-2">
                                                    <span className="text-sm text-red-600 font-medium">Kapalı</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
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
