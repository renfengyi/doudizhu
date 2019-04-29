var Web3 = require('web3');
var utils = require('ethereumjs-util');

var host = "http://192.168.0.211:8545";
var web3 = new Web3(new Web3.providers.HttpProvider(host));
var eth=web3.eth;
var _USERS={
    "0x7eff122b94897ea5b0e2a9abf47b86337fafebdc":new Buffer("0ce9f0b80483fbae111ac7df48527d443594a902b00fc797856e35eb7b12b4be","hex"), //eth.accounts[0]
    "0x2063d0a0f15a03abd1a3d15601294e3dcb79518b":new Buffer("c66a89cba97914a11da0fe31a8dfaa13bb624efd8b7a59e03397cf3805a4931e","hex"), //eth.accounts[1]
    "0xf9e3a40adf8c6bdecc34dfee57eea62a0edd9d6d":new Buffer("f512940f1e67b82c92d3ff7413212a89a5fd7fab62339fea69f34f55a83fa6bd","hex"), //eth.accounts[2]
    "0x0557d37d996b123fc1799b17b417a6e5d6773038":new Buffer("f1375feeb6aef1838f7e7ef448fe3308e17884fe334e92aa71a5e1642a394768","hex"), //eth.accounts[3]
    "0x1805b7ee5dd340981628b81d5d094c44a027bdc5":new Buffer("971dc4a4e2793bc1b094c0716d8507f9896c03b1f524e354f33aa8f9d2897347","hex"), //eth.accounts[4]
    "0x197383d00ccdfb0fbdeccc14006b3fc096578bb6":new Buffer("f484275631f47849b769267c72d73e9fbb0fcc5445ac1052f5bc30a912b0fd8a","hex"), //eth.accounts[5]
    "0x28b8d733800ffb64a41eaa59470917a96aab51f0":new Buffer("067a1d264d142656d5a70c052f9cf90c35d01da9893d3af2ba49274717f9c340","hex"), //eth.accounts[6]
}

var owner = "0x7eff122b94897ea5b0e2a9abf47b86337fafebdc"

if(!web3.eth.blockNumber>1){
    console.log(host+":网络不可达")
    return;
}

var abi=[{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_contract","type":"address"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"get","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}];
var contract="0x1000000000000000000000000000000000000003";
var register= web3.eth.contract(abi).at(contract);

if(eth.getCode(register.address) == "0x"){
    console.log("系统合约:register 未部署");
    return;
}
var croomAddress = register.get("CroomManagerdev");
if(emptyaddress(croomAddress)){
    console.log("请先部署room");
    return;
}
var gameAddress=register.get("gameToken");
if(emptyaddress(gameAddress)){
    console.log("请先部署gameToken 项目");
    return;
}
var gameabi= [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"_setPayer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"authorityAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"addr","type":"address"}],"name":"_setContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"_grant","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"games","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"price","type":"uint256"},{"name":"gaslimit","type":"uint64"}],"name":"_setGas","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tokenAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"_setauthority","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"}],"name":"_getContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"_revoke","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tableMgrAddr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":false,"inputs":[],"name":"leave","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setauthority","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"tokenFallback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"roomAddress","type":"address"}],"name":"setRoomMgr","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableAddress","type":"address"}],"name":"setTableMgr","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]
var game = web3.eth.contract(gameabi).at(register.get("gameToken"))
var croomabi = [{"constant":true,"inputs":[],"name":"notaryManage","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"_setPayer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"authorityAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"addr","type":"address"}],"name":"_setContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"_grant","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"luaAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"interManage","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"price","type":"uint256"},{"name":"gaslimit","type":"uint64"}],"name":"_setGas","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tokenAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"_setauthority","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"}],"name":"_getContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"_revoke","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"playerNum_","type":"uint256"},{"name":"base_","type":"uint256"},{"name":"needChips_","type":"uint256"},{"name":"_multiple","type":"uint256"},{"name":"tbInterNum_","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"playerAddr","type":"address"},{"indexed":false,"name":"roomAddr","type":"address"}],"name":"JoinSittingQueen","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"roomAddr","type":"address"},{"indexed":false,"name":"tableid","type":"uint256"}],"name":"AllotTable","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"roomAddr","type":"address"},{"indexed":false,"name":"tbid","type":"uint256"},{"indexed":false,"name":"playerAddr","type":"address"},{"indexed":false,"name":"pos","type":"uint256"}],"name":"LeaveTable","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"roomAddr","type":"address"},{"indexed":false,"name":"tbid","type":"uint256"},{"indexed":false,"name":"playerAddr","type":"address"},{"indexed":false,"name":"pos","type":"uint256"},{"indexed":false,"name":"hand","type":"uint256"}],"name":"Start","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"roomAddr","type":"address"},{"indexed":false,"name":"tbid","type":"uint256"},{"indexed":false,"name":"hand","type":"uint256"}],"name":"GameStart","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"roomAddr","type":"address"},{"indexed":false,"name":"tbid","type":"uint256"},{"indexed":false,"name":"playerAddr","type":"address"},{"indexed":false,"name":"pos","type":"uint256"},{"indexed":false,"name":"hand","type":"uint256"}],"name":"Discard","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"nrAddr","type":"address"},{"indexed":false,"name":"datalength","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"SubmmitSettleData","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"roomAddr","type":"address"},{"indexed":false,"name":"tableid","type":"uint256"},{"indexed":false,"name":"datasrc","type":"uint256"},{"indexed":false,"name":"errcode","type":"uint256"}],"name":"SettleError","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"hand","type":"uint256"},{"indexed":false,"name":"playingNum","type":"uint256"},{"indexed":false,"name":"tableid","type":"uint256"}],"name":"Settle","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tableid","type":"uint256"},{"indexed":false,"name":"hand","type":"uint256"}],"name":"FinishNotary","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tableid","type":"uint256"},{"indexed":false,"name":"hand","type":"uint256"}],"name":"ReShaff","type":"event"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setluaAddress","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setauthority","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setTokenAddr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setInterAddr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setNotaryAddr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getRoomInfo","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getSittingQueen","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tableid","type":"uint256"}],"name":"getTableInfo","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tableid","type":"uint256"}],"name":"getTablePlayers","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tableid","type":"uint256"}],"name":"getTablePlayingPlayers","outputs":[{"name":"number","type":"uint256"},{"name":"pls","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"playerAddr","type":"address"}],"name":"getPlayerInfo","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tableid","type":"uint256"},{"name":"playerAddr","type":"address"}],"name":"isTablePlayingPlayer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tableid","type":"uint256"},{"name":"pos","type":"uint256"}],"name":"getTableSeatInfo","outputs":[{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tableid","type":"uint256"}],"name":"getTableCurrentStatus","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tableid","type":"uint256"}],"name":"getTableCurrentHand","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"joinTable","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"reJoinTable","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"leaveTable","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableid","type":"uint256"},{"name":"hand","type":"uint256"}],"name":"start","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"hand","type":"uint256"}],"name":"reshaff","outputs":[{"name":"ret","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"data","type":"bytes"}],"name":"playerSettle","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"data","type":"bytes"}],"name":"submitNotary","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tableid","type":"uint256"}],"name":"getSubNotorys","outputs":[{"name":"addrs","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tableid","type":"uint256"}],"name":"resetNotoryInfo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"number","type":"uint256"}],"name":"applyNotarize","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableid","type":"uint256"}],"name":"finishNotarize","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]
var croom=web3.eth.contract(croomabi).at(croomAddress)

