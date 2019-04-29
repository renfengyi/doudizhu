var web3 = require('./web3');
var Tx = require('ethereumjs-tx');
var eth=web3.eth;

var _USERS= web3.users;
var users ={	
    "0x7eff122b94897ea5b0e2a9abf47b86337fafebdc":new Buffer("0ce9f0b80483fbae111ac7df48527d443594a902b00fc797856e35eb7b12b4be","hex"), //
    "0x0557d37d996b123fc1799b17b417a6e5d6773038":new Buffer("f1375feeb6aef1838f7e7ef448fe3308e17884fe334e92aa71a5e1642a394768","hex"), //
}
var contracts = require('./contracts');
var register= contracts.Register;
var tbMgr= contracts.TableManager;
var game = contracts.gameTokentest;
//var room=contracts.RoomManager;
var notary= contracts.NotaryManager;
var inter = contracts.InterManager;
var croom=contracts.CroomManagertest;
var authority= contracts.Authority;
var owner = croom.owner();
var Manager = "0x0557d37d996b123fc1799b17b417a6e5d6773038";
web3.eth.defaultAccount = owner;


function config_init(){

    //croom.setauthority(authority.address,{gas:10000000});
    sendTransaction({from:owner,to:croom.address,data:croom.setauthority.getData(authority.address)})
    //croom.setInterAddr(inter.address);
    sendTransaction({from:owner,to:croom.address,data:croom.setInterAddr.getData(inter.address)})
    //croom.setNotaryAddr(notary.address);
    sendTransaction({from:owner,to:croom.address,data: croom.setNotaryAddr.getData(notary.address)})
    //croom.setTokenAddr(game.address);
    sendTransaction({from:owner,to:croom.address,data:croom.setTokenAddr.getData(game.address)})


    //authority.grantContractAuth(croom.address,{gas:10000000});
    sendTransaction({from:owner,to:authority.address,data:authority.grantContractAuth.getData(croom.address)})
    //game.setRoomMgr(croom.address);
    sendTransaction({from:owner,to:game.address,data:game.setRoomMgr.getData(croom.address)})

    
    //inter.setRoomMgrAddr(croom.address);
    sendTransaction({from:Manager,to:inter.address,data:inter.setRoomMgrAddr.getData(croom.address)})
    //notary.setRoomMgrAddr(croom.address);
    sendTransaction({from:Manager,to:notary.address,data:notary.setRoomMgrAddr.getData(croom.address)})

}


function test_init(){
    console.log("coinbase:"+eth.coinbase);
    val = game.balanceOf(Manager,{from:owner,gas:10000000});
    if (val <10000){
        sendTransaction({from:owner,to:game.address,data:game.transfer.getData(Manager,100000000000)})
    }
	for(i=0;i<eth.accounts.length; i++){
		console.log(i)
		val = game.balanceOf(eth.accounts[i],{from:owner,gas:10000000});
		if (val <10000){
     
            sendTransaction({from:owner,to:eth.accounts[i],data:game.transfer.getData(eth.coinbase,1000000)})
        }
	}
		
}

config_init();
test_init();
console.log("init success");


function getRawTransaction(options){
    from    = options.from;
    to      = options.to?options.to:"";
    value   = options.value?options.value:0;
    data    =options.data?options.data:"";
    gas     = options.gas?options.gas:10000000;
    gasPrice = options.gasPrice?options.gasPrice:50000000000;
	var rawTx = {
		nonce:web3.eth.getTransactionCount(from),
		gasPrice:gasPrice,
		to:to,
		value:value,
		gasLimit:gas,
		data:data
	}
	var tx = new Tx(rawTx)
	tx.sign(users[from])
	var serializeTx = tx.serialize()
	
	return "0x"+serializeTx.toString('hex')
}
function sendTransaction(options){
    var rawTx = getRawTransaction(options)
	console.log(rawTx)
    var tx = web3.eth.sendRawTransaction(rawTx);
    wait(tx);
}
function wait(txhash){
    try {
        var receipt = web3.eth.getTransactionReceipt(txhash)
        //console.log("receipt"+txhash)
        while(receipt==null){
            receipt = web3.eth.getTransactionReceipt(txhash)
            //console.log(receipt)
        }
    } catch (e) {
        //console.log(e);
        wait(web3,txhash);
    }

    return;
}