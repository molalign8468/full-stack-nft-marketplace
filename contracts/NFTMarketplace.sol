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

    
}