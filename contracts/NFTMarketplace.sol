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

}