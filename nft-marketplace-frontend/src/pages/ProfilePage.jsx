import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Loading from "../components/Loading";
import { useBlockchainStore } from "../store/blockchainStore";
import image from "../assets/55.jpg";

function ProfilePage() {
  const {
    contractProfile,
    fetchContractProfile,
    isLoading,
    userAddress,
    contractOwner,
    flipSaleState,
    safeMint,
    withdraw,
    saleIsActive,
    fetchSaleState,
  } = useBlockchainStore();

  const [mintToAddress, setMintToAddress] = useState("");

  useEffect(() => {
    if (userAddress) {
      fetchContractProfile();
      fetchSaleState();
    }
  }, [userAddress, fetchContractProfile, fetchSaleState]);

  const isContractOwner =
    userAddress?.toLowerCase() === contractOwner?.toLowerCase();

  const handleMint = (e) => {
    e.preventDefault();
    if (!ethers.isAddress(mintToAddress)) {
      alert("Invalid Ethereum address.");
      return;
    }
    console.log(mintToAddress);

    safeMint(mintToAddress);
    setMintToAddress("");
  };

  if (isLoading) return <Loading text="Loading contract dashboard..." />;

  if (!userAddress) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400 text-lg">
        Please connect your wallet to view contract information.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black px-6 py-12">
      <div className="max-w-6xl mx-auto text-gray-100">
        <div className="flex flex-col items-center mb-16">
          <img
            src={image}
            alt="Contract Avatar"
            className="w-40 h-40 rounded-full ring-4 ring-cyan-400/60 shadow-[0_0_40px_rgba(34,211,238,0.6)] mb-6 hover:scale-105 transition-all duration-300"
          />
          <h2 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 text-transparent bg-clip-text drop-shadow-lg">
            NFT Contract Dashboard
          </h2>
          <p className="text-gray-400 mt-3">
            Monitor • Manage • Interact with your smart contract
          </p>
        </div>

        {contractProfile && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
            {[
              { label: "Name", value: contractProfile.name },
              { label: "Symbol", value: contractProfile.symbol },
              {
                label: "Minted",
                value: (
                  <span className="text-cyan-300 font-extrabold">
                    {contractProfile.mintedNFTs}
                  </span>
                ),
              },
              {
                label: "Max Supply",
                value: (
                  <span className="text-emerald-300 font-extrabold">
                    {contractProfile.maxSupply}
                  </span>
                ),
              },
              { label: "Sale Status", value: contractProfile.salesStatus },
              {
                label: "Sale Active",
                value: saleIsActive ? (
                  <span className="text-emerald-400">Yes ✅</span>
                ) : (
                  <span className="text-rose-400">No ❌</span>
                ),
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="backdrop-blur-xl bg-slate-900/70 border border-slate-800 rounded-2xl p-6 text-center shadow-lg hover:shadow-cyan-500/40 hover:-translate-y-1 transition-all duration-300"
              >
                <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-2">
                  {stat.label}
                </h4>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {contractProfile && (
          <div className="mb-16 backdrop-blur-xl bg-slate-900/70 border border-slate-800 rounded-2xl shadow-lg p-8 hover:shadow-purple-500/40 transition-all duration-300">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-6">
              📜 Contract Information
            </h3>
            <p className="mb-3">
              <span className="font-semibold text-cyan-300">Address:</span>{" "}
              <span className="font-mono text-gray-400">
                {contractProfile.address}
              </span>
            </p>
            <p>
              <span className="font-semibold text-cyan-300">Owner:</span>{" "}
              <span className="font-mono text-gray-400">{contractOwner}</span>
            </p>
          </div>
        )}

        {isContractOwner && (
          <div className="backdrop-blur-xl bg-slate-900/70 border border-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-emerald-500/40 transition-all duration-300">
            <h3 className="text-2xl font-semibold text-emerald-300 mb-8">
              🔑 Owner Actions
            </h3>

            <div className="flex flex-wrap gap-4 mb-10">
              <button
                onClick={flipSaleState}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-500 text-white font-semibold hover:scale-105 hover:shadow-cyan-500/50 transition-all duration-300"
              >
                Flip Sale State
              </button>
              <button
                onClick={withdraw}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white font-semibold hover:scale-105 hover:shadow-rose-500/50 transition-all duration-300"
              >
                Withdraw Funds
              </button>
            </div>

            <form onSubmit={handleMint} className="space-y-4">
              <h4 className="font-semibold text-cyan-300">Mint a new NFT</h4>
              <input
                type="text"
                placeholder="Recipient Address"
                value={mintToAddress}
                onChange={(e) => setMintToAddress(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:ring-2 focus:ring-cyan-400 placeholder-gray-500 text-gray-200"
              />
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:scale-105 hover:shadow-emerald-500/50 transition-all duration-300"
              >
                Safe Mint
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
