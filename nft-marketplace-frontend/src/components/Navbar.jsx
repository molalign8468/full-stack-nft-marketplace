import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useBlockchainStore } from "../store/blockchainStore";
import logo from "../assets/logo.png";

function Navbar() {
  const { connectWallet, userAddress, isConnecting } = useBlockchainStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="backdrop-blur-md bg-gray-900/80 border-b border-gray-800 px-6 py-4 sticky top-0 z-50 shadow-lg">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="NFT Market Logo"
            className="w-10 h-10 object-contain rounded-lg"
          />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 font-extrabold text-xl tracking-wide">
            NFT Market
          </span>
        </Link>

        <div className="hidden md:flex gap-6">
          <Link
            to="/"
            className="text-gray-300 hover:text-indigo-400 font-medium transition"
          >
            Home
          </Link>
          <Link
            to="/marketplace"
            className="text-gray-300 hover:text-indigo-400 font-medium transition"
          >
            Marketplace
          </Link>
          <Link
            to="/my-nfts"
            className="text-gray-300 hover:text-indigo-400 font-medium transition"
          >
            My NFTs
          </Link>
          <Link
            to="/profile"
            className="text-gray-300 hover:text-indigo-400 font-medium transition"
          >
            Profile
          </Link>
        </div>

        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className={`hidden md:block px-5 py-2 rounded-xl font-medium text-white shadow-lg transition-all duration-300
            ${
              isConnecting
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 hover:shadow-purple-500/50"
            }`}
        >
          {isConnecting
            ? "Connecting..."
            : userAddress
            ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`
            : "Connect Wallet"}
        </button>

        <button
          className="md:hidden text-gray-300 hover:text-indigo-400 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 bg-gray-900/90 border border-gray-800 rounded-xl p-4 animate-slideDown">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-gray-300 hover:text-indigo-400 font-medium transition"
          >
            Home
          </Link>
          <Link
            to="/marketplace"
            onClick={() => setMenuOpen(false)}
            className="text-gray-300 hover:text-indigo-400 font-medium transition"
          >
            Marketplace
          </Link>
          <Link
            to="/my-nfts"
            onClick={() => setMenuOpen(false)}
            className="text-gray-300 hover:text-indigo-400 font-medium transition"
          >
            My NFTs
          </Link>
          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className="text-gray-300 hover:text-indigo-400 font-medium transition"
          >
            Profile
          </Link>

          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className={`px-5 py-2 rounded-xl font-medium text-white shadow-lg transition-all duration-300
              ${
                isConnecting
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 hover:shadow-purple-500/50"
              }`}
          >
            {isConnecting
              ? "Connecting..."
              : userAddress
              ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`
              : "Connect Wallet"}
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
