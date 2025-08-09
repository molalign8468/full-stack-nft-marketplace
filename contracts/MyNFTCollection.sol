// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;



import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract MyNFTCollection is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    uint256 public constant MAX_SUPPLY = 1000;
    uint256 public constant MINT_PRICE = 0.01 ether;
    uint256 public constant MAX_MINT_AMOUNT_PER_TX = 5;
    bool public saleIsActive = false;

    constructor() ERC721("LoyaltyPoint", "LP") Ownable(msg.sender) {
        _tokenIdCounter = 0; 
    }
    

    function flipSaleState() public onlyOwner {
        saleIsActive = !saleIsActive;
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        require(_tokenIdCounter < MAX_SUPPLY, "Max supply reached");
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++; 
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function mintNFT(uint256 quantity) public payable {
        require(saleIsActive, "Sale inactive");
        require(quantity <= MAX_MINT_AMOUNT_PER_TX, "Exceeds max per TX");
        require(msg.value == MINT_PRICE * quantity, "Incorrect ETH value");
        require(_tokenIdCounter + quantity <= MAX_SUPPLY, "Exceeds max supply");

        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _tokenIdCounter;
            _tokenIdCounter++; 
            _safeMint(msg.sender, tokenId);
        }
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        if (balance > 0) {
            (bool success, ) = payable(owner()).call{value: balance}("");
            require(success, "Withdrawal failed");
        }
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}