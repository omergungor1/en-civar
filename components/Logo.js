import Image from 'next/image'

export default function Logo({
    className = "h-8 md:h-10 w-auto",
    showText = false,
    textClassName = "text-gray-500 text-sm md:text-lg font-medium",
    containerClassName = "flex items-center space-x-2"
}) {
    return (
        <div className={containerClassName}>
            <Image
                src="/logo.webp"
                alt="EnCivar"
                width={30}
                height={6}
                className={className}
                style={{ width: 'auto', height: 'auto' }}
                priority
            />
            {showText && (
                <span className={textClassName}>EnCivar</span>
            )}
        </div>
    )
}
