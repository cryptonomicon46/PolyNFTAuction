// nftCollection = IERC721(_nftCollection);
// nftTokenId = tokenId;
// highestbid = _startingBid;
// seller = payable(msg.sender);

async function main() {
    require('dotenv').config();

    const TokenId = 1;
    const HDWalletProvider = require('@truffle/hdwallet-provider');
    Web3 = require('web3');
    const provider = "HTTP://127.0.0.1:7545"


    web3Instance = new Web3(provider);

    const highestbid  = web3Instance.utils.toWei("0.0001","ether")
    const accounts = await web3Instance.eth.getAccounts()


    // console.log(web3Instance);
    console.log(`The highest bid is ${highestbid}`)
    console.log(`Deployer account address is ${accounts[0]}`)
    console.log(`Token to be auctioned is ${TokenId}`)

    const nftContract_build = require('../build/polygon-contracts/MotoPunks.json')
    
    const nftContract_addr = nftContract_build.networks[5777].address
    console.log(`Local Ganache NFT Contract address = ${nftContract_addr}`)


    nftContract = new  web3Instance.eth.Contract(nftContract_build.abi,nftContract_addr)
    console.log(`NFT Contract address is ${nftContract._address}`)
    // console.log(nftContract)

    // //Deploy the Auction contract
    const auction_build = require('../build/polygon-contracts/Auction.json')
    // console.log(auction_build.abi)

    const auction_abi = auction_build.abi
    // console.log(auction_abi)
    const auction_bytecode = auction_build.bytecode
    // console.log(auction_bytecode)
    
    const auction_contract = new web3Instance.eth.Contract(auction_abi)

    // const receipt = await auctionContract.deploy({ data: auctionBuild.bytecode, arguments: [nftContract._address, nftIdToAuction, startingBid] }).send({ from: owner, gas: 2000000 })
// 
    // console.log(auction_contract)
    const receipt = await auction_contract.deploy({
        data: auction_build.bytecode,
        arguments: [nftContract._address,TokenId,highestbid]
    })
    .send({
        from: accounts[0],
        gas: 1500000,
        gasPrice: '450000'
    })

    const recept_address = await receipt._address

    console.log(`The Auction contract address is ${recept_address}`)

    

    // const auction_contract = new web3Instance.eth.Contract(auction_build.abi,receipt.contractAddress)
    // console.log(auction_contract)





}

main()