import Image from "next/image"

export default function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-10 h-10 relative">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2025-01-14_140644-removebg-0RjIelWMw089Z4GWZe9SpIah5iRUmc.png"
          alt="Trisafe Logo"
          layout="fill"
          className="object-contain drop-shadow-lg"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-[rgb(31,111,130)] to-blue-400 bg-clip-text text-transparent">
          TRISAFE
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">Secure Cloud Storage</span>
      </div>
    </div>
  )
}

