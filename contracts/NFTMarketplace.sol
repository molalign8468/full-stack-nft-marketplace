// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is Ownable {
    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool active;
    }

    // Marketplace fee (2.5%)
    uint256 public marketplaceFeePercentage = 250; 
    address public feeRecipient;

    uint256 private _listingIdCounter;
    mapping(uint256 => Listing) public listings;

    event ListingCreated(
        uint256 indexed listingId,
        address indexed seller,
        address indexed nftContract,
        uint256 tokenId,
        uint256 price
    );
    
    event ListingCancelled(uint256 indexed listingId);
    event ItemSold(
        uint256 indexed listingId,
        address indexed buyer,
        address indexed seller,
        uint256 price
    );

    constructor() Ownable(msg.sender) {
        feeRecipient = msg.sender;
        _listingIdCounter = 1;
    }

    function listItem(
    address nftContract,
    uint256 tokenId,
    uint256 price
) external {
    require(price > 0, "Price must be > 0");
    require(
        IERC721(nftContract).ownerOf(tokenId) == msg.sender,
        "Not token owner"
    );
    require(
        IERC721(nftContract).isApprovedForAll(msg.sender, address(this)) ||
        IERC721(nftContract).getApproved(tokenId) == address(this),
        "Marketplace not approved"
    );

    uint256 listingId = _listingIdCounter++;
    listings[listingId] = Listing({
        seller: msg.sender,
        nftContract: nftContract,
        tokenId: tokenId,
        price: price,
        active: true
    });

    emit ListingCreated(listingId, msg.sender, nftContract, tokenId, price);
}
function buyItem(uint256 listingId) external payable {
    Listing storage listing = listings[listingId];
    require(listing.active, "Listing inactive");
    require(msg.value == listing.price, "Incorrect ETH amount");

    // Calculate fees
    uint256 feeAmount = (msg.value * marketplaceFeePercentage) / 10000;
    uint256 sellerProceeds = msg.value - feeAmount;

    // Transfer NFT
    IERC721(listing.nftContract).safeTransferFrom(
        listing.seller,
        msg.sender,
        listing.tokenId
    );

    // Transfer funds
    (bool feeSuccess, ) = feeRecipient.call{value: feeAmount}("");
    (bool sellerSuccess, ) = listing.seller.call{value: sellerProceeds}("");
    require(feeSuccess && sellerSuccess, "Transfer failed");

    listing.active = false;

    emit ItemSold(listingId, msg.sender, listing.seller, listing.price);
}
function cancelListing(uint256 listingId) external {
    Listing storage listing = listings[listingId];
    require(listing.active, "Listing inactive");
    require(listing.seller == msg.sender, "Not seller");
    
    listing.active = false;
    emit ListingCancelled(listingId);
}
function setMarketplaceFee(uint256 newFee) external onlyOwner {
    require(newFee <= 1000, "Fee too high"); 
    marketplaceFeePercentage = newFee;
}

function setFeeRecipient(address newRecipient) external onlyOwner {
    require(newRecipient != address(0), "Invalid address");
    feeRecipient = newRecipient;
}
 function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
}