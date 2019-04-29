var web3 = require("./web3");
var contracts = require("./contracts");

function TransferChainToken(to, amount) {
    let before = web3.eth.getBalance(to);
    let tx = web3.eth.sendTransaction({to:to, value: amount*1e18, gas:10000000});
    web3.ext.wait(tx);
    let after = web3.eth.getBalance(to);

    console.log("transfered chain token " + amount + " ethers to " + to + ", " + before + " --> " + after);
}

function TransferGameToken(to, amount) {
    let currency = contracts.CurrencyToken;
    let before = currency.balanceOf(to, {gas:10000000});
    let tx = currency.transfer(to, amount, {gas:10000000});
    web3.ext.wait(tx);
    let after = currency.balanceOf(to, {gas:10000000});

    console.log("transfered game token " + amount + " to " + to + ", " + before + " --> " + after);
}

function dumpPlayerInfo(addrs, manager) {
    addrs.forEach((to) => {
        let results = manager.getPlayerInfo(to);
        console.log("addr " + to);
        results.forEach(function(val, index) {
            console.log("\t" + index + " : " + val);
        });
    });
}

var cmd = process.argv[2];

if (cmd == "chain") {
    let amount = process.argv[3];
    let addrs = process.argv.slice(4);
    addrs.forEach((to) => { TransferChainToken(to, amount); });
} else if (cmd == "game") {
    let amount = process.argv[3];
    let addrs = process.argv.slice(4);
    addrs.forEach((to) => { TransferGameToken(to, amount); });
} else if (cmd == "player") {
    let addrs = process.argv.slice(3);

    console.log("--- Dump player info in TableManager ---");
    dumpPlayerInfo(addrs, contracts.TableManager);
    console.log("");

    console.log("--- Dump player info in RoomManager ---");
    dumpPlayerInfo(addrs, contracts.RoomManager);
} else if (cmd == "auth") {
    let addrs = process.argv.slice(3);
    addrs.forEach((addr) => {
        let ret = contracts.Authority.getAuth(addr);
        console.log("auth " + addr + " : " + ret);
    });
} else if(cmd == "list") {
    for(name in contracts) {
        console.log(name + "\t: " + contracts[name].address);
    }
} else {
    console.log("command must be chain/game");
}

