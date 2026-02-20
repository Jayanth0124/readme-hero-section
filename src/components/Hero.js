import { themes } from '../themes';

export function generateHeroSvg(data, themeName = 'royal') {
  const theme = themes[themeName] || themes.royal;
  const { name = "Jayanth", role = "Full-Stack Developer", views = "Tracking...", wakatime = "Tracking...", avatar } = data;

  const width = 760;
  const height = 260; 

  const accent = theme.accent; 
  const textMain = theme.textMain;
  const textMuted = theme.textMuted;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="avatar-clip">
          <circle cx="130" cy="130" r="75" />
        </clipPath>

        <radialGradient id="bg-grad" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="${theme.bgStart}"/>
          <stop offset="100%" stop-color="${theme.bgEnd}"/>
        </radialGradient>

        <radialGradient id="core-glow" cx="130" cy="130" r="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="${theme.bgEnd}" stop-opacity="0"/>
        </radialGradient>

        <filter id="heavy-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>

        <pattern id="tech-grid" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <rect width="30" height="30" fill="none" stroke="${accent}" stroke-opacity="0.06" stroke-width="0.5"/>
          <circle cx="30" cy="30" r="1" fill="${accent}" opacity="0.15"/>
        </pattern>
      </defs>

      <style>
        .title { font-family: "Georgia", "Times New Roman", serif; font-weight: bold; fill: ${textMain}; }
        .subtitle { font-family: "Courier New", Courier, monospace; font-weight: bold; fill: ${accent}; }
        .data-label { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 9px; font-weight: 700; fill: ${textMuted}; letter-spacing: 2px; text-transform: uppercase; }
        .data-value { font-family: "Courier New", Courier, monospace; font-size: 16px; font-weight: bold; fill: ${textMain}; }

        @keyframes orbit-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-ccw {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulse-opacity {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes data-stream {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
      </style>

      <rect width="${width}" height="${height}" rx="16" fill="url(#bg-grad)" stroke="${accent}" stroke-opacity="0.2" stroke-width="1"/>
      <rect width="${width}" height="${height}" rx="16" fill="url(#tech-grid)" />

      <path d="M 20 50 L 20 20 L 50 20" fill="none" stroke="${accent}" stroke-width="1.5" opacity="0.6"/>
      <circle cx="20" cy="20" r="2" fill="${accent}"/>
      <path d="M ${width - 20} ${height - 50} L ${width - 20} ${height - 20} L ${width - 50} ${height - 20}" fill="none" stroke="${accent}" stroke-width="1.5" opacity="0.6"/>
      <circle cx="${width - 20}" cy="${height - 20}" r="2" fill="${accent}"/>

      <circle cx="130" cy="130" r="150" fill="url(#core-glow)" />

      <g style="transform-origin: 130px 130px; animation: orbit-cw 25s linear infinite;">
        <circle cx="130" cy="130" r="95" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="2 6" opacity="0.6"/>
        <circle cx="130" cy="130" r="102" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="40 120" filter="url(#heavy-glow)"/>
      </g>
      <g style="transform-origin: 130px 130px; animation: orbit-ccw 20s linear infinite;">
        <circle cx="130" cy="130" r="85" fill="none" stroke="${accent}" stroke-width="1" stroke-dasharray="10 4 2 4" opacity="0.8"/>
      </g>

      <g clip-path="url(#avatar-clip)">
        <rect x="55" y="55" width="150" height="150" fill="${theme.glass}"/>
        ${avatar ? `<image href="${avatar}" x="55" y="55" width="150" height="150" preserveAspectRatio="xMidYMid slice" />` : ''}
      </g>

      <path d="M 235 130 L 250 130 L 275 75 L 510 75" fill="none" stroke="${accent}" stroke-width="1" opacity="0.3"/>
      <path d="M 235 130 L 250 130 L 275 75 L 510 75" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="15 800" style="animation: data-stream 4s linear infinite;"/>

      <path d="M 235 130 L 250 130 L 275 185 L 510 185" fill="none" stroke="${accent}" stroke-width="1" opacity="0.3"/>
      <path d="M 235 130 L 250 130 L 275 185 L 510 185" fill="none" stroke="${accent}" stroke-width="1.5" stroke-dasharray="15 800" style="animation: data-stream 4s linear infinite reverse;"/>

      <g transform="translate(395, 120)">
        <text x="0" y="0" class="title" text-anchor="middle" font-size="36" letter-spacing="4">${name.toUpperCase()}</text>
        <rect x="-90" y="15" width="180" height="1" fill="${accent}" opacity="0.4"/>
        <rect x="-30" y="14" width="60" height="3" fill="${accent}" filter="url(#heavy-glow)" style="animation: pulse-opacity 3s infinite;"/>
        <text x="0" y="38" class="subtitle" text-anchor="middle" font-size="12" letter-spacing="3">${role.toUpperCase()}</text>
      </g>

      <g transform="translate(510, 40)">
        <polygon points="10,0 200,0 210,10 210,60 200,70 10,70 0,60 0,10" fill="${theme.glass}" stroke="${accent}" stroke-opacity="0.4" stroke-width="1"/>
        <circle cx="20" cy="24" r="3" fill="${accent}" filter="url(#heavy-glow)"/>
        <text x="32" y="27" class="data-label">PROFILE VIEWS</text>
        <text x="20" y="52" class="data-value">${views}</text>
      </g>

      <g transform="translate(510, 150)">
        <polygon points="10,0 200,0 210,10 210,60 200,70 10,70 0,60 0,10" fill="${theme.glass}" stroke="${accent}" stroke-opacity="0.4" stroke-width="1"/>
        <circle cx="20" cy="24" r="3" fill="${accent}" filter="url(#heavy-glow)"/>
        <text x="32" y="27" class="data-label">CODING METRICS</text>
        <text x="20" y="52" class="data-value">${wakatime}</text>
      </g>
    </svg>
  `;
}