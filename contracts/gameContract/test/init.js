var web3 = require('./web3');
var utils = require('ethereumjs-util');
var eth=web3.eth;

var _USERS= web3.users;

var contracts = require('./contracts');
var register= contracts.Register;
var tbMgr= contracts.TableManager;
var currency = contracts.CurrencyToken;
var gameToken = contracts.gameToken
var room=contracts.RoomManager;
var notary= contracts.NotaryManager;
var inter = contracts.InterManager;
var croom=contracts.CroomManager;
var authority= contracts.Authority;
var owner = croom.owner();
 web3.eth.defaultAccount = owner;
 
var A=1; //账户A
var B=2; //账户B
var C=3;
var D=0;
var E=4;
var F=5;
var G=6;

function config_init(){
    room.setauthority(authority.address,{gas:10000000});
    croom.setauthority(authority.address,{gas:10000000});
    tbMgr.setauthority(authority.address,{gas:10000000});

    authority.grantContractAuth(room.address,{gas:10000000});
    authority.grantContractAuth(croom.address,{gas:10000000});
    authority.grantContractAuth(tbMgr.address,{gas:10000000});

    gameToken.setRoomMgr(room.address);
    gameToken.setRoomMgr(croom.address);
    gameToken.setTableMgr(tbMgr.address);

    inter.setRoomMgrAddr(room.address);
    inter.setRoomMgrAddr(croom.address);
    inter.setRoomMgrAddr(tbMgr.address);

    notary.setRoomMgrAddr(room.address);
    notary.setRoomMgrAddr(croom.address);
    notary.setRoomMgrAddr(tbMgr.address);


    room.setTokenAddr(gameToken.address);
    croom.setTokenAddr(gameToken.address);
    tbMgr.setTokenAddr(gameToken.address);

    room.setInterAddr(inter.address);
    croom.setInterAddr(inter.address);
    tbMgr.setInterAddr(inter.address);

    room.setNotaryAddr(notary.address);
    croom.setNotaryAddr(notary.address);
    tbMgr.setNotaryAddr(notary.address);
}


function test_init(){
    console.log("coinbase:"+eth.coinbase);
    val = currency.balanceOf(eth.coinbase,{from:owner,gas:10000000});
	if (val <10000)
        web3.ext.wait(
            currency.transfer(eth.coinbase,1000000,{from:owner,gas:10000000})
        );
	for(i=0;i<eth.accounts.length; i++){
		console.log(i)
		val = currency.balanceOf(eth.accounts[i],{from:owner,gas:10000000});
		if (val <10000)
        web3.ext.wait(
            currency.transfer(eth.accounts[i],1000000,{from:owner,gas:10000000})
        );
	}
		
}

config_init();
test_init();
console.log("init success");

