
import { notFound } from 'next/navigation'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import SearchModal from '../../../../components/SearchModal'
import BusinessCard from '../../../../components/BusinessCard'
import { supabase } from '../../../../lib/supabase'

// ISR ayarları - 24 saatte bir yenileme
export const revalidate = 86400

// SSG için generateStaticParams fonksiyonu
export async function generateStaticParams() {
    try {
        // Tüm aktif kategorileri al
        const { data: categories } = await supabase
            .from('categories')
            .select('slug')
            .eq('is_active', true)
            .eq('is_selectable', true)
            .in('id', ['9dc39c23-6533-4079-8f4b-904de9fad59b', 'e206828b-d123-4fbe-ae5b-29598953fb29', 'e7497f15-d563-48b5-8a12-aa87ccb5277a'])


        console.log('kategori sayısı:', categories.length)

        if (!categories) {
            return []
        }

        // Bu şehirlere ait ilçeleri al
        const { data: districts } = await supabase
            .from('districts')
            .select('slug, city_id, cities(slug)')
            .eq('city_id', 16)
            .in('id', [219, 220, 222, 223, 224, 226, 227, 228, 229, 231, 232, 233, 234])

        console.log('ilçe sayısı:', districts.length)
        if (!districts) {
            return []
        }

        // Kombinasyonları oluştur
        const params = []

        for (const category of categories) {
            for (const district of districts) {
                // Bu şehre ait ilçeleri filtrele
                params.push({
                    kategori_slug: category.slug,
                    il_slug: district.cities.slug,
                    ilce_slug: district.slug
                })
            }
        }


        console.log(`SSG için ${params.length} sayfa oluşturulacak`)
        return params
    } catch (error) {
        console.error('generateStaticParams hatası:', error)
        return []
    }
}

// SEO için dinamik metadata
export async function generateMetadata({ params }) {
    try {
        const { kategori_slug, il_slug, ilce_slug } = await params

        // Şehir bilgisini al
        const { data: cityData } = await supabase
            .from('cities')
            .select('name')
            .eq('slug', il_slug)
            .single()

        // İlçe bilgisini al
        const { data: districtData } = await supabase
            .from('districts')
            .select('name')
            .eq('slug', ilce_slug)
            .single()

        // Kategori bilgisini al
        const { data: categoryData } = await supabase
            .from('categories')
            .select('name, seo_title, seo_description')
            .eq('slug', kategori_slug)
            .single()

        if (!cityData || !districtData || !categoryData) {
            return {
                title: 'Sayfa Bulunamadı',
                description: 'Aradığınız sayfa mevcut değil.'
            }
        }

        const title = categoryData.seo_title || `${districtData.name}, ${cityData.name} yakınlarındaki en iyi ${categoryData.name.toLowerCase()}`
        const description = categoryData.seo_description || `${districtData.name}, ${cityData.name} bölgesindeki ${categoryData.name.toLowerCase()} hizmeti veren işletmeleri keşfedin.`

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                type: 'website',
            },
        }
    } catch (error) {
        console.error('generateMetadata hatası:', error)
        return {
            title: 'Sayfa Bulunamadı',
            description: 'Aradığınız sayfa mevcut değil.'
        }
    }
}

