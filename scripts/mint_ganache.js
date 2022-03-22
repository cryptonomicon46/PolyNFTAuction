// This will automatically mint a portion of the NFTs to the owner 


async function main() { 
    require('dotenv').config();

    const HDWalletProvider = require('@truffle/hdwallet-provider')

    var web3 = require('web3')
    const mnemonic = process.env["MNEMONIC"]
    const project_id = process.env["PROJECT_ID"]
    const OWNER_ADDRESS = process.env.OWNER_ADDRESS

    // console.log(OWNER_ADDRESS)
    
    // // const OWNER_ADDRESS= "0xee1d176ff577Ac5eD1606AC750E8D6422eb11216"
    const NUM_RACERS = 12
    const MINT_AMOUNT = 3
    const gas = 450000
    
    MotoPunks_build = require('../build/polygon-contracts/MotoPunks.json')
    MotoPunks_Address = process.env["NFT_CONTRACT_ADDRESS"]
    console.log("MotoPunks Polygon contract address from process env =", MotoPunks_Address)

    //For Polygon test net
    const provider = new HDWalletProvider(
        mnemonic,"https://polygon-mumbai.infura.io/v3/" + project_id)

    // const provider = "HTTP://127.0.0.1:7545"
    
    const web3instance = new web3(provider)

//     console.log(`Local Ganache contract address is ${MotoPunks_build.networks[5777].address}`)
// //On local Ganache    
//     const nftContract = new web3instance.eth.Contract(
//         MotoPunks_build.abi,
//         MotoPunks_build.networks[5777].address, 
//         { gasLimit: "450000" })


        //To Poly test net
    const nftContract = new web3instance.eth.Contract(
    MotoPunks_build.abi,
    MotoPunks_build.networks[80001].address, 
    { gasLimit: "450000" })

    // const nftContract = new web3instance.eth.Contract(
    //                                                 MotoPunks_build.abi,
    //                                                 MotoPunks_build, 
    //                                                 { gasLimit: "450000" })


    // // console.log(OWNER_ADDRESS)

    // const accounts = await web3instance.eth.getAccounts()

    // console.log(`Local Ganache account address is ${accounts[0]}`)
    
    console.log(nftContract)
    console.log(`Local Ganache account address is ${OWNER_ADDRESS}`)
    const basecost = await nftContract.methods.cost().call()
    console.log(`The base cost is ${basecost} ether`)
    const totalCost = basecost * MINT_AMOUNT
    console.log(`Total Cost of minting ${MINT_AMOUNT} NFTs is ${totalCost} ether`)


    //FOR LOCAL GANACHE 
    
    //     const result = await nftContract.methods
    //                     .mint(MINT_AMOUNT)  
    //                    .send({from:accounts[0], value: totalCost, gas: gas})
    //     console.log("Minted creature. Transaction: " + result.transactionHash);

    // //Print the tokenURIs for all minted NFTs
    // var tokens_minted_ganache = await nftContract.methods.walletOfOwner(accounts[0]).call()

    // for(var i =0; i< tokens_minted_ganache.length; i++){
    //     const uri = await nftContract.methods.tokenURI(tokens_minted_ganache[i]).call()
    //     console.log(`Tokens and token uris minted to the Owner ${tokens_minted_ganache[i]}:${uri}`)
    // }
//---XXX--

// //FOR POLYGON 
    const result = await nftContract.methods
    .mint(MINT_AMOUNT)  
   .send({from:OWNER_ADDRESS, value: totalCost, gas: gas})
console.log("Minted creature. Transaction: " + result.transactionHash);

//Print the tokenURIs for all minted NFTs
var tokens_minted_ganache = await nftContract.methods.walletOfOwner(OWNER_ADDRESS).call()

for(var i =0; i< tokens_minted_ganache.length; i++){
const uri = await nftContract.methods.tokenURI(tokens_minted_ganache[i]).call()
console.log(`Tokens and token uris minted to the Owner ${tokens_minted_ganache[i]}:${uri}`)
}
//---XXX--



}

main()