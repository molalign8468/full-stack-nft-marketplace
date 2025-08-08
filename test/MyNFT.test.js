const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFTCollection", function () {
  let MyNFTCollection;
  let nftCollection;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    MyNFTCollection = await ethers.getContractFactory("MyNFTCollection");
    nftCollection = await MyNFTCollection.deploy();
    await nftCollection.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await nftCollection.name()).to.equal("LoyaltyPoint");
      expect(await nftCollection.symbol()).to.equal("LP");
    });

    it("Should assign the owner role to the deployer", async function () {
      expect(await nftCollection.owner()).to.equal(owner.address);
    });

    it("Should have the sale inactive", async function () {
      expect(await nftCollection.saleIsActive()).to.equal(false);
    });
  });

  describe("Admin Functions (Owner Only)", function () {
    it("Should allow the owner to flip the sale state", async function () {
      await nftCollection.connect(owner).flipSaleState();
      expect(await nftCollection.saleIsActive()).to.equal(true);

      await nftCollection.connect(owner).flipSaleState();
      expect(await nftCollection.saleIsActive()).to.equal(false);
    });

    it("Should allow the owner to safeMint an NFT", async function () {
      const initialBalance = await nftCollection.balanceOf(addr1.address);
      expect(initialBalance).to.equal(0);

      const uri = "ipfs://testuri";
      await nftCollection.connect(owner).safeMint(addr1.address, uri);

      expect(await nftCollection.balanceOf(addr1.address)).to.equal(1);
      expect(await nftCollection.ownerOf(0)).to.equal(addr1.address);
      expect(await nftCollection.tokenURI(0)).to.equal(uri);
    });
  });

  describe("Public Minting", function () {
    it("Should revert if the sale is not active", async function () {
      await expect(
        nftCollection.connect(addr1).mintNFT(1, {
          value: ethers.parseEther("0.01"),
        })
      ).to.be.revertedWith("Sale inactive");
    });

    it("Should revert if the user tries to mint more than the max amount per transaction", async function () {
      await nftCollection.connect(owner).flipSaleState();
      await expect(
        nftCollection.connect(addr1).mintNFT(6, {
          value: ethers.parseEther("0.06"),
        })
      ).to.be.revertedWith("Exceeds max per TX");
    });

    it("Should revert with an incorrect ETH value", async function () {
      await nftCollection.connect(owner).flipSaleState();
      await expect(
        nftCollection.connect(addr1).mintNFT(2, {
          value: ethers.parseEther("0.01"),
        })
      ).to.be.revertedWith("Incorrect ETH value");
    });

    it("Should revert if minting exceeds the maximum supply", async function () {
      const uri = "ipfs://testuri";
      for (let i = 0; i < 999; i++) {
        await nftCollection.connect(owner).safeMint(owner.address, uri);
      }
      await nftCollection.connect(owner).flipSaleState();

      await expect(
        nftCollection.connect(addr1).mintNFT(2, {
          value: ethers.parseEther("0.02"),
        })
      ).to.be.revertedWith("Exceeds max supply");
    });
  });

  describe("Withdrawals", function () {
    it("Should allow the owner to withdraw funds", async function () {
      await nftCollection.connect(owner).flipSaleState();
      const quantity = 2;
      const mintValue = ethers.parseEther("0.02");
      await nftCollection
        .connect(addr1)
        .mintNFT(quantity, { value: mintValue });

      expect(await ethers.provider.getBalance(nftCollection.target)).to.equal(
        mintValue
      );

      await expect(
        nftCollection.connect(owner).withdraw()
      ).to.changeEtherBalance(owner, mintValue);

      expect(await ethers.provider.getBalance(nftCollection.target)).to.equal(
        0
      );
    });
  });

  describe("URI and Interface Support", function () {
    it("Should return the correct token URI", async function () {
      const uri = "ipfs://testuri";
      await nftCollection.connect(owner).safeMint(owner.address, uri);
      expect(await nftCollection.tokenURI(0)).to.equal(uri);
    });

    it("Should support the ERC721 interface", async function () {
      const erc721InterfaceId = "0x80ac58cd";
      expect(await nftCollection.supportsInterface(erc721InterfaceId)).to.equal(
        true
      );
    });

    it("Should not support a random interface", async function () {
      const randomInterfaceId = "0x12345678";
      expect(await nftCollection.supportsInterface(randomInterfaceId)).to.equal(
        false
      );
    });
  });
});
