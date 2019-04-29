var HDWalletProvider = require("truffle-hdwallet-provider");
var providerproduct = new HDWalletProvider("f1375feeb6aef1838f7e7ef448fe3308e17884fe334e92aa71a5e1642a394768", "http://114.67.7.100:8545");
var provider212 = new HDWalletProvider("0ce9f0b80483fbae111ac7df48527d443594a902b00fc797856e35eb7b12b4be", "http://192.168.0.212:8545");
var provider211 = new HDWalletProvider("0ce9f0b80483fbae111ac7df48527d443594a902b00fc797856e35eb7b12b4be", "http://192.168.0.211:8545");
var providerlocal = new HDWalletProvider("0ce9f0b80483fbae111ac7df48527d443594a902b00fc797856e35eb7b12b4be", "http://127.0.0.1:8545");
module.exports= {  
    networks: {
        development: {
        //host: "127.0.0.1",
        //port: 8545,
        provider:providerlocal,
        gas: 20000000,
        network_id: "*", // Match any network id
        from:"0x7eff122b94897ea5b0e2a9abf47b86337fafebdc"
        },
        product: {
            
            //host: "114.67.7.100",
            //port: 8545,
            provider:providerproduct,
            gas: 20000000,
            network_id: "*", // Match any network id
            from:"0x0557d37d996b123fc1799b17b417a6e5d6773038"
        },
        testnet: {
            
            //host: "114.67.7.100",
            //port: 8545,
            provider:provider211,
            gas: 20000000,
            network_id: "*", // Match any network id
            from:"0x7eff122b94897ea5b0e2a9abf47b86337fafebdc"
        },testnet2: {
            
            //host: "114.67.7.100",
            //port: 8545,
            provider:provider212,
            gas: 20000000,
            network_id: "*", // Match any network id
            from:"0x7eff122b94897ea5b0e2a9abf47b86337fafebdc"
        }
    }
    ,
    solc: {
        optimizer: {
          enabled: true,
          runs: 200
        }
    }
};
