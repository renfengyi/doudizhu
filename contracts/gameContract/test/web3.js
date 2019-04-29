var Web3 = require('web3');

let host = "http://127.0.0.1:8545";
const commandLineArgs = require('command-line-args')
const optionDefinitions = [
    { name: 'network', alias: 'n', type: String }
]
const options = commandLineArgs(optionDefinitions)

if(options.network == "product"){
    host="http://114.67.7.100:8545";
} else if(options.network == "testnet") {
    host="http://192.168.0.211:8545";
}else if(options.network == "testnet2") {
    host="http://192.168.0.212:8545";
}

exports._web3 = new Web3(new Web3.providers.HttpProvider(host));
exports.eth = exports._web3.eth;


if(exports.eth.blockNumber < 1){
    console.error("Error: cannot connect to node " + host);
    process.exit();
}

exports.utils = exports._web3.utils;
exports.personal = exports._web3.personal;
exports.admin = exports._web3.admin;

exports.ext = {};
exports.ext.wait = function(txhash) {
    while (true) {
        let receipt = exports.eth.getTransactionReceipt(txhash);
        if (receipt != null && receipt.blockNumber != null) {
            console.log("Tx " + txhash + " is in block " + receipt.blockNumber);
            break;
        }
        console.log("Waiting a mined block to include tx " + txhash);
        //exports.personal.unlockAccount("0x7eff122b94897ea5b0e2a9abf47b86337fafebdc", "1234");
    }
};

exports.ext.emptyaddress = function(address) {
    if(address == "" || address== "0x" || address=="0x0000000000000000000000000000000000000000"){
        return true;
    }
    return false;
};

let owner = "0x7eff122b94897ea5b0e2a9abf47b86337fafebdc";
exports.eth.defaultAccount = owner;

exports.users = [
    {"address": "0x7eff122b94897ea5b0e2a9abf47b86337fafebdc","pri":new Buffer("0ce9f0b80483fbae111ac7df48527d443594a902b00fc797856e35eb7b12b4be","hex")}, //eth.accounts[0]
    {"address": "0x2063d0a0f15a03abd1a3d15601294e3dcb79518b","pri":new Buffer("c66a89cba97914a11da0fe31a8dfaa13bb624efd8b7a59e03397cf3805a4931e","hex")}, //eth.accounts[1]
    {"address": "0xf9e3a40adf8c6bdecc34dfee57eea62a0edd9d6d","pri":new Buffer("f512940f1e67b82c92d3ff7413212a89a5fd7fab62339fea69f34f55a83fa6bd","hex")}, //eth.accounts[2]
    {"address": "0x0557d37d996b123fc1799b17b417a6e5d6773038","pri":new Buffer("f1375feeb6aef1838f7e7ef448fe3308e17884fe334e92aa71a5e1642a394768","hex")}, //eth.accounts[3]
    {"address": "0x1805b7ee5dd340981628b81d5d094c44a027bdc5","pri":new Buffer("971dc4a4e2793bc1b094c0716d8507f9896c03b1f524e354f33aa8f9d2897347","hex")}, //eth.accounts[4]
    {"address": "0x197383d00ccdfb0fbdeccc14006b3fc096578bb6","pri":new Buffer("f484275631f47849b769267c72d73e9fbb0fcc5445ac1052f5bc30a912b0fd8a","hex")}, //eth.accounts[5]
    {"address": "0x28b8d733800ffb64a41eaa59470917a96aab51f0","pri":new Buffer("067a1d264d142656d5a70c052f9cf90c35d01da9893d3af2ba49274717f9c340","hex")}, //eth.accounts[6]
];

