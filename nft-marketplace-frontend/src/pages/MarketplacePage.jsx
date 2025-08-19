import React, { useEffect, useState } from "react";
import { useBlockchainStore } from "../store/blockchainStore";
import Loading from "../components/Loading";

function MarketplacePage() {
  const { listings, fetchListings, buyItem, isFetchingListings, userAddress } =
    useBlockchainStore();

  const [buyingItem, setBuyingItem] = useState(null);

  useEffect(() => {
    if (userAddress) {
      fetchListings();
    }
  }, [userAddress, fetchListings]);

  const handleBuy = async (id, price) => {
    try {
      setBuyingItem(id);
      await buyItem(id, price);
    } finally {
      setBuyingItem(null);
    }
  };

  if (isFetchingListings) return <Loading text="Loading listings..." />;

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto text-gray-100">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg">
          Explore the Marketplace
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Buy, sell, and collect unique NFTs minted by creators worldwide.
          Powered by Web3, owned by the community. ✨
        </p>
      </div>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {listings.length > 0 ? (
          listings.map((item) => {
            const isOwner =
              item.seller.toLowerCase() === userAddress?.toLowerCase();
            const isDisabled = isOwner || !userAddress;

            return (
              <div
                key={item.id}
                className="group relative backdrop-blur-md bg-gray-900/70 border border-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-purple-500/40 hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={item.metadata.image}
                    alt={item.metadata.name}
                    className="w-full h-64 object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                    {item.metadata.category || "NFT"}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-semibold text-indigo-300 group-hover:text-purple-400 transition-colors">
                    {item.metadata.name}
                  </h3>

                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                    {item.metadata.description ||
                      "A unique digital collectible."}
                  </p>

                  <p className="mt-3 text-gray-300 font-medium">
                    💎 Price:{" "}
                    <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent font-bold">
                      {item.price} ETH
                    </span>
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Seller:{" "}
                    <span className="font-mono text-gray-300">
                      {`${item.seller.slice(0, 6)}...${item.seller.slice(-4)}`}
                    </span>
                  </p>

                  <button
                    onClick={() => handleBuy(item.id, item.price)}
                    disabled={isDisabled || buyingItem === item.id}
                    className={`mt-5 w-full px-5 py-2 rounded-xl font-medium transition-all duration-300 shadow-md ${
                      isDisabled
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 hover:shadow-purple-500/40 text-white"
                    }`}
                  >
                    {isOwner
                      ? "Your Listing"
                      : buyingItem === item.id
                      ? "⏳ Buying..."
                      : "Buy NFT"}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 col-span-full text-lg">
            🚀 No NFTs are currently listed. Be the first to create one!
          </p>
        )}
      </div>
    </div>
  );
}

export default MarketplacePage;
