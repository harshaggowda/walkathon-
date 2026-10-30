import React from 'react';
import styles from './HeroSection.module.css';

export const HeroFallback: React.FC = () => {
  return (
    <div className={styles.fallbackContainer} aria-hidden="true">
      {/* Cinematic Walkathon Journey Illustration for Static/Reduced-Motion/Non-WebGL contexts */}
      <svg
        className={styles.fallbackSvg}
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Dawn Sky Gradient */}
          <radialGradient id="skyDawn" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#FFA040" stopOpacity="0.45" />
            <stop offset="35%" stopColor="#FF5722" stopOpacity="0.25" />
            <stop offset="70%" stopColor="#0B132B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#070B14" stopOpacity="1" />
          </radialGradient>

          {/* Boulevard Perspective Gradient */}
          <linearGradient id="roadGrad" x1="50%" y1="100%" x2="50%" y2="35%">
            <stop offset="0%" stopColor="#0C1527" />
            <stop offset="70%" stopColor="#15223D" />
            <stop offset="100%" stopColor="#283E6B" />
          </linearGradient>

          {/* Neon Orange Border Glow */}
          <linearGradient id="orangeGlow" x1="0%" y1="100%" x2="50%" y2="40%">
            <stop offset="0%" stopColor="#FF5722" stopOpacity="1" />
            <stop offset="50%" stopColor="#FF7043" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#F5A623" stopOpacity="0.3" />
          </linearGradient>

          {/* Cyan Energy Ribbon */}
          <linearGradient id="cyanGlow" x1="100%" y1="100%" x2="50%" y2="40%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="1" />
            <stop offset="60%" stopColor="#00B0FF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#F5A623" stopOpacity="0.2" />
          </linearGradient>

          {/* Finish Arch Glow */}
          <radialGradient id="archGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFA726" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#FF5722" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#070B14" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky Background */}
        <rect width="1440" height="900" fill="url(#skyDawn)" />

        {/* Sunrise Halo on Horizon */}
        <circle cx="720" cy="380" r="280" fill="url(#archGlow)" />

        {/* Perspective Boulevard Road Surface */}
        <polygon points="120,900 1320,900 760,380 680,380" fill="url(#roadGrad)" />

        {/* Glowing Orange Left Track Border */}
        <line x1="120" y1="900" x2="680" y2="380" stroke="url(#orangeGlow)" strokeWidth="8" />

        {/* Glowing Cyan Right Track Border */}
        <line x1="1320" y1="900" x2="760" y2="380" stroke="url(#cyanGlow)" strokeWidth="8" />

        {/* Center Dashed Stride Markers */}
        <line x1="720" y1="900" x2="720" y2="380" stroke="#F5A623" strokeWidth="4" strokeDasharray="30 25" opacity="0.8" />

        {/* Distant Finish Archway */}
        <g transform="translate(640, 270)">
          {/* Left Arch Pillar */}
          <rect x="0" y="0" width="22" height="110" rx="3" fill="#1E293B" stroke="#FF5722" strokeWidth="2" />
          {/* Right Arch Pillar */}
          <rect x="138" y="0" width="22" height="110" rx="3" fill="#1E293B" stroke="#F5A623" strokeWidth="2" />
          {/* Overhead Marquee */}
          <rect x="-10" y="-18" width="180" height="26" rx="4" fill="#0F172A" stroke="#FFA726" strokeWidth="2" />
          {/* Banner Text Accent */}
          <line x1="0" y1="-5" x2="160" y2="-5" stroke="#FF7043" strokeWidth="3" />
          {/* Sky Beams */}
          <polygon points="11,-18 -40,-350 60,-350" fill="#FFA040" opacity="0.15" />
          <polygon points="149,-18 100,-350 200,-350" fill="#FFA040" opacity="0.15" />
        </g>

        {/* Athletic Walker Silhouette in Foreground (Walking toward destination) */}
        <g transform="translate(710, 520)">
          {/* Ground Contact Shadow */}
          <ellipse cx="25" cy="245" rx="55" ry="14" fill="#000000" opacity="0.75" />

          {/* Stride: Left Leg (Forward) */}
          <path d="M 16 140 L 4 200 L -8 240 L 8 244 L 18 205 Z" fill="#0F1E36" />
          {/* Stride: Right Leg (Back push-off) */}
          <path d="M 32 140 L 46 195 L 60 236 L 50 242 L 34 200 Z" fill="#162947" />

          {/* Athletic Torso & Moisture-wicking Vest */}
          <path d="M 8 70 L 42 70 L 36 145 L 14 145 Z" fill="#0D1B2A" stroke="#FF5722" strokeWidth="1.5" />
          {/* Orange Athletic Back Racing Stripe */}
          <line x1="25" y1="75" x2="25" y2="140" stroke="#FF5722" strokeWidth="3.5" strokeLinecap="round" />

          {/* Arms in brisk walking cadence */}
          <path d="M 10 75 L -10 115 L 2 135" stroke="#162947" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 40 75 L 58 110 L 48 132" stroke="#0F1E36" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />

          {/* Athletic Head & Cap/Visor */}
          <circle cx="25" cy="46" r="16" fill="#1E293B" />
          {/* Visor / Rim Light Highlight */}
          <path d="M 16 38 Q 25 32, 34 38" stroke="#FFA726" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Ambient Morning Energy Motes */}
        <circle cx="480" cy="480" r="3.5" fill="#FFA040" opacity="0.8" />
        <circle cx="560" cy="420" r="2.5" fill="#FF7043" opacity="0.9" />
        <circle cx="860" cy="450" r="3" fill="#00E5FF" opacity="0.7" />
        <circle cx="980" cy="510" r="4" fill="#FFA040" opacity="0.85" />
        <circle cx="340" cy="620" r="3" fill="#F5A623" opacity="0.6" />
        <circle cx="1120" cy="600" r="3.5" fill="#FF5722" opacity="0.7" />
      </svg>
    </div>
  );
};
export default HeroFallback;
