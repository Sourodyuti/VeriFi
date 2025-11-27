// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Certificate is ERC721URIStorage {
    uint256 public tokenId;

    constructor() ERC721("Certificate", "CERT") {}

    // Mint and set tokenURI (metadata pointer, e.g., ipfs://...)
    function mint(address to, string memory _tokenURI) public {
        _mint(to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        tokenId++;
    }
}