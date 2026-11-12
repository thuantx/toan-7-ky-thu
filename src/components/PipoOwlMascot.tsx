import React, { useState } from 'react';
import pipoOwlImg from '../assets/images/math_mascot_owl_1794450740550.jpg';

interface PipoOwlMascotProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PipoOwlMascot: React.FC<PipoOwlMascotProps> = ({ 
  className = "w-full h-full",
  size = 'md' 
}) => {
  const [imgFailed, setImgFailed] = useState<boolean>(false);

  // If external image fails to load, render this self-contained, high-fidelity SVG illustration
  if (imgFailed) {
    return (
      <div className={`relative flex items-center justify-center bg-gradient-to-br from-indigo-900 via-teal-900 to-emerald-950 ${className}`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full p-2 drop-shadow-md select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Glowing background */}
            <radialGradient id="pipoGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
            </radialGradient>
            
            {/* Owl body gradient */}
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            {/* Belly gradient */}
            <linearGradient id="bellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#fde047" />
            </linearGradient>

            {/* Gold grad */}
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            {/* Mortarboard cap */}
            <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>

          {/* Background Aura */}
          <circle cx="100" cy="105" r="85" fill="url(#pipoGlow)" />

          {/* Math ambient symbols */}
          <text x="24" y="55" fill="#a7f3d0" fontSize="16" fontFamily="monospace" fontWeight="bold" opacity="0.75">π</text>
          <text x="160" y="60" fill="#fde047" fontSize="15" fontFamily="monospace" fontWeight="bold" opacity="0.75">∑</text>
          <text x="25" y="160" fill="#bae6fd" fontSize="15" fontFamily="monospace" fontWeight="bold" opacity="0.7">√x</text>
          <text x="162" y="155" fill="#f472b6" fontSize="15" fontFamily="monospace" fontWeight="bold" opacity="0.7">∞</text>

          {/* Feet */}
          <ellipse cx="85" cy="172" rx="12" ry="6" fill="#f59e0b" />
          <ellipse cx="115" cy="172" rx="12" ry="6" fill="#f59e0b" />

          {/* Owl Wings */}
          {/* Left Wing */}
          <path d="M 52 110 C 40 125, 45 155, 65 158 C 60 140, 60 120, 68 105 Z" fill="#0369a1" />
          {/* Right Wing */}
          <path d="M 148 110 C 160 125, 155 155, 135 158 C 140 140, 140 120, 132 105 Z" fill="#0369a1" />

          {/* Main Body */}
          <ellipse cx="100" cy="118" rx="48" ry="52" fill="url(#bodyGrad)" />

          {/* Fluffy Ears / Tufts */}
          <polygon points="68,80 55,50 82,68" fill="#0284c7" />
          <polygon points="132,80 145,50 118,68" fill="#0284c7" />

          {/* Cute Belly */}
          <ellipse cx="100" cy="132" rx="32" ry="34" fill="url(#bellyGrad)" />
          {/* Belly feather marks */}
          <path d="M 90 122 Q 100 128 110 122" stroke="#ca8a04" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 86 134 Q 96 140 106 134" stroke="#ca8a04" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 94 146 Q 104 152 114 146" stroke="#ca8a04" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Big Owl Eyes Outer (White) */}
          <circle cx="80" cy="98" r="21" fill="#ffffff" stroke="#e0f2fe" strokeWidth="2" />
          <circle cx="120" cy="98" r="21" fill="#ffffff" stroke="#e0f2fe" strokeWidth="2" />

          {/* Smart Glasses Frame */}
          <circle cx="80" cy="98" r="21" fill="none" stroke="#d97706" strokeWidth="3" />
          <circle cx="120" cy="98" r="21" fill="none" stroke="#d97706" strokeWidth="3" />
          <line x1="101" y1="98" x2="99" y2="98" stroke="#d97706" strokeWidth="3" />

          {/* Irises (Deep Blue-Black) */}
          <circle cx="82" cy="98" r="12" fill="#0f172a" />
          <circle cx="118" cy="98" r="12" fill="#0f172a" />

          {/* Cute Catchlights (Sparkles in eyes) */}
          <circle cx="86" cy="94" r="4.5" fill="#ffffff" />
          <circle cx="122" cy="94" r="4.5" fill="#ffffff" />
          <circle cx="80" cy="102" r="2" fill="#ffffff" />
          <circle cx="116" cy="102" r="2" fill="#ffffff" />

          {/* Beak */}
          <polygon points="100,105 93,115 107,115" fill="#f97316" />

          {/* Mortarboard Graduation Cap (Mũ cử nhân) */}
          <g transform="translate(100, 52)">
            {/* Skull cap base */}
            <path d="M -22 10 Q 0 16 22 10 L 20 20 Q 0 25 -20 20 Z" fill="#1e293b" />
            
            {/* Flat diamond cap top */}
            <polygon points="0,-16 48,0 0,16 -48,0" fill="url(#capGrad)" stroke="#38bdf8" strokeWidth="1.5" />
            
            {/* Cap button */}
            <circle cx="0" cy="0" r="3.5" fill="#fde047" />
            
            {/* Golden Tassel */}
            <path d="M 0 0 Q 24 6 30 22" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
            <ellipse cx="31" cy="25" rx="3.5" ry="5.5" fill="#f59e0b" />
          </g>

          {/* Golden Badge on chest */}
          <circle cx="100" cy="164" r="9" fill="url(#goldGrad)" stroke="#fef08a" strokeWidth="1" />
          <text x="100" y="167.5" fill="#78350f" fontSize="9" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">★</text>
        </svg>
      </div>
    );
  }

  return (
    <img
      src={pipoOwlImg}
      alt="Linh vật Cú Pipo thông thái Toán 7"
      className={`object-cover ${className}`}
      onError={() => {
        // Fallback to high-res SVG directly on error
        setImgFailed(true);
      }}
    />
  );
};
