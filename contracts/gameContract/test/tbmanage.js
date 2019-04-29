var Web3 = require('web3');
var utils = require('ethereumjs-util')

var host = "http://192.168.0.211:8545";
var A =1;
var B =2;
var C =3;
var _USERS=[
    {"address": "0x7eff122b94897ea5b0e2a9abf47b86337fafebdc","pri":new Buffer("0ce9f0b80483fbae111ac7df48527d443594a902b00fc797856e35eb7b12b4be","hex")}, //eth.accounts[0]
    {"address": "0x2063d0a0f15a03abd1a3d15601294e3dcb79518b","pri":new Buffer("c66a89cba97914a11da0fe31a8dfaa13bb624efd8b7a59e03397cf3805a4931e","hex")}, //eth.accounts[1].
    {"address": "0xf9e3a40adf8c6bdecc34dfee57eea62a0edd9d6d","pri":new Buffer("f512940f1e67b82c92d3ff7413212a89a5fd7fab62339fea69f34f55a83fa6bd","hex")}, //eth.accounts[2]
    {"address": "0x0557d37d996b123fc1799b17b417a6e5d6773038","pri":new Buffer("f1375feeb6aef1838f7e7ef448fe3308e17884fe334e92aa71a5e1642a394768","hex")}, //eth.accounts[3]
    {"address": "0x1805b7ee5dd340981628b81d5d094c44a027bdc5","pri":new Buffer("971dc4a4e2793bc1b094c0716d8507f9896c03b1f524e354f33aa8f9d2897347","hex")}, //eth.accounts[4]
    {"address": "0x197383d00ccdfb0fbdeccc14006b3fc096578bb6","pri":new Buffer("f484275631f47849b769267c72d73e9fbb0fcc5445ac1052f5bc30a912b0fd8a","hex")}, //eth.accounts[5]
    {"address": "0x28b8d733800ffb64a41eaa59470917a96aab51f0","pri":new Buffer("067a1d264d142656d5a70c052f9cf90c35d01da9893d3af2ba49274717f9c340","hex")}, //eth.accounts[6]
]



//检查账户配置合法性
if(!checkUsers()){ return;}


//检查users配置是否合法

var web3 = new Web3(new Web3.providers.HttpProvider(host));
var eth=web3.eth;
 

if(!web3.eth.blockNumber>1){
    console.log(host+":网络不可达")
    return;
}

var abi=[{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_contract","type":"address"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"get","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}];
var contract="0x1000000000000000000000000000000000000001";
var register= web3.eth.contract(abi).at(contract);


if(eth.getCode(register.address) == "0x"){
    console.log("系统合约:register 未部署");
    return;
}
var bitcoinToken = register.get("bitcoinToken");
if(emptyaddress(bitcoinToken)){
    console.log("请先部署StateChannel");
    return;
}
// var currencyToken=register.get("currencyToken");
// if(emptyaddress(currencyToken)){
//     console.log("请先部署currency 项目");
//     return;
// }

