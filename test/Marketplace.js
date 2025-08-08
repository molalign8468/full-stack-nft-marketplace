const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", function () {
  let nft, marketplace;
  let owner, seller, buyer;

  beforeEach(async function () {
    [owner, seller, buyer] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("MyNFTCollection");
    nft = await NFT.deploy();
    await nft.waitForDeployment();

    const Marketplace = await ethers.getContractFactory("NFTMarketplace");
    marketplace = await Marketplace.deploy();
    await marketplace.waitForDeployment();

    await nft.flipSaleState();
    await nft.connect(seller).mintNFT(1, { value: ethers.parseEther("0.01") });
  });

  it("Should list an NFT", async function () {
    await nft.connect(seller).setApprovalForAll(marketplace.target, true);

    await marketplace
      .connect(seller)
      .listItem(nft.target, 0, ethers.parseEther("1"));
    const listing = await marketplace.listings(1);

    expect(listing.active).to.be.true;
    expect(listing.price).to.equal(ethers.parseEther("1"));
  });

  it("Should buy an NFT", async function () {
    await nft.connect(seller).setApprovalForAll(marketplace.target, true);
    await marketplace
      .connect(seller)
      .listItem(nft.target, 0, ethers.parseEther("1"));

    const initialSellerBalance = await ethers.provider.getBalance(
      seller.address
    );
    await expect(
      marketplace.connect(buyer).buyItem(1, { value: ethers.parseEther("1") })
    ).to.emit(marketplace, "ItemSold");

    expect(await nft.ownerOf(0)).to.equal(buyer.address);

    const newSellerBalance = await ethers.provider.getBalance(seller.address);
    expect(newSellerBalance).to.be.gt(initialSellerBalance);
  });

  it("Should cancel a listing", async function () {
    await nft.connect(seller).setApprovalForAll(marketplace.target, true);
    await marketplace
      .connect(seller)
      .listItem(nft.target, 0, ethers.parseEther("1"));

    await expect(marketplace.connect(seller).cancelListing(1)).to.emit(
      marketplace,
      "ListingCancelled"
    );

    const listing = await marketplace.listings(1);
    expect(listing.active).to.be.false;
  });
});