var A=1; //账户A
var B=2; //账户B
var C=3;
var D=4;

test_init()
// return;
// settle = genSettle();
// console.log("0x"+settle[0].toString("hex"))
// ret=croom.playerSettle.call("0x"+settle[0].toString("hex"),"0x"+settle[1].toString("hex"),{from:eth.accounts[A]});
// croom.playerSettle("0x"+settle[0].toString("hex"),"0x"+settle[1].toString("hex"),{from:eth.accounts[A]});

// console.log("test success:"+ret)

// return
//return;
succ = croom.joinTable.call({from:eth.accounts[A],gas:10000000});
if(!succ){
    console.log("用户eth.accounts["+A+"]:"+eth.accounts[A]+"加joinTable失败");
    console.log("balanceOf:"+game.balanceOf(eth.accounts[A]));
    console.log("PlayerInfo:")
    console.log(croom.getPlayerInfo(eth.accounts[A]));
    return ;
}
wait(croom.joinTable({from:eth.accounts[A],gas:1000000}));
wait(croom.joinTable({from:eth.accounts[B],gas:1000000}));
wait(croom.joinTable({from:eth.accounts[C],gas:1000000}));



succ = croom.start(croom.getTableInfo(croom.getPlayerInfo(eth.accounts[A])[1])[0],croom.getTableInfo(croom.getPlayerInfo(eth.accounts[A])[1])[1],{from:eth.accounts[A]})

if(!succ){
    console.log(succ+croom.address+"用户A eth.accounts["+A+"]:"+eth.accounts[A]+" 准备失败"+croom.getTableInfo(croom.getPlayerInfo(eth.accounts[A])[1])[0]+" "+croom.getTableInfo(croom.getPlayerInfo(eth.accounts[A])[1])[1]);
    console.log("balanceOf:"+game.balanceOf(eth.accounts[A]));
    console.log("PlayerInfo:")
    console.log(croom.getPlayerInfo(eth.accounts[A]));
    return ;
} 
wait(
    croom.start(croom.getTableInfo(croom.getPlayerInfo(eth.accounts[A])[1])[0],croom.getTableInfo(croom.getPlayerInfo(eth.accounts[A])[1])[1],{from:eth.accounts[A]})
);
wait(
    croom.start(croom.getTableInfo(croom.getPlayerInfo(eth.accounts[B])[1])[0],croom.getTableInfo(croom.getPlayerInfo(eth.accounts[B])[1])[1],{from:eth.accounts[B]})
);
wait(
    croom.start(croom.getTableInfo(croom.getPlayerInfo(eth.accounts[C])[1])[0],croom.getTableInfo(croom.getPlayerInfo(eth.accounts[C])[1])[1],{from:eth.accounts[C]})
);

