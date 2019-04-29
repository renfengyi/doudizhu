let web3 = require("./web3");
let abis = require("./abis");
function InitInstance(exports, name) {
    let addr = exports.Register.get(name);
    let instance = web3.eth.contract(abis[name].abi).at(addr);
    exports[name] = instance;
}

let registerAddr = "0x1000000000000000000000000000000000000003";
exports.Register = web3.eth.contract(abis.Register.abi).at(registerAddr);
InitInstance(exports, "InterManager");
InitInstance(exports, "NotaryManager");

InitInstance(exports, "CurrencyToken");
InitInstance(exports, "gameToken");
let authorityAddr = exports.CurrencyToken.authorityAddress();
exports.Authority = web3.eth.contract(abis.Authority.abi).at(authorityAddr);

InitInstance(exports, "RoomManager");
InitInstance(exports, "TableManager");
InitInstance(exports, "CroomManager");
InitInstance(exports, "CroomManagerdev");


let mustDeployed = ["Register", "RoomManager", "gameToken"];
mustDeployed.forEach(function(name) {
    let addr = exports[name].address;
    if(web3.ext.emptyaddress(addr) || web3.eth.getCode(addr) == "0x") {
        console.error("Error: Contract " + name + " does not deployed");
        process.exit();
    }
});

