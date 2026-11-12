import React, { useState } from 'react';
import achievementBadgeImg from '../assets/images/math_achievement_badge_1794450742214.jpg';

interface MathBadgeIconProps {
  className?: string;
  title?: string;
}

export const MathBadgeIcon: React.FC<MathBadgeIconProps> = ({
  className = "w-full h-full",
  title = "Bậc Thầy Số Hữu Tỉ"
}) => {
  const [imgFailed, setImgFailed] = useState<boolean>(false);

  if (imgFailed) {
    return (
      <div className={`relative flex items-center justify-center bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-2xl shadow-inner p-1 ${className}`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#fef08a" />
            </linearGradient>
            <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>

          {/* Ribbon Tail */}
          <polygon points="30,70 30,95 40,86 50,95 50,70" fill="url(#ribbonGrad)" />
          <polygon points="50,70 50,95 60,86 70,95 70,70" fill="url(#ribbonGrad)" />

          {/* Outer Sunburst Circle */}
          <circle cx="50" cy="46" r="38" fill="#f59e0b" stroke="#fef08a" strokeWidth="2.5" />
          <circle cx="50" cy="46" r="32" fill="#d97706" />

          {/* Inner Golden Shield / Medallion */}
          <circle cx="50" cy="46" r="26" fill="url(#shieldGrad)" stroke="#b45309" strokeWidth="1.5" />

          {/* Q symbol for Rational numbers (Số hữu tỉ) */}
          <text
            x="50"
            y="54"
            fill="#78350f"
            fontSize="26"
            fontWeight="black"
            fontFamily="serif"
            textAnchor="middle"
          >
            ℚ
          </text>

          {/* Little Stars */}
          <text x="32" y="32" fill="#fde047" fontSize="8" textAnchor="middle">★</text>
          <text x="50" y="24" fill="#fde047" fontSize="10" textAnchor="middle">★</text>
          <text x="68" y="32" fill="#fde047" fontSize="8" textAnchor="middle">★</text>
        </svg>
      </div>
    );
  }

  return (
    <img
      src={achievementBadgeImg}
      alt={title}
      className={`object-cover ${className}`}
      onError={() => {
        setImgFailed(true);
      }}
    />
  );
};