// Veri çekme fonksiyonu - SSG için optimize edilmiş
async function fetchPageData(params) {
    const { kategori_slug, il_slug, ilce_slug } = await params

    try {
        // Paralel olarak temel verileri al
        const [cityResult, categoryResult] = await Promise.all([
            supabase
                .from('cities')
                .select('*')
                .eq('slug', il_slug)
                .single(),
            supabase
                .from('categories')
                .select('*')
                .eq('slug', kategori_slug)
                .single()
        ])

        if (cityResult.error) throw cityResult.error
        if (categoryResult.error) throw categoryResult.error

        const cityData = cityResult.data
        const categoryData = categoryResult.data

        // İlçe bilgisini al
        const { data: districtData, error: districtError } = await supabase
            .from('districts')
            .select(`
                *,
                cities(*)
            `)
            .eq('slug', ilce_slug)
            .eq('city_id', cityData.id)
            .single()

        if (districtError) throw districtError

        // Alt kategorileri ve işletmeleri paralel olarak al
        const [subCategoriesResult, businessDistrictsResult] = await Promise.all([
            supabase
                .from('categories')
                .select('*')
                .eq('parent_id', categoryData.id)
                .eq('is_active', true)
                .order('display_order'),
            supabase
                .from('business_districts')
                .select('business_id')
                .eq('district_id', districtData.id)
        ])

        if (businessDistrictsResult.error) throw businessDistrictsResult.error

        const businessIds = businessDistrictsResult.data?.map(item => item.business_id) || []
        let businesses = []

        if (businessIds.length > 0) {
            // İşletmeleri al
            const { data: businessesData, error: businessesError } = await supabase
                .from('business_categories')
                .select(`
                    businesses(
                        slug,
                        address,
                        name,
                        tagline,
                        phone,
                        website,
                        rating,
                        review_count,
                        business_photos(image_url,is_cover),
                        districts(name,slug),
                        cities(name,slug)
                    )
                `)
                .eq('category_id', categoryData.id)
                .in('business_id', businessIds)
                .limit(50) // Performans için limit

            if (businessesError) throw businessesError

            businesses = businessesData?.map(item => item.businesses).filter(Boolean) || []
        }

        return {
            city: cityData,
            district: districtData,
            category: categoryData,
            subCategories: subCategoriesResult.data || [],
            businesses
        }
    } catch (error) {
        console.error('Veri yükleme hatası:', error)
        throw error
    }
}

export default async function ListingPage({ params }) {
    let pageData
    try {
        pageData = await fetchPageData(params)
    } catch (error) {
        notFound()
    }

    const { city, district, category, subCategories, businesses } = pageData

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="py-3 md:py-6">
                <div className="max-w-7xl mx-auto px-2 md:px-4 lg:px-8">
                    {/* Arama Barı */}
                    <div className="mb-2 md:mb-6">
                        <SearchModal
                            currentCategory={category}
                            currentDistrict={district}
                            currentCity={city}
                        />
                    </div>

                    {/* Alt Kategori Filtreleri */}
                    {subCategories.length > 0 && (
                        <div className="mb-2 md:mb-6">
                            <div className="flex flex-wrap gap-2">
                                {subCategories.map((subCategory, index) => (
                                    <a
                                        key={index}
                                        href={`/${subCategory.slug}/${city.slug}/${district.slug}`}
                                        className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-[#fff7ed] hover:border-primary-300 hover:text-primary-700 transition-colors"
                                    >
                                        {subCategory.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Breadcrumb */}
                    <nav className="mb-2 md:mb-6">
                        <ol className="flex items-center space-x-0 md:space-x-2 text-sm text-gray-500">
                            <li>
                                <a href="/" className="hover:text-primary-600">enCivar</a>
                            </li>
                            <li className="flex items-center">
                                <svg className="h-4 w-4 mx-0 md:mx-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                                <a href={`/${category.slug}`} className="hover:text-primary-600">{category.name}</a>
                            </li>
                            <li className="flex items-center">
                                <svg className="h-4 w-4 mx-0 md:mx-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                                <a href={`/${category.slug}/${city.slug}`} className="hover:text-primary-600">{city.name}</a>
                            </li>
                            <li className="flex items-center">
                                <svg className="h-4 w-4 mx-0 md:mx-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>{district.name}</span>
                            </li>
                        </ol>
                    </nav>

                    {/* Sayfa Başlığı */}
                    <div className="mb-4 md:mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            {district.name}, {city.name} yakınlarındaki en iyi {businesses.length} {category.name.toLowerCase()}
                        </h1>
                        <p className="text-gray-600">
                            {district.name}, {city.name} bölgesindeki {category.name.toLowerCase()} hizmeti veren işletmeleri keşfedin.
                        </p>
                    </div>

                    {/* İşletme Listesi */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {businesses.map((business, index) => (
                            <BusinessCard key={index} business={business} index={index} />
                        ))}
                    </div>

                    {/* Sonuç bulunamadı */}
                    {businesses.length === 0 && (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">İşletme bulunamadı</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Bu bölgede henüz {category.name.toLowerCase()} hizmeti veren işletme eklenmemiş.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
