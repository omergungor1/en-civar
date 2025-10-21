import Image from 'next/image'

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
                    <div className="flex gap-2 mt-4">
                        <a
                            href={`tel:${business.phone.trim()}`}
                            className="flex items-center justify-center px-3 py-2 bg-[#FF6000] text-white text-sm rounded-md hover:bg-[#ea580c] transition-colors flex-1"
                        >
                            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-sm font-semibold">{business.phone}</span>
                        </a>
                        <a
                            href={`https://wa.me/${business.phone.trim()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center px-2 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors w-12"
                        >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                            </svg>
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}