var tableMgrAdddress = register.get("tableManage2");
if(emptyaddress(tableMgrAdddress)){
    console.log("请先部署tableManage 项目");
    return;
}
// var currencyabi =[{"constant":false,"inputs":[{"name":"name","type":"string"}],"name":"getContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x35817773"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"addr","type":"address"}],"name":"setContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x3f0ed0df"},{"constant":true,"inputs":[],"name":"pledgeAddr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x7adbd552"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x8da5cb5b"},{"constant":true,"inputs":[],"name":"roomMgrAddr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xc33d7588"},{"constant":true,"inputs":[],"name":"freezeAddr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xee0d5915"},{"constant":true,"inputs":[],"name":"tableMgrAddr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xf0a497f0"},{"inputs":[{"name":"_val","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor","signature":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"code","type":"uint256"}],"name":"ResultCode","type":"event","signature":"0x7ed5a82c702f5582f233fa014850aee6691842dc6e0f0d4c3c5cfdc3af574e1a"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event","signature":"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"}],"name":"transData","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x422810ea"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xa9059cbb"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xbe45fd62"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x70a08231"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"_supply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x18160ddd"},{"constant":true,"inputs":[],"name":"getPleage","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x0b6f6bc1"},{"constant":true,"inputs":[],"name":"getFreezer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x51337408"},{"constant":false,"inputs":[{"name":"_pleageAddr","type":"address"}],"name":"setPledge","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x9d638aca"},{"constant":false,"inputs":[{"name":"_freezeAddr","type":"address"}],"name":"setFreezer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x2c341fe7"},{"constant":false,"inputs":[{"name":"_price","type":"uint256"},{"name":"_contact","type":"string"},{"name":"_pay","type":"string"},{"name":"_enable","type":"bool"}],"name":"setconfig","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x33358d07"},{"constant":true,"inputs":[],"name":"getconfig","outputs":[{"name":"_json","type":"string"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x371be589"},{"constant":false,"inputs":[{"name":"_payer","type":"int256"},{"name":"_account","type":"string"},{"name":"_price","type":"uint256"},{"name":"_amount","type":"uint256"}],"name":"prechange","outputs":[{"name":"err","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xc34f4ac8"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"getchange","outputs":[{"name":"_json","type":"string"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x86c3a4f9"},{"constant":true,"inputs":[{"name":"_txid","type":"uint256"}],"name":"getchangebyid","outputs":[{"name":"_json","type":"string"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x6024069e"},{"constant":true,"inputs":[{"name":"page","type":"uint256"},{"name":"pagesize","type":"uint256"}],"name":"listchange","outputs":[{"name":"","type":"uint256"},{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x764a2c66"},{"constant":false,"inputs":[{"name":"_status","type":"int256"}],"name":"setchange","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x9f09ec0f"},{"constant":false,"inputs":[{"name":"_txid","type":"uint256"},{"name":"_status","type":"int256"}],"name":"subchange","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x1638a068"},{"constant":false,"inputs":[{"name":"_index","type":"uint256"}],"name":"balanceOfnum","outputs":[{"name":"_json","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x2d967bf6"},{"constant":false,"inputs":[{"name":"_agentAddr","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_contact","type":"string"},{"name":"_token2MoneyRate","type":"string"}],"name":"submitExchangeToFiatMoney","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x701f8809"},{"constant":false,"inputs":[{"name":"roomMgr","type":"address"}],"name":"setRoomMgr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x7e8839a1"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xf5537ede"},{"constant":false,"inputs":[{"name":"tableMgr","type":"address"}],"name":"setTableMgr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x7e119b9c"},{"constant":true,"inputs":[],"name":"getTableMgr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xf4e4542f"},{"constant":false,"inputs":[{"name":"to","type":"address"}],"name":"joinTexasTable","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x2f91a85a"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"joinTable","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x7e67ec54"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferForTM","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xb138ad54"}];
// var currency = web3.eth.contract(currencyabi).at(register.get("currencyToken"))

