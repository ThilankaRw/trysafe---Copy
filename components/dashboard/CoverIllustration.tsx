export function CoverIllustration() {
  return (
    <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "rgb(31, 111, 130)", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "rgb(61, 141, 160)", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect x="40" y="30" width="120" height="100" rx="10" fill="url(#gradient)" opacity="0.1" />
      <rect x="60" y="50" width="80" height="60" rx="5" fill="url(#gradient)" opacity="0.2" />
      <rect x="70" y="70" width="60" height="20" rx="3" fill="url(#gradient)" opacity="0.4" />
      <path d="M100 20 L120 40 L80 40 Z" fill="url(#gradient)" opacity="0.6" />
      <circle cx="100" cy="110" r="10" fill="url(#gradient)" opacity="0.8" />
    </svg>
  )
}

