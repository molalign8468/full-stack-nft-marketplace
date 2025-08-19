import React, { useState, useEffect } from "react";
import { useBlockchainStore } from "../store/blockchainStore";
import Loading from "../components/Loading";

function MyNFTsPage() {
  const {
    userNFTs,
    fetchUserNFTs,
    listNFT,
    cancelListing,
    listings,
    isFetchingNFTs,
    userAddress,
  } = useBlockchainStore();

  const [listingPrice, setListingPrice] = useState({});
  const [loadingAction, setLoadingAction] = useState({});

  useEffect(() => {
    if (userAddress) {
      fetchUserNFTs();
    }
  }, [userAddress, fetchUserNFTs]);

  const handleListClick = async (tokenId) => {
    const price = listingPrice[tokenId];
    if (!price) {
      alert("Please enter a price.");
      return;
    }

    try {
      setLoadingAction((prev) => ({ ...prev, [tokenId]: "listing" }));
      await listNFT(tokenId, price);
      setListingPrice((prev) => ({ ...prev, [tokenId]: "" }));
    } finally {
      setLoadingAction((prev) => ({ ...prev, [tokenId]: null }));
    }
  };

  const handleCancelClick = async (tokenId) => {
    const listingId = listings.find(
      (l) => l.tokenId.toString() === tokenId && l.active
    )?.id;

    if (!listingId) return;

    try {
      setLoadingAction((prev) => ({ ...prev, [tokenId]: "canceling" }));
      await cancelListing(listingId);
    } finally {
      setLoadingAction((prev) => ({ ...prev, [tokenId]: null }));
    }
  };

  const getIsListed = (tokenId) => {
    return listings.some(
      (listing) => listing.tokenId.toString() === tokenId && listing.active
    );
  };

  if (isFetchingNFTs) return <Loading text="Loading your NFTs..." />;

  if (!userAddress) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400 text-lg">
        Please connect your wallet to view and list NFTs.
      </div>
    );
  }

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto text-gray-100">
      <h2 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text drop-shadow-lg">
        My NFTs
      </h2>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {userNFTs.length > 0 ? (
          userNFTs.map((nft) => (
            <div
              key={nft.tokenId}
              className="backdrop-blur-md bg-gray-900/70 border border-gray-800 rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-purple-500/30 hover:scale-105"
            >
              <img
                src={nft.metadata.image}
                alt={nft.metadata.name}
                className="w-full h-64 object-cover border-b border-gray-800"
              />

              <div className="p-5">
                <h3 className="text-xl font-semibold text-indigo-300">
                  {nft.metadata.name}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Token ID:{" "}
                  <span className="font-mono text-gray-300">{nft.tokenId}</span>
                </p>

                {getIsListed(nft.tokenId) ? (
                  <>
                    <p className="text-green-400 font-medium mt-3">
                      ✅ Listed for Sale
                    </p>
                    <button
                      onClick={() => handleCancelClick(nft.tokenId)}
                      disabled={loadingAction[nft.tokenId] === "canceling"}
                      className={`mt-4 w-full px-4 py-2 rounded-xl font-medium text-white transition-all duration-300 ${
                        loadingAction[nft.tokenId] === "canceling"
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-red-500 to-pink-600 hover:scale-105 hover:shadow-red-500/40"
                      }`}
                    >
                      {loadingAction[nft.tokenId] === "canceling"
                        ? "⏳ Canceling..."
                        : "Cancel Listing"}
                    </button>
                  </>
                ) : (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 shadow-inner">
                      <span className="text-gray-400 text-sm mr-2">ETH</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Enter price"
                        value={listingPrice[nft.tokenId] || ""}
                        onChange={(e) =>
                          setListingPrice((prev) => ({
                            ...prev,
                            [nft.tokenId]: e.target.value,
                          }))
                        }
                        className="flex-1 bg-transparent outline-none text-sm text-gray-200 placeholder-gray-500"
                      />
                    </div>
                    <button
                      onClick={() => handleListClick(nft.tokenId)}
                      disabled={loadingAction[nft.tokenId] === "listing"}
                      className={`w-full px-4 py-2 rounded-xl font-medium text-white transition-all duration-300 ${
                        loadingAction[nft.tokenId] === "listing"
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-105 hover:shadow-purple-500/40"
                      }`}
                    >
                      {loadingAction[nft.tokenId] === "listing"
                        ? "⏳ Listing..."
                        : "List NFT"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            You don’t own any NFTs in this collection.
          </p>
        )}
      </div>
    </div>
  );
}

export default MyNFTsPage;
