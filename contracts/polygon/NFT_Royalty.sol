// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;


import "./ERC721Enumerable.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract NFT_Royalty is ERC721Enumerable, Ownable {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _nextTokenId;

    address payable artist; //of the NFT or the developer of the smart contract
    uint256 public royaltyFee = 5; //5% platform fees

    string baseURI;
    string public baseExtension = ".json";
    uint256 public cost = 0.001 ether;
    uint256 public maxSupply;
    uint256 public maxMintAmount = 12;
    uint256 public timeDeployed;
    uint256 public allowMintingAfter = 0;
    bool public isPaused = false;
    bool public isRevealed = true;
    // string public notRevealedUri;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply,
        uint256 _allowMintingOn,
        string memory _initBaseURI,
        address payable _artist
    ) ERC721(_name, _symbol) {
        if (_allowMintingOn > block.timestamp) {
            allowMintingAfter = _allowMintingOn - block.timestamp;
        }

        maxSupply = _maxSupply;
        timeDeployed = block.timestamp;

        setBaseURI(_initBaseURI);
        artist  = _artist;
    }

    // internal
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function mintTo(address _to) public onlyOwner {
        uint256 currentTokenId = _nextTokenId.current();
        _nextTokenId.increment();
        _safeMint(_to, currentTokenId);
    }


    // public
    function mint(uint256 _mintAmount) public payable {
        require(
            block.timestamp >= timeDeployed + allowMintingAfter,
            "Minting now allowed yet"
        );

        // require(balanceOf(msg.sender) == 0, "Only 1 mint per account");

        uint256 supply = totalSupply();
        require(!isPaused);
        require(_mintAmount > 0);
        require(_mintAmount <= maxMintAmount);
        require(supply + _mintAmount <= maxSupply);

        if (msg.sender != owner()) {
            require(msg.value >= cost * _mintAmount);
        }

        uint256 royalty = (msg.value*royaltyFee)/100;
        _payArtist(royalty);
        _payOwner(msg.value - royalty);

        for (uint256 i = 1; i <= _mintAmount; i++) {
            _safeMint(msg.sender, supply + i);
        }
    }


function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public payable override (ERC721,IERC721) {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
    if(msg.value>0)
    {     uint256 royalty = (msg.value*royaltyFee)/100;
        _payArtist(royalty);
        _payOwner(msg.value - royalty);
        _transfer(from, to, tokenId);}
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public payable  override (ERC721,IERC721){
        safeTransferFrom(from, to, tokenId, "");
    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public payable override (ERC721,IERC721) {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
    if(msg.value>0)
    {     uint256 royalty = (msg.value*royaltyFee)/100;
        _payArtist(royalty);
        _payOwner(msg.value - royalty);
        _transfer(from, to, tokenId);
    }
    }
    function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

            string memory currentBaseURI = _baseURI();
            return string.concat(currentBaseURI,tokenId.toString(),baseExtension);
           
    }

    function getSecondsUntilMinting() public view returns (uint256) {
        if (block.timestamp < timeDeployed + allowMintingAfter) {
            return (timeDeployed + allowMintingAfter) - block.timestamp;
        } else {
            return 0;
        }
    }

    // Only Owner Functions
    function setIsRevealed(bool _state) public onlyOwner {
        isRevealed = _state;
    }

    function setCost(uint256 _newCost) public onlyOwner {
        cost = _newCost;
    }

    function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner {
        maxMintAmount = _newmaxMintAmount;
    }

    // function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
    //     notRevealedUri = _notRevealedURI;
    // }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setBaseExtension(string memory _newBaseExtension)
        public
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    function setIsPaused(bool _state) public onlyOwner {
        isPaused = _state;
    }

    function withdraw() public payable onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success);
    }

    function _payOwner(uint256 amount) internal {
        (bool success,) = payable(msg.sender).call{value:amount}("");
        require(success,"Paying royalty failed");
    }
    function _payArtist(uint256 fee) internal {
        (bool success,) = artist.call{value:fee}("");
        require(success,"Paying royalty failed");
    }
}