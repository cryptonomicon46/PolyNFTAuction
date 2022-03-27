// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



contract DutchAuction is Ownable {

    
    address payable public immutable seller;
    IERC721 nftCollection;
    uint public immutable nftId;


    uint public  endAt;
    uint public immutable startedAt;
    uint public constant oneDayToSecs = 86400;
    uint public constant startPrice = 5 ether;
    uint public constant finalEndPrice = 0.5 ether;
    uint public constant totalPriceChange = startPrice - finalEndPrice;
    address public highestBidder;
    uint256 public highestBid = finalEndPrice; //Set current highest bidder to the final floor price 


    
    event Start();
    event Bid(address bidder, uint256 amount);
    event Refund(address buyer, uint256 amount);
    event EndBid(address to, uint tokenId);
    event TransferOwner(uint256 amount);
    bool started;
    bool ended;


    constructor(address _nftAddr, uint tokenId) {
        seller = payable(msg.sender);
        nftCollection = IERC721(_nftAddr);
        nftId = tokenId;
        startedAt = block.timestamp;

    }

    function StartBid(uint256 endTime) public onlyOwner {
        require(!started, "Auction ended");
        require(endTime> 1 minutes, "Auction duration is too short!");
        nftCollection.transferFrom(seller, address(this), nftId);
        endAt = block.timestamp + endTime; //seconds
        started = true;
        emit Start();

    }


    function getPrice() public view returns (uint) {
        uint timeElapsed = (block.timestamp - startedAt);
        uint discount  = totalPriceChange* timeElapsed / endAt;
        return startPrice - discount;
    }

    function bid() external payable {
        require(!ended,"Auction Ended");
        require (block.timestamp < endAt,"Dutch Auction expired");
        require (msg.value >= highestBid,"You're not the highest bidder");

        if (highestBidder != address(0)){
            //refund the previous bidder
            payable(highestBidder).transfer(highestBid);
            emit Refund(highestBidder,highestBid);
        } 

        highestBidder = msg.sender;
        highestBid = msg.value;

        emit Bid( msg.sender, msg.value);

     }

    function endBid() external payable {
        require(started,"Auction hasn't started yet");
        require(!ended,"Auction already ended");
        require(block.timestamp > endAt, "The auction has already ended");

        ended = true;
        uint256 currentPrice = getPrice();
        //Calulate refund
        uint refund = msg.value - currentPrice;
        //Transder NFT to buyer
        if(highestBidder!= address(0)){
            nftCollection.approve(highestBidder, nftId);
            nftCollection.transferFrom(address(this), highestBidder, nftId);

        }

        //Transfer proceeds to seller
        seller.transfer(currentPrice);
        emit TransferOwner(currentPrice);

        //Refund buyer
        if (refund>0) {
            payable(highestBidder).transfer(refund);
            emit Refund(highestBidder,refund);
        }

        started = false;
        emit EndBid(highestBidder, highestBid);
  
    
        selfdestruct(seller);



    }
}
