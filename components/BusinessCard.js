import Image from 'next/image'
import BusinessActionButtons from './BusinessActionButtons'

export default function BusinessCard({ business, index, categoryName }) {

    const coverPhoto = business.business_photos?.find(photo => photo.is_cover) || business.business_photos?.[0]

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow h-96 w-full">
            {/* İşletme Görseli - Sabit boyutlu container */}
            <a href={`/isletme/${business.slug}`} className='block'>
                <div className="w-full h-48 relative group overflow-hidden">
                    {coverPhoto ? (
                        <div className="relative">
                            <Image
                                src={coverPhoto.image_url}
                                alt={business.name}
                                width={500}
                                height={192}
                                className="object-cover group-hover:scale-105 transition-transform duration-300 w-full h-full"
                                priority={index < 4}
                            />
                            <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1 z-10 shadow-lg border border-white/20">
                                <span className="text-xs font-normal text-[#FF6000] uppercase tracking-wide">{categoryName}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                    )}
                </div>
            </a>

            {/* İşletme Bilgileri - Flex grow ile esnek alan */}
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-center space-x-1 justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-[#FF6000] transition-colors">{business.name}</h3>
                        {/* Rating */}
                        <div className="flex items-center space-x-1">
                            <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-900">{business.rating || '0.0'}</span>
                            <span className="text-sm text-gray-500">({business.review_count || 0})</span>
                        </div>
                    </div>

                    {business.tagline && (
                        <p className="text-sm text-gray-600 mb-2">{business.tagline}</p>
                    )}

                    {/* Konum */}
                    <p className="text-sm text-gray-600 flex items-center space-x-1 gap-1">
                        {/* map icon */}
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {business.cities?.name} • {business.districts?.name}
                    </p>
                </div>

                {/* Aksiyon Butonları - Alt kısma sabitlenmiş */}
                {business.phone && (
                    <BusinessActionButtons business={business} />
                )}
            </div>
        </div>
    )
}
