const NFT_Royalty = artifacts.require("NFT_Royalty");
const IPFS_IMAGE_METADATA_URI = process.env.IPFS_IMAGE_METADATA_CID;


module.exports = async function (deployer) {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[1]);
    // console.log(NFT_Royalty);



    deployer.deploy(
        NFT_Royalty,
        "NFT Royalty",
        "NFT_R",
        12,
        IPFS_IMAGE_METADATA_URI,
        accounts[1],
        5

        );
}

