import React from 'react';

interface IllustrationProps {
  type: 'step' | 'community' | 'movement' | 'finish';
  className?: string;
}

export const CheckpointIllustration: React.FC<IllustrationProps> = ({ type, className }) => {
  switch (type) {
    case 'step':
      return (
        <svg
          viewBox="0 0 320 200"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="sunDawnStep" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFA040" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#FF5722" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="footGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF7043" />
              <stop offset="100%" stopColor="#FF5722" />
            </linearGradient>
            <linearGradient id="soleGrip" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F5A623" />
              <stop offset="100%" stopColor="#D84315" />
            </linearGradient>
          </defs>

          {/* Morning Sun Halo */}
          <circle cx="160" cy="100" r="90" fill="url(#sunDawnStep)" />

          {/* Concentric Energy Ripple Rings */}
          <circle cx="160" cy="100" r="45" stroke="#FF7043" strokeWidth="2" strokeDasharray="6 6" opacity="0.8" />
          <circle cx="160" cy="100" r="68" stroke="#F5A623" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.6" />
          <circle cx="160" cy="100" r="92" stroke="#00B4D8" strokeWidth="1" strokeDasharray="4 8" opacity="0.45" />

          {/* Stylized Modern Athletic Footprint Trajectory */}
          <g transform="translate(130, 45)">
            {/* Heel Pad */}
            <ellipse cx="30" cy="92" rx="18" ry="14" fill="url(#soleGrip)" />
            {/* Arch / Midfoot connection */}
            <path d="M 18 90 C 16 68, 22 55, 26 42 L 36 42 C 42 55, 46 72, 42 90 Z" fill="url(#footGrad)" />
            {/* Forefoot / Ball */}
            <ellipse cx="30" cy="40" rx="22" ry="16" fill="url(#soleGrip)" />
            {/* Tread Pattern Grooves */}
            <line x1="16" y1="36" x2="44" y2="36" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="14" y1="44" x2="46" y2="44" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="20" y1="88" x2="40" y2="88" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Forward Momentum Arrows */}
          <path d="M 215 90 L 235 100 L 215 110" stroke="#FF5722" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 230 90 L 250 100 L 230 110" stroke="#F5A623" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Floating Spark Dots */}
          <circle cx="85" cy="75" r="4" fill="#FF7043" />
          <circle cx="235" cy="65" r="3" fill="#F5A623" />
          <circle cx="105" cy="135" r="3.5" fill="#00B4D8" />
        </svg>
      );

    case 'community':
      return (
        <svg
          viewBox="0 0 320 200"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="skyArch" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#F5A623" />
            </linearGradient>
            <linearGradient id="commGround" x1="0%" y1="100%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="50%" stopColor="#BAE6FD" />
              <stop offset="100%" stopColor="#E0F2FE" />
            </linearGradient>
          </defs>

          {/* Background Unity Rainbow Arch */}
          <path d="M 40 160 C 40 70, 280 70, 280 160" stroke="url(#skyArch)" strokeWidth="6" strokeLinecap="round" opacity="0.35" />
          <path d="M 58 160 C 58 85, 262 85, 262 160" stroke="#0284C7" strokeWidth="2.5" strokeDasharray="5 5" opacity="0.4" />

          {/* Boulevard Pavement Horizon Line */}
          <rect x="30" y="156" width="260" height="8" rx="4" fill="url(#commGround)" />

          {/* Walker Silhouette Group: Left to Right */}
          {/* 1. Senior / Brisk Strider */}
          <g transform="translate(68, 88)">
            <circle cx="12" cy="12" r="7" fill="#0369A1" />
            <path d="M 12 21 L 12 45 L 6 68 M 12 45 L 20 68" stroke="#0369A1" strokeWidth="4" strokeLinecap="round" />
            <path d="M 12 28 L 4 45 M 12 28 L 22 40" stroke="#0369A1" strokeWidth="3.5" strokeLinecap="round" />
          </g>

          {/* 2. Family Parent */}
          <g transform="translate(112, 72)">
            <circle cx="14" cy="14" r="9" fill="#0284C7" />
            <path d="M 14 24 L 14 55 L 7 84 M 14 55 L 23 84" stroke="#0284C7" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 14 34 L 2 55 M 14 34 L 26 50" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* 3. Child in Motion */}
          <g transform="translate(150, 102)">
            <circle cx="10" cy="10" r="6" fill="#F5A623" />
            <path d="M 10 18 L 10 40 L 4 54 M 10 40 L 16 54" stroke="#F5A623" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 10 24 L 2 38 M 10 24 L 18 36" stroke="#F5A623" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* 4. Youth / Fast Walker */}
          <g transform="translate(185, 76)">
            <circle cx="14" cy="14" r="8.5" fill="#FF5722" />
            <path d="M 14 24 L 14 52 L 5 80 M 14 52 L 22 80" stroke="#FF5722" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 14 32 L 2 50 M 14 32 L 25 46" stroke="#FF5722" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* 5. Companion Walker */}
          <g transform="translate(225, 84)">
            <circle cx="12" cy="12" r="7.5" fill="#0284C7" />
            <path d="M 12 21 L 12 48 L 5 72 M 12 48 L 19 72" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
            <path d="M 12 28 L 4 46 M 12 28 L 20 42" stroke="#0284C7" strokeWidth="3.5" strokeLinecap="round" />
          </g>

          {/* Floating Cheering Sparks */}
          <circle cx="100" cy="55" r="3.5" fill="#38BDF8" />
          <circle cx="160" cy="45" r="4" fill="#F5A623" />
          <circle cx="210" cy="50" r="3.5" fill="#FF7043" />
        </svg>
      );

    case 'movement':
      return (
        <svg
          viewBox="0 0 320 200"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="vitalityPulse" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#00B4D8" />
            </linearGradient>
            <radialGradient id="greenAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Healthy Vitality Aura */}
          <circle cx="160" cy="100" r="85" fill="url(#greenAura)" />

          {/* Circular Vitality Track Ribbon */}
          <circle cx="160" cy="100" r="64" stroke="#10B981" strokeWidth="3" strokeDasharray="8 6" opacity="0.35" />

          {/* Dynamic ECG Heartbeat & Movement Pulse Curve */}
          <path
            d="M 30 110 L 80 110 L 95 110 L 110 75 L 125 145 L 140 50 L 158 135 L 175 95 L 188 110 L 290 110"
            stroke="url(#vitalityPulse)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Peak Vitality Heart Icon */}
          <g transform="translate(132, 28)">
            <path
              d="M 12 5 C 7 0, 0 3, 0 10 C 0 18, 12 26, 12 26 C 12 26, 24 18, 24 10 C 24 3, 17 0, 12 5 Z"
              fill="#10B981"
            />
          </g>

          {/* Fresh Green Foliage Accents */}
          <path d="M 65 75 Q 85 60, 95 75 Q 85 90, 65 75 Z" fill="#10B981" opacity="0.85" />
          <path d="M 235 65 Q 255 50, 265 65 Q 255 80, 235 65 Z" fill="#059669" opacity="0.85" />

          {/* Distance Pace Pill Badges */}
          <g transform="translate(60, 142)">
            <rect width="48" height="22" rx="11" fill="#E8F5E9" stroke="#10B981" strokeWidth="1.5" />
            <text x="24" y="15" textAnchor="middle" fill="#047857" fontSize="11" fontWeight="700" fontFamily="sans-serif">
              3K
            </text>
          </g>
          <g transform="translate(136, 142)">
            <rect width="48" height="22" rx="11" fill="#E8F5E9" stroke="#10B981" strokeWidth="1.5" />
            <text x="24" y="15" textAnchor="middle" fill="#047857" fontSize="11" fontWeight="700" fontFamily="sans-serif">
              5K
            </text>
          </g>
          <g transform="translate(212, 142)">
            <rect width="48" height="22" rx="11" fill="#E8F5E9" stroke="#10B981" strokeWidth="1.5" />
            <text x="24" y="15" textAnchor="middle" fill="#047857" fontSize="11" fontWeight="700" fontFamily="sans-serif">
              10K
            </text>
          </g>
        </svg>
      );

    case 'finish':
      return (
        <svg
          viewBox="0 0 320 200"
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="goldArch" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5A623" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="ribbonOrange" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF5722" />
              <stop offset="100%" stopColor="#F5A623" />
            </linearGradient>
            <radialGradient id="sunFinish" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#FDE68A" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Golden Sunburst Backdrop */}
          <circle cx="160" cy="90" r="75" fill="url(#sunFinish)" />

          {/* Monumental Finish Line Arch */}
          <g transform="translate(75, 45)">
            {/* Left Column */}
            <rect x="0" y="20" width="16" height="95" rx="3" fill="#1E293B" stroke="#F5A623" strokeWidth="2" />
            <rect x="4" y="25" width="8" height="85" rx="2" fill="#F5A623" />
            {/* Right Column */}
            <rect x="154" y="20" width="16" height="95" rx="3" fill="#1E293B" stroke="#F5A623" strokeWidth="2" />
            <rect x="158" y="25" width="8" height="85" rx="2" fill="#F5A623" />
            {/* Overhead Truss */}
            <rect x="-8" y="5" width="186" height="24" rx="4" fill="#0F172A" stroke="#FF5722" strokeWidth="2" />
            <text x="85" y="21" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="900" letterSpacing="2" fontFamily="sans-serif">
              FINISH LINE 2027
            </text>
          </g>

          {/* Broken Finish Tape / Victory Ribbon */}
          <path d="M 60 120 Q 120 135, 148 118" stroke="url(#ribbonOrange)" strokeWidth="6" strokeLinecap="round" />
          <path d="M 172 118 Q 200 135, 260 120" stroke="url(#ribbonOrange)" strokeWidth="6" strokeLinecap="round" />

          {/* Finisher Commemorative Medal */}
          <g transform="translate(160, 118)">
            {/* Ribbon V */}
            <path d="M -12 -28 L 0 -12 L 12 -28" stroke="#FF5722" strokeWidth="5" strokeLinecap="round" />
            {/* Medal Disc */}
            <circle cx="0" cy="2" r="15" fill="url(#goldArch)" stroke="#B45309" strokeWidth="2" />
            <circle cx="0" cy="2" r="11" stroke="#FEF3C7" strokeWidth="1" strokeDasharray="3 3" />
            {/* Star */}
            <path d="M 0 -3 L 2 0 L 5 1 L 3 3 L 3 6 L 0 4 L -3 6 L -3 3 L -5 1 L -2 0 Z" fill="#FFFFFF" />
          </g>

          {/* Festive Confetti Sparks */}
          <circle cx="95" cy="30" r="3" fill="#FF5722" />
          <rect x="220" y="25" width="6" height="6" rx="1" transform="rotate(25 220 25)" fill="#F5A623" />
          <circle cx="70" cy="70" r="2.5" fill="#0284C7" />
          <rect x="245" y="65" width="5" height="5" rx="1" transform="rotate(45 245 65)" fill="#10B981" />
          <circle cx="110" cy="15" r="3" fill="#F5A623" />
          <circle cx="210" cy="18" r="3" fill="#FF7043" />
        </svg>
      );
  }
};