var bitcoinabi=[{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x18160ddd"},{"constant":false,"inputs":[{"name":"name","type":"string"}],"name":"getContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x35817773"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"addr","type":"address"}],"name":"setContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x3f0ed0df"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor","signature":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"txHash","type":"bytes32"}],"name":"ProcessTrans","type":"event","signature":"0x2ff41af79a8794bf79c0b056078cc60014f4ee86b578e2a30f51405ac57115a8"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"table","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"TransData","type":"event","signature":"0x0b14d5b9042b79c5a63be04fe4b0b0ba31116f82ed507b9c4ad0c2787b62edf2"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"btcAddr","type":"string"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"SubmmitRedemtion","type":"event","signature":"0x86cc4151fe88978b1f32f67ff359921fad80620179d2e50ce46e60a415632efa"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"btcAddr","type":"string"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"FinishRedemtion","type":"event","signature":"0x604642c7a10405c6603f54112c416113abd060624b849a8ba73c1c7ac13687a0"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event","signature":"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"},{"constant":false,"inputs":[{"name":"_trustedBTCRelay","type":"address"}],"name":"setTrustedBTCRelay","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x27b5675b"},{"constant":false,"inputs":[{"name":"_warrant","type":"address"}],"name":"setWarrant","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x12cebc51"},{"constant":false,"inputs":[{"name":"withdraw","type":"address"}],"name":"setWithdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xe47dea1d"},{"constant":false,"inputs":[{"name":"tableMgr","type":"address"}],"name":"setTableMgr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x7e119b9c"},{"constant":false,"inputs":[{"name":"roomMgr","type":"address"}],"name":"setRoomMgr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x7e8839a1"},{"constant":true,"inputs":[],"name":"getRoomMgr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x0c678be6"},{"constant":true,"inputs":[],"name":"getTrustedBTCRelay","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x9519944f"},{"constant":true,"inputs":[],"name":"getWarrant","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x7a80cd2c"},{"constant":true,"inputs":[],"name":"getWithdraw","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xc794239c"},{"constant":true,"inputs":[],"name":"getTableMgr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xf4e4542f"},{"constant":false,"inputs":[{"name":"tableid","type":"uint256"},{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferForTM","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x677272d7"},{"constant":false,"inputs":[{"name":"tableid","type":"uint256"},{"name":"to","type":"address"}],"name":"joinTexasTable","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x233e56c1"},{"constant":false,"inputs":[{"name":"tableid","type":"uint256"},{"name":"value","type":"uint256"}],"name":"joinTable","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x1ff7efc0"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xf5537ede"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"}],"name":"transData","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x422810ea"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xa9059cbb"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xbe45fd62"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x70a08231"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"netBalanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x0b986a50"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"frozenOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x1bf6e00d"},{"constant":true,"inputs":[],"name":"numberOfPlayer","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x4a71e850"},{"constant":true,"inputs":[{"name":"idx","type":"uint256"}],"name":"getPlayer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xe55ae4e8"},{"constant":false,"inputs":[{"name":"btcAddr","type":"string"},{"name":"amount","type":"uint256"}],"name":"submmitRedemtion","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x948657e2"},{"constant":false,"inputs":[{"name":"txHash","type":"uint256"},{"name":"btcAddr_","type":"int256"},{"name":"eAddr_","type":"int256"},{"name":"satoshis_","type":"uint256"}],"name":"turnTo","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x37711f01"},{"constant":false,"inputs":[{"name":"txHash","type":"uint256"},{"name":"redeemBtcAddr","type":"int256"},{"name":"multiSigBtcAddr","type":"int256"},{"name":"satoshis","type":"uint256"}],"name":"redeem","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xb7fe723f"},{"constant":true,"inputs":[{"name":"m","type":"uint256"},{"name":"n","type":"uint256"}],"name":"getMultiSigAddress","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xc387c562"}];
var bitcoin = web3.eth.contract(bitcoinabi).at(register.get("bitcoinToken"));

var tbmgrabi=[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x06fdde03"},{"constant":true,"inputs":[],"name":"notaryManage","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x2b8dfaea"},{"constant":false,"inputs":[{"name":"name","type":"string"}],"name":"getContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x35817773"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"addr","type":"address"}],"name":"setContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x3f0ed0df"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"myTable","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x71fe9d24"},{"constant":true,"inputs":[],"name":"tableFunAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x787ae6d4"},{"constant":true,"inputs":[],"name":"interManage","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x7a54ea8b"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x8da5cb5b"},{"constant":true,"inputs":[],"name":"tokenAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x9d76ea58"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tableList","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xce8b4afc"},{"constant":true,"inputs":[],"name":"tableNonce","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xd1323d7c"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor","signature":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"creator","type":"address"},{"indexed":false,"name":"tableid","type":"uint256"},{"indexed":false,"name":"minimum","type":"uint256"},{"indexed":false,"name":"maximum","type":"uint256"},{"indexed":false,"name":"needChips","type":"uint256"},{"indexed":false,"name":"smallBlind","type":"uint256"}],"name":"CreateTable","type":"event","signature":"0xdcc30eece90665cbe2f4963a7390e30c42b657e46ba3b662fb1aca6e660003c4"},{"anonymous":false,"inputs":[{"indexed":false,"name":"creator","type":"address"},{"indexed":false,"name":"tableid","type":"uint256"}],"name":"DestroyTable","type":"event","signature":"0x8837499d14ad4c37e77a5e45b46adaf947f6a011e19a11e8767aa2b5f740d1e0"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tableid","type":"uint256"},{"indexed":false,"name":"number","type":"uint256"}],"name":"SelectInter","type":"event","signature":"0xc91adf234ccf28cd1ff9e87081f501b56451f16dea40481ceb23bf1fbd396ca3"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tableid","type":"uint256"},{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"pos","type":"uint256"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Join","type":"event","signature":"0xb52f7d019575ca7e8f1c4f4230a62faa06222575adaae1c8ab6238dd85abe2e6"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"pos","type":"uint256"}],"name":"Start","type":"event","signature":"0xcfb9c5312b25ec7b809d61e638df25f749eae5d5c25399e1c93d1d319bfd5821"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"pos","type":"uint256"}],"name":"SelectStarter","type":"event","signature":"0xdb3f22c5a13e1333a3d5ae69967795103d0c4c3fa9c108d14dc8b022cd635dd1"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"pos","type":"uint256"}],"name":"Discard","type":"event","signature":"0x41589fb7a60d237058a6082a604907c67d605ff766d1af04e817a25df1d2b229"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"pos","type":"uint256"}],"name":"Leave","type":"event","signature":"0x61a26f7c17d8780c095ccfa67e689a13ee4e06ddce3da18956369f4a396100e8"},{"anonymous":false,"inputs":[{"indexed":false,"name":"player","type":"address"},{"indexed":false,"name":"pos","type":"uint256"},{"indexed":false,"name":"hand","type":"uint256"}],"name":"StartGame","type":"event","signature":"0xca6a93f0d2da1fd97d50b6f382796f7a702e15755639d64dccff3645014c31ea"},{"anonymous":false,"inputs":[{"indexed":false,"name":"hand","type":"uint256"},{"indexed":false,"name":"playingNum","type":"uint256"}],"name":"Settle","type":"event","signature":"0x88a84ea6dd274b386afd27dbbe11b6192b25017f5e60bb8c4053dfddb45c294d"},{"anonymous":false,"inputs":[{"indexed":false,"name":"player","type":"address"},{"indexed":false,"name":"pos","type":"uint256"},{"indexed":false,"name":"hand","type":"uint256"},{"indexed":false,"name":"flag","type":"uint256"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"SettleItemData","type":"event","signature":"0x9539873d630ab24eef17301357dbc4b7ad09b855cef9b688872b23e8e2f1c141"},{"anonymous":false,"inputs":[{"indexed":false,"name":"player","type":"address"},{"indexed":false,"name":"pos","type":"uint256"},{"indexed":false,"name":"hand","type":"uint256"}],"name":"SettlePlayerAbsent","type":"event","signature":"0x2aa71df823fecef58f7ce0dc8d7a8eaaa92c4cd4ddbdbbfd07c42389303cbdf4"},{"anonymous":false,"inputs":[{"indexed":false,"name":"player","type":"address"},{"indexed":false,"name":"hand","type":"uint256"}],"name":"SettlePlayer","type":"event","signature":"0x1b578cf939b009e8acf7313adb11aebe1aafed08f92004492157cbfc430db642"},{"anonymous":false,"inputs":[{"indexed":false,"name":"submitter","type":"address"},{"indexed":false,"name":"datalength","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"SettleData","type":"event","signature":"0x9abdde1f678192ef13fd8eb5213d3818927490d138525164eefe9cf034d4086e"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"datasrc","type":"uint256"},{"indexed":false,"name":"errcode","type":"uint256"}],"name":"SettleError","type":"event","signature":"0x59fc969eb4e8fbf8a3fcedeaa0a3772b3684e76585dedf5295812fedd73c3a80"},{"anonymous":false,"inputs":[{"indexed":false,"name":"hand","type":"uint256"}],"name":"FinishNotary","type":"event","signature":"0xf3158feeab126e9d61db9e8e9e3625766ac21d08f68fa8c30482f7340b742cfb"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setTokenAddr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x2ebd1e28"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setInterAddr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x1f0d57d7"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setNotaryAddr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x6ab2c201"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setTableFunAddr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x08f97d5b"},{"constant":true,"inputs":[],"name":"startPlayer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xa3be6f4f"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x70a08231"},{"constant":false,"inputs":[{"name":"minimum","type":"uint256"},{"name":"maximum","type":"uint256"},{"name":"needChips","type":"uint256"},{"name":"smallBlind","type":"uint256"}],"name":"createTable","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xa4dd19a5"},{"constant":false,"inputs":[],"name":"destroyTable","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x15e9cf56"},{"constant":true,"inputs":[{"name":"pagenum","type":"uint256"},{"name":"pagesize","type":"uint256"}],"name":"getTableList","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x7ec1d4cf"},{"constant":true,"inputs":[],"name":"getPlayerTable","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x39a6221b"},{"constant":true,"inputs":[{"name":"tableid","type":"uint256"}],"name":"getTable","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x195e251f"},{"constant":true,"inputs":[],"name":"getSeats","outputs":[{"name":"ret","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xa997c66a"},{"constant":false,"inputs":[{"name":"number","type":"uint256"}],"name":"applyInter","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x9761f49a"},{"constant":false,"inputs":[{"name":"number","type":"uint256"}],"name":"applyNotarize","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xba9c061a"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"getPlayerInfo","outputs":[{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x59328401"},{"constant":true,"inputs":[],"name":"getCurrentHand","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x3cda2272"},{"constant":true,"inputs":[{"name":"tableid","type":"uint256"}],"name":"currentHand","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x7767c2e0"},{"constant":false,"inputs":[],"name":"quota","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xcebe09c9"},{"constant":true,"inputs":[{"name":"tableid","type":"uint256"}],"name":"needChips","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x57a65691"},{"constant":true,"inputs":[{"name":"tableid","type":"uint256"}],"name":"getTableInfo","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x90dee8dc"},{"constant":false,"inputs":[{"name":"hand","type":"uint32"}],"name":"startGame","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x89f45339"},{"constant":false,"inputs":[{"name":"tableid","type":"uint256"},{"name":"from","type":"address"},{"name":"value","type":"uint256"}],"name":"join","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x7613c1d2"},{"constant":false,"inputs":[{"name":"hand","type":"uint256"}],"name":"start","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x95805dad"},{"constant":false,"inputs":[{"name":"hand","type":"uint256"}],"name":"discard","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x7e8f2b0c"},{"constant":false,"inputs":[{"name":"data","type":"bytes"}],"name":"discard2","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x26d3da79"},{"constant":false,"inputs":[],"name":"leave","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xd66d9e19"},{"constant":false,"inputs":[{"name":"data","type":"bytes"}],"name":"settle","outputs":[{"name":"a","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xd0322fbf"},{"constant":false,"inputs":[{"name":"tableid","type":"uint256"},{"name":"info","type":"bytes"}],"name":"submitNotary","outputs":[{"name":"ret","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xe6aba8d3"},{"constant":false,"inputs":[{"name":"tableid","type":"uint256"}],"name":"reNotarize","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x47038556"},{"constant":false,"inputs":[{"name":"tableid","type":"uint256"}],"name":"finishNotarize","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xba406757"}];
var tbmgr= web3.eth.contract(tbmgrabi).at(register.get("tableManage2"));


wait(
    bitcoin.setTableMgr(tableMgrAdddress,{from:eth.accounts[0]})
);

wait(
    tbmgr.setTokenAddr(bitcoin.address,{from:eth.accounts[0]})
);
var table=tbmgr;

console.log("创建桌子 加入桌子 玩家准备 游戏开始 结算 离开桌子 测试")
tableid = test_createTable();
test_joinTable(tableid);
test_start()
test_startGame()
test_settle()
table_leave()
console.log("创建桌子 加入桌子 玩家准备 游戏开始 结算 离开桌子 测试 完成")

return;
function table_leave(num){
    test_leave()

}
function test_leave(){
    console.log("table leave test start");
    var success=0
    table.leave({from:eth.accounts[A]})
    if (emptyaddress(table.getPlayerInfo(eth.accounts[A])[1])){
        console.log("address:"+eth.accounts[A]+" table leave success");
        success++;
    }

    table.leave({from:eth.accounts[B]})
    if (emptyaddress(table.getPlayerInfo(eth.accounts[B])[1])){
        console.log("address:"+eth.accounts[B]+" table leave success")
        success++;
    }

    table.leave({from:eth.accounts[C]})
    if (emptyaddress(table.getPlayerInfo(eth.accounts[C])[1])){
        console.log("address:"+eth.accounts[C]+" table leave success")
        success++;
    }
    console.log("table leave test succ");
}
function test_submitNotary(){
    console.log("公证者提交结算 测试 start")

}
function test_createTable(){
    console.log("createTable test start!")
    tableid = tbmgr.getPlayerTable( {from:eth.accounts[A]} );
    if(tableid > 0){
        console.log("createTable test success:"+tableid)
        return tableid;
    }
    succ = tbmgr.createTable.call(3,3,100,2,{from:eth.accounts[A]});
    if(succ!=""){
        console.log("创建桌子失败:"+succ);
        process.exit(0);
    }
  
    wait(
        tbmgr.createTable(3,3,100,2,{from:eth.accounts[A],gas:100000000})
    );
    
    
    tableid = tbmgr.getPlayerTable( {from:eth.accounts[A]} );
    
    if(tableid == 0){

       console.log("创建桌子失败:");
        process.exit(0);

    }
    console.log("createTable test success:"+tableid)
    return tableid;
 
}
function test_joinTable(tableid){
    console.log("joinTable test start!");
    needchips = table.needChips.call(tableid);

    
    if(emptyaddress(table.getPlayerInfo(eth.accounts[A])[1])){
        wait(
            bitcoin.joinTable(tableid,needchips,{from:eth.accounts[A],gas:100000000})
        );
        if(emptyaddress(table.getPlayerInfo(eth.accounts[A])[1])){
            console.log("address:"+eth.accounts[A]+"加入桌子失败!");
            process.exit(0);
        } else {
            console.log("address:"+eth.accounts[A]+"加入桌子,余额:"+tbmgr.balanceOf(eth.accounts[A]));
        }
    }
    if(emptyaddress(table.getPlayerInfo(eth.accounts[B])[1])){
        wait(
            bitcoin.joinTable(tableid,needchips,{from:eth.accounts[B],gas:100000000})
        );
        if(emptyaddress(table.getPlayerInfo(eth.accounts[B])[1])){
            console.log("address:"+eth.accounts[B]+"加入桌子失败!");
            process.exit(0);
        }else {
            console.log("address:"+eth.accounts[B]+"加入桌子,余额:"+tbmgr.balanceOf(eth.accounts[B]));
        }
    }
    if(emptyaddress(table.getPlayerInfo(eth.accounts[C])[1])){
        wait(
            bitcoin.joinTable(tableid,needchips,{from:eth.accounts[C],gas:100000000})
        );
        if(emptyaddress(table.getPlayerInfo(eth.accounts[C])[1])){
            console.log("address:"+eth.accounts[C]+"加入桌子失败!");
            process.exit(0);
        }else {
            console.log("address:"+eth.accounts[C]+"加入桌子,余额:"+tbmgr.balanceOf(eth.accounts[C]));
        }
    }

    // ra = table.getPlayerInfo(eth.accounts[A])
    
    // rb = table.getPlayerInfo(eth.accounts[B])
    
    // rc = table.getPlayerInfo(eth.accounts[C])
    console.log("座位:")
    console.log(tbmgr.getSeats({from:eth.accounts[A]}))
    // console.log(ra);
    // console.log(rb);
    // console.log(rc);
    // process.exit(0)
    console.log("jointable test success!")
}
function test_start(){
    console.log("table start test start!")
    ra = table.getPlayerInfo(eth.accounts[A]);
    if(ra[3]==0){
        wait(
            table.start(table.getCurrentHand({from:eth.accounts[1]}),{from:eth.accounts[A]})
        );
        ra = table.getPlayerInfo(eth.accounts[A]);
        if(ra[3] ==1 ){
            console.log("address:"+eth.accounts[A]+" start success")
        } else {
            console.log("address:"+eth.accounts[A]+" start fail");
            process.exit(0);
        }
    }

    rb = table.getPlayerInfo(eth.accounts[B]);
    if(rb[3]==0){
        wait(
            table.start(table.getCurrentHand({from:eth.accounts[1]}),{from:eth.accounts[B]})
        );
        rb = table.getPlayerInfo(eth.accounts[B]);
        if(rb[3] ==1 ){
            console.log("address:"+eth.accounts[B]+" start success")
        } else {
            console.log("address:"+eth.accounts[B]+" start fail");
            process.exit(0);
        }
    }
    rc = table.getPlayerInfo(eth.accounts[C]);
    if(rc[3]==0){
        wait(
            table.start(table.getCurrentHand({from:eth.accounts[1]}),{from:eth.accounts[C]})
        );
        rc = table.getPlayerInfo(eth.accounts[C]);
        if(rc[3] ==1 ){
            console.log("address:"+eth.accounts[C]+" start success")
        } else {
            console.log("address:"+eth.accounts[C]+" start fail");
            process.exit(0);
        }
    }

    console.log("table start test success!")

}

function test_startGame(){
    console.log("startGame test start!");
    if(emptyaddress(table.startPlayer({from:eth.accounts[A]}))){
        console.log("startGame 失败:已准备的玩家数量不够");
        process.exit(0);
    }
    succ = table.startGame(tbmgr.getCurrentHand.call({from:eth.accounts[A]}),{from:table.startPlayer({from:eth.accounts[A]})})
    if(!succ){
        console.log("startGame 失败:"+succ);
        process.exit(0);
    }
    wait(
        table.startGame(tbmgr.getCurrentHand.call({from:eth.accounts[A]}),{from:table.startPlayer({from:eth.accounts[A]})})
    );
    tbInfo = table.getTableInfo(tbmgr.getPlayerTable({from:eth.accounts[A]}));
    if (tbInfo[4] == 1){
        console.log("startGname test success!");
    } else {
        console.log("startGame test faild!");
        process.exit(0);
    }

}

function test_settle(){
    console.log("结算测试 start!");

    var data = genSettle(table.address,table.getCurrentHand({from:eth.accounts[A]}).toString()*1);
    //"0x"+data.toString("hex")
    ret = table.settle.call("0x"+data.toString("hex"),{from:eth.accounts[A]});
    if(ret != ""){
        console.log("结算 失败:"+ret);
        return;
    }
    
    txhash = table.settle("0x"+data.toString("hex"),{from:eth.accounts[A],gas:100000000});
    wait(txhash);
    console.log("预结算成功:"+txhash)
    if (table.getTableInfo(tbmgr.getPlayerTable({from:eth.accounts[A]}))[4] !=0){
        console.log("结算 失败!");
        console.log(table.getTableInfo(tbmgr.getPlayerTable({from:eth.accounts[A]})));
        process.exit(0);
    }
    console.log("结算测试 success!");
}
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

function genSettle(tbaddress,hand){
    //console.log(tbaddress+"  "+hand)
    var data=[tbaddress,hand,[ [0,1,33],[1,0,22],[2,0,11] ] ];
    var rlpdata=utils.rlp.encode(data);
    var hash = utils.keccak(rlpdata);

    //console.log(utils.privateToAddress("0x0ce9f0b80483fbae111ac7df48527d443594a902b00fc797856e35eb7b12b4be").toString("hex"))
    
    var signA = utils.ecsign(hash,_USERS[A].pri);
    var signB = utils.ecsign(hash,_USERS[B].pri);
    var signC = utils.ecsign(hash,_USERS[C].pri);

    var signAbuf = Buffer.concat([signA["r"],signA["s"],utils.toBuffer(signA["v"])]);
    var signBbuf = Buffer.concat([signB["r"],signB["s"],utils.toBuffer(signB["v"])]);
    var signCbuf = Buffer.concat([signC["r"],signC["s"],utils.toBuffer(signC["v"])]);
    var signs = Buffer.concat([signAbuf,signBbuf,signCbuf]);
    var msg  = Buffer.concat([signs,rlpdata]);
//    console.log("sginA:");
  //  console.log(signA)
    //console.log("sgin.hash:"+hash.toString("hex"));
    // console.log("sgin.keccak256:"+utils.keccak256(rlpdata).toString("hex"))
    // console.log("sgin.keccak:"+utils.keccak(rlpdata).toString("hex"))
    // console.log("sgin.sha256:"+utils.sha256(rlpdata).toString("hex"))

    return msg;
}
//检查合法
function checkUsers(){
    for(i=0;i<_USERS.length;i++){
        if(_USERS[i].address != "0x"+utils.pubToAddress(utils.privateToPublic(_USERS[i].pri)).toString("hex")){
            console.log("错误的账户配置:"+_USERS[i].address);
            return false;
        }   
    }
    return true;
}