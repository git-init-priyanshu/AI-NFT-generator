// SPDX-License-Identifier: MIT

// Contract Address = 0xF05CdcC75b9264a5B0e3F4D53ce837Fe0327077F

pragma solidity ^0.8.0;

import  "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AI_NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("AI_NFT_Collection", "AINFT") {}

    function awardItem( string memory tokenURI)
        public
        returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        _tokenIds.increment();
        return newItemId;
    }
}