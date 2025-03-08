// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Certificate is ERC721 {
         uint256 public tokenId;

         constructor() ERC721("Certificate", "CERT") {}

         function mint(address to) public {
             _mint(to, tokenId);
             tokenId++;
         }
     }