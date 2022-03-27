const NFT_Royalty = artifacts.require("NFT_Royalty");


const NAME = 'NFT Royalty'
const SYMBOL = 'NFT_MP'
const COST = 0
const MAX_SUPPLY = 12
const MAX_MINT_AMOUNT = 1
const IPFS_IMAGE_METADATA_URI = 'ipfs://IPFS-IMAGE-METADATA-CID/'
const RoyaltyFee = 5 // 5%
let nft_royalty
contract("NFT_Royalty", async accounts => {

    const NFT_MINT_DATE = (Date.now() + milliseconds).toString().slice(0, 10)

    string memory _name,
    string memory _symbol,
    uint256 _maxSupply,
    uint256 _allowMintingOn,
    string memory _initBaseURI,
    address payable _artist
    
    deployer = accounts[0];
    artist = accounts[1];
    nft_royalty = await NFT_Royalty.new(
        NAME,
        SYMBOL,
        MAX_SUPPLY,
        NFT_MINT_DATE,
        IPFS_IMAGE_METADATA_URI,
        
        
    ) 
    describe("Deployment", ()=>{

    beforeEach(async () => {

    })

 })

 it("Name of the NFT", async ()=> {

 })

})