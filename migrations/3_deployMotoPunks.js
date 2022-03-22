const MotoPunks = artifacts.require("MotoPunks");


const NFT_MINT_DATE = new Date(process.env.NFT_MINT_DATE).getTime().toString().slice(0,10);
const IPFS_IMAGE_METADATA_URI = process.env.IPFS_IMAGE_METADATA_CID;


module.exports = async function (deployer) {
    deployer.deploy(MotoPunks,
        process.env.PROJECT_NAME,
        process.env.PROJECT_SYMBOL,
        // process.env.MINT_COST,
        process.env.MAX_SUPPLY,
        NFT_MINT_DATE,
        IPFS_IMAGE_METADATA_URI

        );
}

