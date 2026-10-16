import React from 'react';
import styles from './HeroSection.module.css';

export const HeroFallback: React.FC = () => {
  return (
    <div className={styles.fallbackContainer} aria-hidden="true">
      {/* Editorial SVG Athletic Wave / Route Geometry */}
      <svg
        className={styles.fallbackSvg}
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="fallbackOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF7043" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#FF5722" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#F5A623" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="fallbackGold" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#F5A623" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FF5722" stopOpacity="0.8" />
          </linearGradient>
          <radialGradient id="fallbackGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF5722" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#080C16" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="720" cy="450" r="420" fill="url(#fallbackGlow)" />

        {/* Primary Dynamic Route Ribbon */}
        <path
          d="M -100 700 C 300 800, 500 200, 850 350 C 1200 500, 1300 150, 1600 250"
          stroke="url(#fallbackOrange)"
          strokeWidth="64"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Counter Flow Line */}
        <path
          d="M -50 450 C 400 150, 600 650, 1050 400 C 1350 220, 1400 550, 1600 600"
          stroke="url(#fallbackGold)"
          strokeWidth="28"
          strokeLinecap="round"
          opacity="0.65"
        />

        {/* Runner Spark Nodes */}
        <circle cx="480" cy="380" r="10" fill="#FF7043" />
        <circle cx="750" cy="330" r="14" fill="#F5A623" />
        <circle cx="950" cy="420" r="12" fill="#00E5FF" />
        <circle cx="1180" cy="310" r="8" fill="#FF7043" />
      </svg>
    </div>
  );
};
