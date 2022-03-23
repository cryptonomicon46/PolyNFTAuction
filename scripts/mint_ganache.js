//OUTPUT 
// The base cost is 1000000000000000 ether
// Total Cost of minting 3 NFTs is 3000000000000000 ether
// Minted creature. Transaction: 0x14b036e055a2550857e5d382fdf0323bf8e89d5f4b6030332c82f270f434b5fc
// Tokens and token uris minted to the Owner. Token# 1:https://ipfs.io/ipfs/QmPVjb948YN439VMUMMT4o5vwpgzx4YhFAuQF5exgia3W9/1.json
// Tokens and token uris minted to the Owner. Token# 2:https://ipfs.io/ipfs/QmPVjb948YN439VMUMMT4o5vwpgzx4YhFAuQF5exgia3W9/2.json
// Tokens and token uris minted to the Owner. Token# 3:https://ipfs.io/ipfs/QmPVjb948YN439VMUMMT4o5vwpgzx4YhFAuQF5exgia3W9/3.json
// Tokens and token uris minted to the Owner. Token# 4:https://ipfs.io/ipfs/QmPVjb948YN439VMUMMT4o5vwpgzx4YhFAuQF5exgia3W9/4.json
// Tokens and token uris minted to the Owner. Token# 5:https://ipfs.io/ipfs/QmPVjb948YN439VMUMMT4o5vwpgzx4YhFAuQF5exgia3W9/5.json
// Tokens and token uris minted to the Owner. Token# 6:https://ipfs.io/ipfs/QmPVjb948YN439VMUMMT4o5vwpgzx4YhFAuQF5exgia3W9/6.json

async function main() { 
    require('dotenv').config();

    const HDWalletProvider = require('@truffle/hdwallet-provider')

    var web3 = require('web3')


    const MINT_AMOUNT = 3
    const gas = 450000
    

    const provider = "HTTP://127.0.0.1:7545"
    const web3instance = new web3(provider)
    MotoPunks_build = require('../build/polygon-contracts/MotoPunks.json')

    const nftContract = new web3instance.eth.Contract(
    MotoPunks_build.abi,
    MotoPunks_build.networks[5777].address, 
    { gasLimit: "450000" })


    const accounts = await web3instance.eth.getAccounts()

    // console.log(nftContract)
    console.log(`Local Ganache account address is ${accounts[0]}`)
    const basecost = await nftContract.methods.cost().call()
    console.log(`The base cost is ${basecost} ether`)
    const totalCost = basecost * MINT_AMOUNT
    console.log(`Total Cost of minting ${MINT_AMOUNT} NFTs is ${totalCost} ether`)



    
        const result = await nftContract.methods
                        .mint(MINT_AMOUNT)  
                       .send({from:accounts[0], value: totalCost, gas: gas})
        console.log("Minted creature. Transaction: " + result.transactionHash);

    //Print the tokenURIs for all minted NFTs
    var tokens_minted_ganache = await nftContract.methods.walletOfOwner(accounts[0]).call()

    for(var i =0; i< tokens_minted_ganache.length; i++){
        const uri = await nftContract.methods.tokenURI(tokens_minted_ganache[i]).call()
        console.log(`Tokens and token uris minted to the Owner. Token# ${tokens_minted_ganache[i]}:${uri}`)
    }




}

main()