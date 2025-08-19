import React from "react";
import { Sparkles, Coins } from "lucide-react";

function MintSection({
  userAddress,
  mintQuantity,
  setMintQuantity,
  handleMint,
  saleIsActive,
  isMinting,
}) {
  return (
    <div className="relative backdrop-blur-xl bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 border border-gray-700/50 rounded-3xl p-10 mb-16 text-center shadow-2xl overflow-hidden">
      <Sparkles
        className="absolute top-6 left-6 text-indigo-500 opacity-60 animate-pulse"
        size={28}
      />
      <Sparkles
        className="absolute bottom-6 right-6 text-purple-500 opacity-60 animate-pulse"
        size={28}
      />

      <h3 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
        Public Mint is Live!
      </h3>
      <p className="text-gray-300 mb-8 max-w-xl mx-auto leading-relaxed">
        Mint your exclusive{" "}
        <span className="text-indigo-400 font-semibold">LoyaltyPoint NFT</span>{" "}
        today. Supply is limited, each NFT comes with unique artwork and utility
        inside the LoyaltyPoint ecosystem. Don’t miss your chance to be part of
        the community!
      </p>

      {userAddress ? (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
          <div className="flex items-center bg-gray-800/70 border border-gray-700 rounded-xl px-3 py-2">
            <Coins className="text-indigo-400 mr-2" size={20} />
            <input
              type="number"
              min="1"
              max="5"
              value={mintQuantity}
              onChange={(e) => setMintQuantity(Number(e.target.value))}
              className="w-20 bg-transparent text-center text-white focus:outline-none focus:ring-0"
            />
          </div>
          <button
            onClick={handleMint}
            disabled={!saleIsActive || isMinting}
            className={`px-8 py-3 rounded-2xl font-bold tracking-wide transition-all duration-300 shadow-xl ${
              !saleIsActive || isMinting
                ? "bg-gray-600 cursor-not-allowed text-gray-300"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 hover:shadow-purple-500/50 text-white"
            }`}
          >
            {isMinting
              ? "⏳ Minting..."
              : saleIsActive
              ? "🚀 Mint NFT"
              : "❌ Sale Inactive"}
          </button>
        </div>
      ) : (
        <p className="text-gray-400 text-lg font-medium mt-6">
          🔗 Connect your wallet to start minting.
        </p>
      )}

      <div className="mt-10 text-sm text-gray-400">
        <p>
          Max per wallet: <span className="text-indigo-400">5 NFTs</span> |
          Price: <span className="text-purple-400">0.01 ETH</span>
        </p>
      </div>
    </div>
  );
}

export default MintSection;
