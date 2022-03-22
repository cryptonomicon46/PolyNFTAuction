const Web3 = require('web3') 


const infuraProjectId = process.env["MOTOPUNKS_PROJECTID"];
const rpcURL = 'https://polygon-mumbai.infura.io/v3/' + infuraProjectId 

// const rpcURL = 'http://127.0.0.1:7545' 

const objWeb3 = new Web3(rpcURL);

async function getBalance(address) {
   console.log("debug: helpers/getBalance2-A"); 
    try {
        return await objWeb3.eth.getBalance(address)
    } catch (err) {
        console.log("debug: helpers/getBalance2-E error=" + err);
    }
}

async function demo() {
    const address = '0x1D41CB7d963a5B96687e80Be1b23320e40176F02';
    const balance = await getBalance(address);
    console.log(balance);
}

demo();
