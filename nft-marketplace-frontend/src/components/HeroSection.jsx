import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Star, Rocket } from "lucide-react";

const NFTBadgeSVG = ({ className = "" }) => (
  <svg
    viewBox="0 0 512 512"
    className={className}
    role="img"
    aria-label="NFT Badge"
    fill="none"
  >
    <defs>
      <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
      <radialGradient id="g2" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </radialGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow
          dx="0"
          dy="0"
          stdDeviation="12"
          floodColor="#8b5cf6"
          floodOpacity="0.6"
        />
      </filter>
    </defs>

    <g filter="url(#glow)">
      <path
        d="M256 32l171 98v196L256 424 85 326V130z"
        fill="url(#g1)"
        opacity="0.95"
      />
      <path
        d="M256 32l171 98v196L256 424 85 326V130z"
        stroke="white"
        strokeOpacity="0.35"
        strokeWidth="2"
      />
      <ellipse cx="256" cy="200" rx="160" ry="120" fill="url(#g2)" />
    </g>

    <circle
      cx="256"
      cy="256"
      r="120"
      stroke="white"
      strokeOpacity="0.25"
      strokeWidth="2"
    />
    <circle
      cx="256"
      cy="256"
      r="90"
      stroke="white"
      strokeOpacity="0.18"
      strokeDasharray="6 10"
      strokeWidth="2"
    />

    <text
      x="50%"
      y="55%"
      textAnchor="middle"
      fontSize="96"
      fontWeight="800"
      fill="white"
      style={{ letterSpacing: "4px" }}
    ></text>
  </svg>
);

const HeroSection = ({ imageUrl }) => {
  const [useFallback, setUseFallback] = useState(!imageUrl);

  return (
    <section className="relative grid grid-cols-1 md:grid-cols-2 items-center gap-12 mb-24 overflow-hidden rounded-2xl">
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-700 rounded-full blur-3xl opacity-20 animate-pulse pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-indigo-700 rounded-full blur-3xl opacity-20 animate-pulse pointer-events-none" />

      <div className="relative text-center md:text-left z-10 p-4">
        <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-indigo-400 to-purple-600 text-transparent bg-clip-text drop-shadow-lg leading-tight">
          The Next Generation of Digital <br /> Collectibles
        </h1>
        <p className="text-lg text-gray-300 max-w-xl mb-8">
          <Sparkles className="inline-block w-6 h-6 text-yellow-400 mr-2 animate-bounce" />
          Discover, mint, and collect exclusive NFTs in our decentralized
          marketplace. <br />
          <Star className="inline-block w-5 h-5 text-pink-400 animate-[spin_8s_linear_infinite]" />
          Powered by Web3, owned by the community.
        </p>
        <Link
          to="/marketplace"
          className="inline-block px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-xl hover:scale-110 transition-transform"
        >
          🚀 Explore Marketplace
        </Link>
      </div>

      <div className="relative flex justify-center z-10 p-4">
        <div className="relative">
          {useFallback ? (
            <NFTBadgeSVG className="w-[420px] h-[420px] opacity-95 drop-shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:scale-105 transition-transform duration-500" />
          ) : (
            <img
              src={imageUrl}
              alt="MetaGallery Showcase"
              onError={() => setUseFallback(true)}
              className="w-[420px] h-[420px] object-contain opacity-90 drop-shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:scale-105 transition-transform duration-500"
            />
          )}

          <Rocket className="absolute -top-6 -left-6 w-12 h-12 text-pink-400 animate-bounce" />
          <Star className="absolute -bottom-6 -right-6 w-12 h-12 text-yellow-400 animate-pulse" />
          <Sparkles className="absolute -top-10 right-10 w-12 h-12 text-indigo-300 animate-[spin_10s_linear_infinite]" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
