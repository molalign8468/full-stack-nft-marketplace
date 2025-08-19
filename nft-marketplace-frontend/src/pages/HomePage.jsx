import React, { useEffect, useState } from "react";
import FeaturedCollection from "../components/FeaturedCollection";
import HeroSection from "../components/HeroSection";
import MintSection from "../components/MintSection";
import NFTGrid from "../components/NFTGrid";
import { useBlockchainStore } from "../store/blockchainStore";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";

function HomePage() {
  const {
    allNFTs,
    fetchAllNFTs,
    isFetchingNFTs,
    isMinting,
    userAddress,
    saleIsActive,
    fetchSaleState,
    mintNFT,
  } = useBlockchainStore();

  const [mintQuantity, setMintQuantity] = useState(1);

  useEffect(() => {
    if (userAddress) {
      fetchAllNFTs();
      fetchSaleState();
    }
  }, [userAddress, fetchAllNFTs, fetchSaleState]);

  const handleMint = () => {
    mintNFT(mintQuantity);
  };

  if (isFetchingNFTs) {
    return <Loading text="Loading NFTs..." />;
  }

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto text-gray-100">
      <HeroSection />
      <FeaturedCollection />
      <MintSection
        userAddress={userAddress}
        mintQuantity={mintQuantity}
        setMintQuantity={setMintQuantity}
        handleMint={handleMint}
        saleIsActive={saleIsActive}
        isMinting={isMinting}
      />
      <h2 className="text-3xl font-bold text-indigo-300 mb-8 text-center">
        Live Collection
      </h2>
      <NFTGrid allNFTs={allNFTs} />
    </div>
  );
}

export default HomePage;
