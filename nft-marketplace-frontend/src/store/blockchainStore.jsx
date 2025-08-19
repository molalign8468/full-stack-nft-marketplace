import { toast } from "react-toastify";
import { create } from "zustand";
import { ethers } from "ethers";
import {
  marketplaceAddress,
  MarketplaceABI,
  NFTCollectionABI,
  nftCollectionAddress,
  MAX_SUPPLY,
} from "../contracts/config";

const convertIpfsUrl = (url) => {
  if (url && url.startsWith("ipfs://")) {
    let path = url.replace("ipfs://", "");
    const lastPart = path.split("/").pop();

    if (/^\d+$/.test(lastPart)) {
      return `https://ipfs.io/ipfs/${path}.json`;
    }

    return `https://ipfs.io/ipfs/${path}`;
  }
  return url;
};

export const useBlockchainStore = create((set, get) => ({
  provider: null,
  signer: null,
  marketplaceContract: null,
  nftContract: null,
  userAddress: null,
  allNFTs: [],
  listings: [],
  userNFTs: [],
  contractProfile: null,
  contractOwner: null,
  saleIsActive: false,
  isLoading: false,
  error: null,

  isConnecting: false,
  isFetchingNFTs: false,
  isFetchingListings: false,
  isMinting: false,
  isListing: false,
  isBuying: false,

  connectWallet: async () => {
    set({ isConnecting: true, error: null });
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        const marketplaceContract = new ethers.Contract(
          marketplaceAddress,
          MarketplaceABI,
          signer
        );
        const nftContract = new ethers.Contract(
          nftCollectionAddress,
          NFTCollectionABI,
          signer
        );

        set({
          provider,
          signer,
          userAddress,
          marketplaceContract,
          nftContract,
        });

        await get().fetchContractProfile();
        await get().fetchAllNFTs();
        await get().fetchListings();
        await get().fetchUserNFTs();
        await get().fetchSaleState();

        window.ethereum.on("accountsChanged", (accounts) => {
          if (accounts.length === 0) {
            get().disconnectWallet();
          } else {
            get().connectWallet();
          }
        });
      } else {
        throw new Error("MetaMask not found. Please install it.");
      }
    } catch (error) {
      console.error("Connection failed:", error);
      set({ error: error.message });
    } finally {
      set({ isConnecting: false });
    }
  },

  disconnectWallet: () => {
    set({
      provider: null,
      signer: null,
      marketplaceContract: null,
      nftContract: null,
      userAddress: null,
      allNFTs: [],
      listings: [],
      userNFTs: [],
      contractProfile: null,
      contractOwner: null,
      saleIsActive: false,
      isLoading: false,
      error: null,
    });
  },

  fetchContractProfile: async () => {
    set({ isLoading: true });
    const { nftContract } = get();
    if (!nftContract) {
      set({ isLoading: false });
      return;
    }
    try {
      const name = await nftContract.name();
      const symbol = await nftContract.symbol();
      const mintedNFTs = await nftContract.getTokenIdCounter();
      const MAX_SUPPLY = await nftContract.MAX_SUPPLY();
      const salesStatus = (
        (Number(mintedNFTs) / Number(MAX_SUPPLY)) *
        100
      ).toFixed(2);
      const owner = await nftContract.owner();

      set({
        contractProfile: {
          name,
          symbol,
          mintedNFTs: mintedNFTs.toString(),
          maxSupply: MAX_SUPPLY,
          salesStatus: `${salesStatus}%`,
          address: nftCollectionAddress,
        },
        contractOwner: owner,
      });
    } catch (error) {
      console.error("Failed to fetch contract profile:", error);
      set({ error: "Failed to load contract details." });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSaleState: async () => {
    const { nftContract } = get();
    if (!nftContract) return;
    try {
      const saleState = await nftContract.saleIsActive();
      set({ saleIsActive: saleState });
    } catch (error) {
      console.error("Failed to fetch sale state:", error);
    }
  },

  flipSaleState: async () => {
    set({ isLoading: true });
    const { nftContract, userAddress, contractOwner } = get();
    if (userAddress.toLowerCase() !== contractOwner.toLowerCase()) {
      set({ error: "You are not the contract owner." });
      set({ isLoading: false });
      return;
    }
    try {
      const tx = await nftContract.flipSaleState();
      await tx.wait();
      toast.success("Sale state has been flipped!");
      get().fetchSaleState();
    } catch (error) {
      console.error("Failed to flip sale state:", error);
      set({ error: "Failed to flip sale state." });
    } finally {
      set({ isLoading: false });
    }
  },

  safeMint: async (to) => {
    console.log(to);

    set({ isLoading: true });
    const { nftContract, userAddress, contractOwner } = get();
    if (userAddress.toLowerCase() !== contractOwner.toLowerCase()) {
      set({ error: "You are not the contract owner." });
      set({ isLoading: false });
      return;
    }
    try {
      const tx = await nftContract.safeMint(to);
      await tx.wait();
      toast.success(`🎉 NFT minted to ${to}`);

      get().fetchContractProfile();
      get().fetchAllNFTs();
      get().fetchUserNFTs();
    } catch (error) {
      console.error("Failed to safe mint:", error);
      +toast.error("❌ Failed to safe mint.");
    } finally {
      set({ isLoading: false });
    }
  },

  mintNFT: async (quantity) => {
    set({ isMinting: true });
    const { nftContract } = get();
    if (!nftContract) {
      set({ error: "Wallet not connected." });
      return;
    }
    try {
      const mintPrice = await nftContract.MINT_PRICE();
      const value = mintPrice * BigInt(quantity);
      const tx = await nftContract.mintNFT(quantity, { value });

      +toast.info("⏳ Mint transaction sent, waiting for confirmation...");
      +(await tx.wait());
      +toast.success(`🎉 Successfully minted ${quantity} NFT(s)!`);

      get().fetchContractProfile();
      get().fetchAllNFTs();
      get().fetchUserNFTs();
    } catch (error) {
      console.error("Minting failed:", error);
      toast.error("❌ Minting failed. Insufficient ETH or transaction error.");
    } finally {
      set({ isMinting: false });
    }
  },

  fetchAllNFTs: async () => {
    set({ isFetchingNFTs: true });
    const { nftContract, provider } = get();
    if (!nftContract || !provider) {
      set({ isLoading: false });
      return;
    }
    try {
      const totalSupply = await nftContract.getTokenIdCounter();
      const allNFTs = [];
      for (let i = 0; i < totalSupply; i++) {
        const owner = await nftContract.ownerOf(i);
        const tokenURI = await nftContract.tokenURI(i);
        const metadataResponse = await fetch(convertIpfsUrl(tokenURI));
        const metadata = await metadataResponse.json();
        allNFTs.push({
          tokenId: i.toString(),
          owner,
          metadata: {
            ...metadata,
            image: convertIpfsUrl(metadata.image),
          },
        });
      }
      set({ allNFTs });
    } catch (error) {
      console.error("Failed to fetch all NFTs:", error);
      set({ error: "Failed to load all NFTs." });
    } finally {
      set({ isFetchingNFTs: false });
    }
  },

  fetchListings: async () => {
    set({ isFetchingListings: true });
    const { marketplaceContract, provider } = get();
    if (!marketplaceContract || !provider) {
      set({ isLoading: false });
      return;
    }
    try {
      const listingCounter = await marketplaceContract.getListingIdCounter();
      const listings = [];
      for (let i = 1; i < listingCounter; i++) {
        const listing = await marketplaceContract.listings(i);
        if (listing.active) {
          const nftContract = new ethers.Contract(
            listing.nftContract,
            NFTCollectionABI,
            provider
          );
          const tokenURI = await nftContract.tokenURI(listing.tokenId);
          const metadataResponse = await fetch(convertIpfsUrl(tokenURI));
          const metadata = await metadataResponse.json();
          listings.push({
            id: i,
            seller: listing.seller,
            price: ethers.formatEther(listing.price),
            nftContract: listing.nftContract,
            tokenId: listing.tokenId,
            active: listing.active,
            metadata: {
              ...metadata,
              image: convertIpfsUrl(metadata.image),
            },
          });
        }
      }
      set({ listings });
    } catch (error) {
      console.error("Failed to fetch listings:", error);
      set({ error: "Failed to load listings." });
    } finally {
      set({ isFetchingListings: false });
    }
  },

  fetchUserNFTs: async () => {
    const { userAddress, nftContract, provider } = get();
    if (!userAddress || !nftContract || !provider) {
      return;
    }
    set({ isLoading: true });
    try {
      const totalSupply = await nftContract.getTokenIdCounter();
      const userNFTs = [];
      for (let i = 0; i < totalSupply; i++) {
        const owner = await nftContract.ownerOf(i);
        if (owner.toLowerCase() === userAddress.toLowerCase()) {
          const tokenURI = await nftContract.tokenURI(i);
          const metadataResponse = await fetch(convertIpfsUrl(tokenURI));
          const metadata = await metadataResponse.json();
          userNFTs.push({
            tokenId: i.toString(),
            metadata: {
              ...metadata,
              image: convertIpfsUrl(metadata.image),
            },
          });
        }
      }
      set({ userNFTs });
    } catch (error) {
      console.error("Failed to fetch user's NFTs:", error);
      set({ error: "Failed to load your NFTs." });
    } finally {
      set({ isLoading: false });
    }
  },

  buyItem: async (listingId, price) => {
    set({ isBuying: true, error: null });
    const { marketplaceContract } = get();
    if (!marketplaceContract) {
      set({ error: "Wallet not connected." });
      return;
    }
    try {
      const tx = await marketplaceContract.buyItem(listingId, {
        value: ethers.parseEther(price),
      });
      await tx.wait();
      toast.success("💸 Purchase successful!");
      get().fetchListings();
      get().fetchUserNFTs();
      get().fetchAllNFTs();
    } catch (error) {
      console.error("Failed to buy item:", error);
      toast.error(
        "❌ Purchase failed.. Insufficient ETH or transaction error."
      );
    } finally {
      set({ isBuying: false });
    }
  },

  listNFT: async (tokenId, price) => {
    set({ isListing: true, error: null });
    const { marketplaceContract, nftContract, signer } = get();
    if (!marketplaceContract || !nftContract) {
      set({ error: "Wallet not connected." });
      return;
    }
    try {
      const approvedAddress = await nftContract.getApproved(tokenId);
      if (approvedAddress.toLowerCase() !== marketplaceAddress.toLowerCase()) {
        toast.info("⏳ Approving marketplace to transfer your NFT...");
        const approvalTx = await nftContract.approve(
          marketplaceAddress,
          tokenId
        );
        await approvalTx.wait();
        toast.info("⏳ Approval successful! Now listing your NFT...");
      }
      const tx = await marketplaceContract.listItem(
        nftCollectionAddress,
        tokenId,
        ethers.parseEther(price)
      );
      await tx.wait();
      toast.success("✅ NFT listed successfully!");
      get().fetchListings();
      get().fetchUserNFTs();
      get().fetchAllNFTs();
    } catch (error) {
      console.error("Failed to list NFT:", error);
      toast.error("❌ Failed to list NFT or transaction error.");
    } finally {
      set({ isListing: false });
    }
  },

  cancelListing: async (listingId) => {
    set({ isLoading: true, error: null });
    const { marketplaceContract } = get();
    if (!marketplaceContract) {
      set({ error: "Wallet not connected." });
      return;
    }
    try {
      const tx = await marketplaceContract.cancelListing(listingId);
      await tx.wait();
      toast.success("✅ Listing canceled successfully!");
      get().fetchListings();
      get().fetchUserNFTs();
      get().fetchAllNFTs();
    } catch (error) {
      console.error("Failed to cancel listing:", error);
      set({ error: "Failed to cancel listing." });
    } finally {
      set({ isLoading: false });
    }
  },

  withdraw: async () => {
    set({ isLoading: true, error: null });
    const { nftContract, userAddress, contractOwner } = get();
    if (!nftContract) {
      set({ error: "Wallet not connected." });
      return;
    }
    if (userAddress.toLowerCase() !== contractOwner.toLowerCase()) {
      set({ error: "You are not the contract owner." });
      set({ isLoading: false });
      return;
    }
    try {
      const tx = await nftContract.withdraw();
      await tx.wait();
      toast.success("🏦 Withdrawal successful!");
    } catch (error) {
      console.error("Withdrawal failed:", error);
      toast.error("❌ Withdrawal failed.");
    } finally {
      set({ isLoading: false });
    }
  },
}));