if (croom.getPlayerInfo(eth.accounts[A])[4] !=5 || croom.getPlayerInfo(eth.accounts[B])[4] !=5 || croom.getPlayerInfo(eth.accounts[C])[4] !=5){
    console.log(" start false");
    return;
}

settle = genSettle();
succ = croom.playerSettle.call("0x"+settle[0].toString("hex")+settle[1].toString("hex"),{from:eth.accounts[A]});
if(succ != true){
    console.log("settle false :"+succ);
    return
}
wait(
    croom.playerSettle("0x"+settle[0].toString("hex")+settle[1].toString("hex"),{from:eth.accounts[A]})
);
if (croom.getPlayerInfo(eth.accounts[A])[4] !=3){
    console.log("settle false;")
    return
}
wait(croom.leaveTable({from:eth.accounts[A]}))
wait(croom.leaveTable({from:eth.accounts[B]}))
wait(croom.leaveTable({from:eth.accounts[C]}))
console.log("croomManager test success!")
return

function wait(txhash){
    //console.log(txhash)
    var r = eth.getTransactionReceipt(txhash);
    if(r==null || r.blockNumber==null){
        
        wait(txhash);
    }
   
}
function emptyaddress(address){
    if(address == "" || address== "0x" || address=="0x0000000000000000000000000000000000000000"){
        return true;
    }
    return false;
}

function test_init(){
    //console.log("coinbase:"+eth.coinbase)
    val = game.balanceOf(eth.coinbase,{from:owner,gas:10000000})
    if (val <10000)
    wait(
        game.transfer(eth.coinbase,1000000,{from:owner,gas:10000000})
    );
    val = game.balanceOf(eth.accounts[A],{from:owner,gas:10000000})
    if (val <10000)
    wait(
        game.transfer(eth.accounts[A],1000000,{from:owner,gas:10000000})
    );
    val = game.balanceOf(eth.accounts[B],{from:owner,gas:10000000})
    if (val <10000)
    wait(
        game.transfer(eth.accounts[B],1000000,{from:owner,gas:10000000})
    );
    val = game.balanceOf(eth.accounts[C],{from:owner,gas:10000000})
    if (val <10000)
    wait(
        game.transfer(eth.accounts[C],1000000,{from:owner,gas:10000000})
    );
    val = game.balanceOf(eth.accounts[D],{from:owner,gas:10000000})
    if (val <10000)
    wait(
        game.transfer(eth.accounts[D],1000000,{from:owner,gas:10000000})
    );
}

function genSettle(){
    var gs ;
    if(C>0){
        gs = gen3()
    } else {
        gs = gen2()
    }
    return gs;
}

function gen3(){
    var tableid =croom.getPlayerInfo(eth.accounts[A])[1].toString()*1
    var hand =croom.getTableInfo(tableid)[1].toString()*1
    var data=[croom.address,tableid,hand,[ [0,1,3],[1,0,2],[2,0,1] ]];
    var rlpdata=utils.rlp.encode(data);
    var hash = utils.keccak(rlpdata);

 
    var signA = utils.ecsign(hash,_USERS[eth.accounts[A]]);
    var signB = utils.ecsign(hash,_USERS[eth.accounts[B]]);
    var signC = utils.ecsign(hash,_USERS[eth.accounts[C]]);

    var signAbuf = Buffer.concat([signA["r"],signA["s"],utils.toBuffer(signA["v"])]);
    var signBbuf = Buffer.concat([signB["r"],signB["s"],utils.toBuffer(signB["v"])]);
    var signCbuf = Buffer.concat([signC["r"],signC["s"],utils.toBuffer(signC["v"])]);
   
    var signs = Buffer.concat([signAbuf,signBbuf,signCbuf]);
    var ret=[];
    ret[0]=signs;
    ret[1]=rlpdata;
    return ret;
    //var msg  = Buffer.concat([signs,rlpdata]);

}

function gen2(){
    var tableid =croom.getPlayerInfo(eth.accounts[A])[1].toString()*1
    var hand =croom.getTableInfo(tableid)[1].toString()*1
    console.log(tableid,hand)
    var data=[croom.address,tableid,hand,[ [0,1,2],[1,0,2]]];
    var rlpdata=utils.rlp.encode(data);
    var hash = utils.keccak(rlpdata);

 
    var signA = utils.ecsign(hash,_USERS[eth.accounts[A]]);
    var signB = utils.ecsign(hash,_USERS[eth.accounts[B]]);
    var signC = utils.ecsign(hash,_USERS[eth.accounts[C]]);

    var signAbuf = Buffer.concat([signA["r"],signA["s"],utils.toBuffer(signA["v"])]);
    var signBbuf = Buffer.concat([signB["r"],signB["s"],utils.toBuffer(signB["v"])]);
    //var signCbuf = Buffer.concat([signC["r"],signC["s"],utils.toBuffer(signC["v"])]);
   
    var signs = Buffer.concat([signAbuf,signBbuf]);
    var ret=[];
    ret[0]=signs;
    ret[1]=rlpdata;
    return ret;
    //var msg  = Buffer.concat([signs,rlpdata]);

}