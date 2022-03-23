// 3_deployMotoPunks.js
// ====================

//    Replacing 'MotoPunks'
//    ---------------------
//    > transaction hash:    0xfec6e5dcd32def6717b0b5e55ddd3712f8660eed987ad2febe9c1bd3bca5895d
//    > Blocks: 0            Seconds: 0
//    > contract address:    0x91550Bb0C4233E7C139A5D5bd1632F9763D48f2f
//    > block number:        73
//    > block timestamp:     1648060039
//    > account:             0xf7b3DeD1fa8cd04D08372295Ee4bF2DDfEd396cF
//    > balance:             99.1601875
//    > gas used:            4118961 (0x3ed9b1)
//    > gas price:           20 gwei
//    > value sent:          0 ETH
//    > total cost:          0.08237922 ETH

//    > Saving artifacts
//    -------------------------------------
//    > Total cost:          0.08237922 ETH

// Summary
// =======
// > Total deployments:   1
// > Final cost:          0.08237922 ETH


// (base) $ node scripts/mint_ganache.js                                     
// Local Ganache account address is 0xf7b3DeD1fa8cd04D08372295Ee4bF2DDfEd396cF
// The base cost is 1000000000000000 ether
// Total Cost of minting 3 NFTs is 3000000000000000 ether
// Minted creature. Transaction: 0xdb06b667b4b563921e7c5e003c2c5181cb44aee125573ef2f3405aa02d38cf73
// Tokens and token uris minted to the Owner. Token# 1:https://ipfs.io/ipfs/QmPVjb948YN439VMUMMT4o5vwpgzx4YhFAuQF5exgia3W9/1.json
// Tokens and token uris minted to the Owner. Token# 2:https://ipfs.io/ipfs/QmPVjb948YN439VMUMMT4o5vwpgzx4YhFAuQF5exgia3W9/2.json
// Tokens and token uris minted to the Owner. Token# 3:https://ipfs.io/ipfs/QmPVjb948YN439VMUMMT4o5vwpgzx4YhFAuQF5exgia3W9/3.json


//OUTPUT
// ase) $ node scripts/auction_ganache.js                                     
// Local Ganache NFT Contract address = 0x91550Bb0C4233E7C139A5D5bd1632F9763D48f2f
// NFT Contract address is 0x91550Bb0C4233E7C139A5D5bd1632F9763D48f2f
// The Auction contract address is 0x10596A507cD11246Ecd67D9b55DAA04042d683F8
// Token owned by the Auction contract 3
// The highest bidder is 0x2E6457a4F4b3d8e3b48229b2d8542241B68494Da
// The highest bidder now is 0x2c8dA31AB6BFd9C1793168568774f930893c5FbE
// The winner of the auction for token 3 is 0x2c8dA31AB6BFd9C1793168568774f930893c5FbE for an amount of 2000000000000000000
const sleep = async (delay) => new Promise((resolve)=>{setTimeout(resolve,delay)})

async function main() {
    require('dotenv').config();
    //await sleep

    const nftIdToAuction = 3;
    const HDWalletProvider = require('@truffle/hdwallet-provider');
    Web3 = require('web3');
    const provider = "HTTP://127.0.0.1:7545"

    

    web3Instance = new Web3(provider);

    const [owner,bidder1,bidder2] = await web3Instance.eth.getAccounts()


    const startingBid  = web3Instance.utils.toWei("0.0001","ether")

    const endTime = 3 //seconds



    const nftContract_build = require('../build/polygon-contracts/MotoPunks.json')
    const nftContract_addr = nftContract_build.networks[5777].address

    console.log(`Local Ganache NFT Contract address = ${nftContract_addr}`)

    nftContract = new  web3Instance.eth.Contract(nftContract_build.abi,nftContract_addr)
    console.log(`NFT Contract address is ${nftContract._address}`)

    // //Deploy the Auction contract
    const auction_build = require('../build/polygon-contracts/Auction.json')
    // console.log(auction_build.abi)

    // // console.log(auction_abi)
    const auction_bytecode = auction_build.bytecode
    const auction_abi = auction_build.abi

    // // console.log(auction_bytecode)
    
    let auction_contract = new web3Instance.eth.Contract(auction_abi)

    const receipt = await auction_contract.deploy({ data: auction_build.bytecode, arguments: [nftContract._address, nftIdToAuction, startingBid] }).send({ from: owner, gas: 2000000 })



    const recept_address = await receipt._address
    console.log(`The Auction contract address is ${recept_address}`)

    auction_contract =  new web3Instance.eth.Contract(auction_build.abi,recept_address)

    // //TokenID approval for the auctions contract 
        await nftContract.methods.approve(auction_contract._address,nftIdToAuction).send({from:owner})
        await auction_contract.methods.StartBid(endTime).send({from:owner, gas: 2000000 })

    // console.log(`Token approval transaction hash ${approve_token.transactionHash}`)
    
    //Start the Auction so the token gets transffered to the auction contract 
    // Readback the nftId
    const nftId = await nftContract.methods.walletOfOwner(auction_contract._address).call()

    console.log(`Token owned by the Auction contract ${nftId}`)


    //Bidder1 bids for the Token
    const firstBid = web3Instance.utils.toWei('1', 'ether')
    await auction_contract.methods.bid().send({from:bidder1, value: firstBid})
    let highestBidder = await auction_contract.methods.highestbidder().call()

    console.log(`The highest bidder is ${highestBidder}`)

    //Bidder2 bids for the token
    const secondBid = web3Instance.utils.toWei('2', 'ether')
    await auction_contract.methods.bid().send({from:bidder2, value: secondBid})
     highestBidder = await auction_contract.methods.highestbidder().call()
     console.log(`The highest bidder now is ${highestBidder}`)
    //Wait for auction to expire
    await sleep(3000)  

    //End the auction


    highestBidder = await auction_contract.methods.highestbidder().call()
    const highestBid = await auction_contract.methods.highestbid().call()
    console.log(`The winner of the auction for token ${nftIdToAuction} is ${highestBidder} for an amount of ${highestBid}`)



}

main()