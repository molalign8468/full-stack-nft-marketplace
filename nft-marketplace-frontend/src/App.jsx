import { ToastContainer } from "react-toastify";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import MarketplacePage from "./pages/MarketplacePage";
import MyNFTsPage from "./pages/MyNFTsPage";
import ProfilePage from "./pages/ProfilePage";
import { useBlockchainStore } from "./store/blockchainStore";

function App() {
  const { error } = useBlockchainStore();

  return (
    <Router>
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>

        <Navbar />
        <ToastContainer position="top-right" autoClose={4000} />

        <main className="flex-1 container mx-auto px-6 py-10 text-gray-100 relative z-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/my-nfts" element={<MyNFTsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
