export function PlaceholderSVG() {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="#1a1a1a"/>
      <path d="M160 140H240V260H160V140Z" fill="#333"/>
      <path d="M185 165L215 235H155L185 165Z" fill="#555"/>
      <circle cx="215" cy="185" r="15" fill="#555"/>
    </svg>
  `)}`
} 