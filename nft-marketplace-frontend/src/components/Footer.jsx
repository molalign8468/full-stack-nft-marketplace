import React from "react";
import { Link } from "react-router-dom";
import { Github, MessageCircle, Linkedin } from "lucide-react";

const XIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
    {...props}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H17.36l-5.268-6.888-6.033 6.888H2.75l7.704-8.799L2.25 2.25h6.635l4.746 6.229 4.613-6.229z" />
  </svg>
);

function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-400 mt-20">
      <div className="absolute inset-x-0 -top-1 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
        <div>
          <h3 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            NFT Market
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-gray-400">
            A decentralized marketplace to mint, buy, and sell NFTs securely.
            Empowering creators, collectors, and the Web3 community.
          </p>
        </div>

        {/* Explore Links */}
        <div>
          <h4 className="text-gray-200 font-semibold mb-4 text-lg">Explore</h4>
          <ul className="space-y-3 text-sm">
            {[
              { label: "Home", to: "/" },
              { label: "Marketplace", to: "/marketplace" },
              { label: "My NFTs", to: "/my-nfts" },
              { label: "Profile", to: "/profile" },
            ].map((item, idx) => (
              <li key={idx}>
                <Link
                  to={item.to}
                  className="hover:text-indigo-400 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-gray-200 font-semibold mb-4 text-lg">
            Community
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="https://x.com/molalign52091"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-indigo-400 transition-colors duration-200"
              >
                <XIcon /> X
              </a>
            </li>
            <li>
              <a
                href="https://discord.com/molalign_38036"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-indigo-400 transition-colors duration-200"
              >
                <MessageCircle size={18} /> Discord
              </a>
            </li>
            <li>
              <a
                href="https://github.com/molalign8468"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-indigo-400 transition-colors duration-200"
              >
                <Github size={18} /> GitHub
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/molalign-getahun-6a995131b/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-indigo-400 transition-colors duration-200"
              >
                <Linkedin size={18} /> LinkedIn
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-gray-200 font-semibold mb-4 text-lg">Legal</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="#" className="hover:text-indigo-400 transition-colors">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-400 transition-colors">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 text-center text-sm py-6 text-gray-500">
        © {new Date().getFullYear()}{" "}
        <span className="text-indigo-400 font-semibold">NFT Market</span>. All
        rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
