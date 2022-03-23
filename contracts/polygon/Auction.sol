
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



contract Auction is Ownable {
    event Start();
    event Bid(address indexed sender, uint256 amount);
    event Refund(address indexed bidder,uint256 amount);
    event EndBid(address winner, uint256 amount);

    address payable public seller;
    uint256 public startingBid;
    mapping (address => uint256) public  bids;
    address public highestbidder;
    uint256 public highestbid;
    IERC721 nftCollection;
    bool public started;
    bool public ended;
    uint256 public endAt;

    uint256 public nftTokenId;


    constructor(address _nftCollection,uint256 tokenId, uint256 _startingBid) {
        nftCollection = IERC721(_nftCollection);
        nftTokenId = tokenId;
        highestbid = _startingBid;
        seller = payable(msg.sender);
        
    }


    function StartBid(uint256 endTime) external {
        require(!started,"Auction already in progress!");
        require(msg.sender == seller,"You don't have persmission to start the auction");
        nftCollection.transferFrom(msg.sender,address(this),nftTokenId);
        started = true;
        endAt = block.timestamp + endTime;

        emit Start();


    }

    function bid() external payable {
        require(started, "Auction hasn't yet started");
        require(block.timestamp < endAt,"Auction ended!");
        require(msg.value> highestbid,"Not the highest bid!");
        
        //Transfer current highest bid
       if( highestbidder != address(0)) {
        payable(highestbidder).transfer(highestbid);
        emit Refund(highestbidder,highestbid);
    }

        highestbidder = msg.sender;
        highestbid = msg.value;
        bids[highestbidder] = highestbid;
        emit Bid(msg.sender, msg.value);
    }

    function endbid() external {
        require(started, "Auction hasn't yet started");
        require(block.timestamp < endAt,"The auction already ended!");
        require(!ended,"Too late, auction has ended!");
        
        ended= true;

        if (highestbidder != address(0)){
            nftCollection.approve(highestbidder,nftTokenId);
            nftCollection.transferFrom(address(this),highestbidder,nftTokenId);
            seller.transfer(highestbid);
        } 
        else {
            nftCollection.approve(seller,nftTokenId);
            nftCollection.transferFrom(address(this),seller,nftTokenId);

        }

        emit EndBid(highestbidder,highestbid);
        started = false;


    }


}
    
