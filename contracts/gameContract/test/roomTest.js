var Web3 = require('web3');
var utils = require('ethereumjs-util');

var host = "http://127.0.0.1:8545";

const commandLineArgs = require('command-line-args')
const optionDefinitions = [
    { name: 'network', alias: 'n', type: String }
]
const options = commandLineArgs(optionDefinitions)

if(options.network == "product"){
    host="http://114.67.7.100:8545";
}


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
var roomAddress = register.get("RoomManager");
if(emptyaddress(roomAddress)){
    console.log("请先部署room");
    return;
}
var currencyAddress=register.get("CurrencyToken");
if(emptyaddress(currencyAddress)){
    console.log("请先部署currency 项目");
    return;
}

var tbmgrabi=[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x06fdde03"},{"constant":true,"inputs":[],"name":"notaryManage","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x2b8dfaea"},{"constant":false,"inputs":[],"name":"_setPayer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x39031bd4"},{"constant":true,"inputs":[],"name":"authorityAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x3c695d4e"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"addr","type":"address"}],"name":"_setContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x4ce401ac"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"_grant","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x5d8aa11c"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"myTable","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x71fe9d24"},{"constant":true,"inputs":[],"name":"tableFunAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x787ae6d4"},{"constant":true,"inputs":[],"name":"interManage","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x7a54ea8b"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x8da5cb5b"},{"constant":false,"inputs":[{"name":"price","type":"uint256"},{"name":"gaslimit","type":"uint64"}],"name":"_setGas","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x97b25f4b"},{"constant":true,"inputs":[],"name":"tokenAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x9d76ea58"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"_setauthority","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x9e834d40"},{"constant":false,"inputs":[{"name":"name","type":"string"}],"name":"_getContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xb37e48e3"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tableList","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xce8b4afc"},{"constant":true,"inputs":[],"name":"tableNonce","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xd1323d7c"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"_revoke","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xd24088cf"},{"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor","signature":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"creator","type":"address"},{"indexed":false,"name":"tableid","type":"uint256"},{"indexed":false,"name":"minimum","type":"uint256"},{"indexed":false,"name":"maximum","type":"uint256"},{"indexed":false,"name":"needChips","type":"uint256"},{"indexed":false,"name":"smallBlind","type":"uint256"}],"name":"CreateTable","type":"event","signature":"0xdcc30eece90665cbe2f4963a7390e30c42b657e46ba3b662fb1aca6e660003c4"},{"anonymous":false,"inputs":[{"indexed":false,"name":"creator","type":"address"},{"indexed":false,"name":"tableid","type":"uint256"}],"name":"DestroyTable","type":"event","signature":"0x8837499d14ad4c37e77a5e45b46adaf947f6a011e19a11e8767aa2b5f740d1e0"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tableid","type":"uint256"},{"indexed":false,"name":"number","type":"uint256"}],"name":"SelectInter","type":"event","signature":"0xc91adf234ccf28cd1ff9e87081f501b56451f16dea40481ceb23bf1fbd396ca3"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tableid","type":"uint256"},{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"pos","type":"uint256"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Join","type":"event","signature":"0xb52f7d019575ca7e8f1c4f4230a62faa06222575adaae1c8ab6238dd85abe2e6"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"pos","type":"uint256"}],"name":"Start","type":"event","signature":"0xcfb9c5312b25ec7b809d61e638df25f749eae5d5c25399e1c93d1d319bfd5821"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"pos","type":"uint256"}],"name":"SelectStarter","type":"event","signature":"0xdb3f22c5a13e1333a3d5ae69967795103d0c4c3fa9c108d14dc8b022cd635dd1"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"pos","type":"uint256"}],"name":"Discard","type":"event","signature":"0x41589fb7a60d237058a6082a604907c67d605ff766d1af04e817a25df1d2b229"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"pos","type":"uint256"}],"name":"Leave","type":"event","signature":"0x61a26f7c17d8780c095ccfa67e689a13ee4e06ddce3da18956369f4a396100e8"},{"anonymous":false,"inputs":[{"indexed":false,"name":"player","type":"address"},{"indexed":false,"name":"pos","type":"uint256"},{"indexed":false,"name":"hand","type":"uint256"}],"name":"StartGame","type":"event","signature":"0xca6a93f0d2da1fd97d50b6f382796f7a702e15755639d64dccff3645014c31ea"},{"anonymous":false,"inputs":[{"indexed":false,"name":"hand","type":"uint256"},{"indexed":false,"name":"playingNum","type":"uint256"}],"name":"Settle","type":"event","signature":"0x88a84ea6dd274b386afd27dbbe11b6192b25017f5e60bb8c4053dfddb45c294d"},{"anonymous":false,"inputs":[{"indexed":false,"name":"player","type":"address"},{"indexed":false,"name":"pos","type":"uint256"},{"indexed":false,"name":"hand","type":"uint256"},{"indexed":false,"name":"flag","type":"uint256"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"SettleItemData","type":"event","signature":"0x9539873d630ab24eef17301357dbc4b7ad09b855cef9b688872b23e8e2f1c141"},{"anonymous":false,"inputs":[{"indexed":false,"name":"player","type":"address"},{"indexed":false,"name":"pos","type":"uint256"},{"indexed":false,"name":"hand","type":"uint256"}],"name":"SettlePlayerAbsent","type":"event","signature":"0x2aa71df823fecef58f7ce0dc8d7a8eaaa92c4cd4ddbdbbfd07c42389303cbdf4"},{"anonymous":false,"inputs":[{"indexed":false,"name":"player","type":"address"},{"indexed":false,"name":"hand","type":"uint256"}],"name":"SettlePlayer","type":"event","signature":"0x1b578cf939b009e8acf7313adb11aebe1aafed08f92004492157cbfc430db642"},{"anonymous":false,"inputs":[{"indexed":false,"name":"submitter","type":"address"},{"indexed":false,"name":"datalength","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"SettleData","type":"event","signature":"0x9abdde1f678192ef13fd8eb5213d3818927490d138525164eefe9cf034d4086e"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"datasrc","type":"uint256"},{"indexed":false,"name":"errcode","type":"uint256"}],"name":"SettleError","type":"event","signature":"0x59fc969eb4e8fbf8a3fcedeaa0a3772b3684e76585dedf5295812fedd73c3a80"},{"anonymous":false,"inputs":[{"indexed":false,"name":"hand","type":"uint256"}],"name":"FinishNotary","type":"event","signature":"0xf3158feeab126e9d61db9e8e9e3625766ac21d08f68fa8c30482f7340b742cfb"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setauthority","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xb8924f4f"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setTokenAddr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x2ebd1e28"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setInterAddr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x1f0d57d7"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setNotaryAddr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x6ab2c201"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setTableFunAddr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x08f97d5b"},{"constant":true,"inputs":[],"name":"startPlayer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xa3be6f4f"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x70a08231"},{"constant":true,"inputs":[],"name":"getPlayerTable","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x39a6221b"},{"constant":true,"inputs":[{"name":"tableid","type":"uint256"}],"name":"getTable","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x195e251f"},{"constant":true,"inputs":[],"name":"tableid","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xb0fc03bc"},{"constant":true,"inputs":[],"name":"seats","outputs":[{"name":"ret","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x9c5655d6"},{"constant":true,"inputs":[{"name":"tableid","type":"uint256"}],"name":"getTablePlayingPlayers","outputs":[{"name":"number","type":"uint256"},{"name":"players","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xe11a84cd"},{"constant":false,"inputs":[{"name":"minimum","type":"uint256"},{"name":"maximum","type":"uint256"},{"name":"needChips","type":"uint256"},{"name":"smallBlind","type":"uint256"}],"name":"createTable","outputs":[{"name":"ret","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xa4dd19a5"},{"constant":false,"inputs":[],"name":"destroyTable","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x15e9cf56"},{"constant":true,"inputs":[{"name":"pagenum","type":"uint256"},{"name":"pagesize","type":"uint256"}],"name":"getTableList","outputs":[{"name":"len","type":"uint256"},{"name":"tblist","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x7ec1d4cf"},{"constant":false,"inputs":[{"name":"number","type":"uint256"}],"name":"applyInter","outputs":[{"name":"ret","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x9761f49a"},{"constant":false,"inputs":[{"name":"number","type":"uint256"}],"name":"reApplyInter","outputs":[{"name":"ret","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xf1c57f27"},{"constant":false,"inputs":[{"name":"interAddress","type":"address"}],"name":"failInter","outputs":[{"name":"ret","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xfddbcc7e"},{"constant":false,"inputs":[{"name":"number","type":"uint256"}],"name":"applyNotarize","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xba9c061a"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"getPlayerInfo","outputs":[{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x59328401"},{"constant":true,"inputs":[],"name":"getCurrentHand","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x3cda2272"},{"constant":true,"inputs":[{"name":"tableid","type":"uint256"}],"name":"currentHand","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x7767c2e0"},{"constant":false,"inputs":[],"name":"quota","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xcebe09c9"},{"constant":true,"inputs":[{"name":"tableid","type":"uint256"}],"name":"needChips","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x57a65691"},{"constant":true,"inputs":[{"name":"tableid","type":"uint256"}],"name":"getTableInfo","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x90dee8dc"},{"constant":false,"inputs":[{"name":"hand","type":"uint32"}],"name":"startGame","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x89f45339"},{"constant":false,"inputs":[{"name":"tableid","type":"uint256"},{"name":"from","type":"address"},{"name":"value","type":"uint256"}],"name":"join","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x7613c1d2"},{"constant":false,"inputs":[{"name":"hand","type":"uint256"}],"name":"start","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x95805dad"},{"constant":false,"inputs":[{"name":"hand","type":"uint256"}],"name":"discard","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x7e8f2b0c"},{"constant":false,"inputs":[{"name":"data","type":"bytes"}],"name":"discard2","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x26d3da79"},{"constant":false,"inputs":[],"name":"leave","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xd66d9e19"},{"constant":false,"inputs":[{"name":"data","type":"bytes"}],"name":"settle","outputs":[{"name":"ret","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xd0322fbf"},{"constant":false,"inputs":[{"name":"tableid","type":"uint256"},{"name":"info","type":"bytes"}],"name":"submitNotary","outputs":[{"name":"ret","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xe6aba8d3"},{"constant":false,"inputs":[{"name":"tableid","type":"uint256"}],"name":"reNotarize","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x47038556"},{"constant":false,"inputs":[{"name":"tableid","type":"uint256"}],"name":"finishNotarize","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xba406757"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"grant","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x70284d19"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"revoke","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x74a8f103"}];
var tbmgr= web3.eth.contract(tbmgrabi).at(register.get("TableManager"));
var currencyabi =[{"constant":false,"inputs":[],"name":"_setPayer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x39031bd4"},{"constant":true,"inputs":[],"name":"authorityAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x3c695d4e"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"addr","type":"address"}],"name":"_setContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x4ce401ac"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"_grant","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x5d8aa11c"},{"constant":true,"inputs":[],"name":"pledgeAddr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x7adbd552"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x8da5cb5b"},{"constant":false,"inputs":[{"name":"price","type":"uint256"},{"name":"gaslimit","type":"uint64"}],"name":"_setGas","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x97b25f4b"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"_setauthority","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x9e834d40"},{"constant":false,"inputs":[{"name":"name","type":"string"}],"name":"_getContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xb37e48e3"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"_revoke","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xd24088cf"},{"constant":true,"inputs":[],"name":"roomAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xd964f29e"},{"constant":true,"inputs":[],"name":"freezeAddr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xee0d5915"},{"constant":true,"inputs":[],"name":"tableMgrAddr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xf0a497f0"},{"inputs":[{"name":"_val","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"constructor","signature":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"code","type":"uint256"}],"name":"ResultCode","type":"event","signature":"0x7ed5a82c702f5582f233fa014850aee6691842dc6e0f0d4c3c5cfdc3af574e1a"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event","signature":"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setauthority","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xb8924f4f"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"}],"name":"transData","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x422810ea"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xa9059cbb"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x70a08231"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"_supply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x18160ddd"},{"constant":true,"inputs":[],"name":"getPleage","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x0b6f6bc1"},{"constant":true,"inputs":[],"name":"getFreezer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x51337408"},{"constant":false,"inputs":[{"name":"_pleageAddr","type":"address"}],"name":"setPledge","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x9d638aca"},{"constant":false,"inputs":[{"name":"_freezeAddr","type":"address"}],"name":"setFreezer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x2c341fe7"},{"constant":false,"inputs":[{"name":"_price","type":"uint256"},{"name":"_contact","type":"string"},{"name":"_pay","type":"string"},{"name":"_enable","type":"bool"}],"name":"setconfig","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x33358d07"},{"constant":true,"inputs":[],"name":"getconfig","outputs":[{"name":"_json","type":"string"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x371be589"},{"constant":false,"inputs":[{"name":"_payer","type":"int256"},{"name":"_account","type":"string"},{"name":"_price","type":"uint256"},{"name":"_amount","type":"uint256"}],"name":"prechange","outputs":[{"name":"err","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xc34f4ac8"},{"constant":true,"inputs":[{"name":"user","type":"address"}],"name":"getchange","outputs":[{"name":"_json","type":"string"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x86c3a4f9"},{"constant":true,"inputs":[{"name":"_txid","type":"uint256"}],"name":"getchangebyid","outputs":[{"name":"_json","type":"string"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x6024069e"},{"constant":true,"inputs":[{"name":"page","type":"uint256"},{"name":"pagesize","type":"uint256"}],"name":"listchange","outputs":[{"name":"_json","type":"string"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x764a2c66"},{"constant":false,"inputs":[{"name":"_status","type":"int256"}],"name":"setchange","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x9f09ec0f"},{"constant":false,"inputs":[{"name":"_txid","type":"uint256"},{"name":"_status","type":"int256"}],"name":"subchange","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x1638a068"},{"constant":false,"inputs":[{"name":"_index","type":"uint256"}],"name":"balanceOfnum","outputs":[{"name":"_json","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x2d967bf6"},{"constant":false,"inputs":[{"name":"_agentAddr","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_contact","type":"string"},{"name":"_token2MoneyRate","type":"string"}],"name":"submitExchangeToFiatMoney","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x701f8809"},{"constant":false,"inputs":[{"name":"roomMgr","type":"address"}],"name":"setRoomMgr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x7e8839a1"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xf5537ede"},{"constant":false,"inputs":[{"name":"tableMgr","type":"address"}],"name":"setTableMgr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x7e119b9c"},{"constant":false,"inputs":[{"name":"tableid","type":"uint256"}],"name":"joinTexasTable","outputs":[{"name":"ret","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xd07568ec"},{"constant":false,"inputs":[{"name":"tableid","type":"uint256"},{"name":"value","type":"uint256"}],"name":"joinTable","outputs":[{"name":"ret","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x1ff7efc0"},{"constant":false,"inputs":[{"name":"tableid","type":"uint256"},{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferForTM","outputs":[{"name":"ret","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x677272d7"}];
var currency = web3.eth.contract(currencyabi).at(currencyAddress)
var roomabi=[{"constant":true,"inputs":[],"name":"notaryManage","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"_setPayer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"authorityAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"addr","type":"address"}],"name":"_setContract","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"_grant","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"interManage","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"price","type":"uint256"},{"name":"gaslimit","type":"uint64"}],"name":"_setGas","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tokenAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"_setauthority","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"}],"name":"_getContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"_revoke","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"minimum_","type":"uint32"},{"name":"maximum_","type":"uint32"},{"name":"smallBlind_","type":"uint256"},{"name":"needChips_","type":"uint256"},{"name":"zone_","type":"uint8"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"playerAddr","type":"address"},{"indexed":false,"name":"roomAddr","type":"address"}],"name":"JoinRoom","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"playerAddr","type":"address"},{"indexed":false,"name":"roomAddr","type":"address"}],"name":"JoinSittingQueen","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"roomAddr","type":"address"},{"indexed":false,"name":"tableid","type":"uint256"}],"name":"AllotTable","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"roomAddr","type":"address"},{"indexed":false,"name":"tbNum","type":"uint256"},{"indexed":false,"name":"playerAddr","type":"address"},{"indexed":false,"name":"pos","type":"uint256"}],"name":"LeaveTable","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"roomAddr","type":"address"},{"indexed":false,"name":"tbNum","type":"uint256"},{"indexed":false,"name":"playerAddr","type":"address"},{"indexed":false,"name":"pos","type":"uint256"},{"indexed":false,"name":"hand","type":"uint256"}],"name":"Start","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"roomAddr","type":"address"},{"indexed":false,"name":"tbNum","type":"uint256"},{"indexed":false,"name":"playerAddr","type":"address"},{"indexed":false,"name":"pos","type":"uint256"},{"indexed":false,"name":"hand","type":"uint256"}],"name":"SelectStarter","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"roomAddr","type":"address"},{"indexed":false,"name":"tbNum","type":"uint256"},{"indexed":false,"name":"playerAddr","type":"address"},{"indexed":false,"name":"pos","type":"uint256"},{"indexed":false,"name":"hand","type":"uint256"}],"name":"StartGame","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"roomAddr","type":"address"},{"indexed":false,"name":"tbNum","type":"uint256"},{"indexed":false,"name":"playerAddr","type":"address"},{"indexed":false,"name":"pos","type":"uint256"},{"indexed":false,"name":"hand","type":"uint256"}],"name":"Discard","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"nrAddr","type":"address"},{"indexed":false,"name":"datalength","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"SubmmitSettleData","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"roomAddr","type":"address"},{"indexed":false,"name":"tableId","type":"uint256"},{"indexed":false,"name":"datasrc","type":"uint8"},{"indexed":false,"name":"errcode","type":"uint8"}],"name":"SettleError","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"roomAddr","type":"address"},{"indexed":false,"name":"tableId","type":"uint256"},{"indexed":false,"name":"hand","type":"uint256"},{"indexed":false,"name":"pos","type":"uint8"},{"indexed":false,"name":"flag","type":"uint8"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"SettleItemData","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"hand","type":"uint256"},{"indexed":false,"name":"playingNum","type":"uint256"},{"indexed":false,"name":"tableid","type":"uint256"}],"name":"Settle","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tableid","type":"uint256"},{"indexed":false,"name":"number","type":"uint256"}],"name":"SelectInter","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tableid","type":"uint256"},{"indexed":false,"name":"hand","type":"uint256"}],"name":"FinishNotary","type":"event"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setauthority","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setTokenAddr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setInterAddr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setNotaryAddr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setRoomFunAddr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"addChips","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getRoomInfo","outputs":[{"name":"","type":"uint32"},{"name":"","type":"uint32"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getSittingQueen","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tableId","type":"uint256"}],"name":"getTableInfo","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint32"},{"name":"","type":"uint8"},{"name":"","type":"uint256"},{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tableId","type":"uint256"}],"name":"getTablePlayers","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tableId","type":"uint256"}],"name":"getTablePlayingPlayers","outputs":[{"name":"number","type":"uint256"},{"name":"players","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"playerAddr","type":"address"}],"name":"getPlayerInfo","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tableId","type":"uint256"},{"name":"playerAddr","type":"address"}],"name":"isTablePlayingPlayer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tableId","type":"uint256"},{"name":"pos","type":"uint8"}],"name":"getTableSeatInfo","outputs":[{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tableId","type":"uint256"}],"name":"getTableStartPlayer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tableId","type":"uint256"}],"name":"getTableCurrentStatus","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tableId","type":"uint256"}],"name":"getTableCurrentHand","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"openDoor","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"sitDown","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"cancelSitting","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"leaveTable","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"leaveRoom","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableId","type":"uint256"},{"name":"hand","type":"uint32"}],"name":"startGame","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableId","type":"uint256"},{"name":"hand","type":"uint32"}],"name":"start","outputs":[{"name":"ret","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"hand","type":"uint256"}],"name":"discard","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"data","type":"bytes"}],"name":"discard2","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"uint8"},{"name":"sigs","type":"bytes"},{"name":"data","type":"bytes"}],"name":"settle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"data","type":"bytes"}],"name":"playerSettle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableid","type":"uint256"},{"name":"data","type":"bytes"}],"name":"submitNotary","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tableId","type":"uint256"}],"name":"getSubNotorys","outputs":[{"name":"addrs","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tableId","type":"uint256"}],"name":"resetNotoryInfo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"number","type":"uint256"}],"name":"applyInter","outputs":[{"name":"ret","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"number","type":"uint256"}],"name":"applyNotarize","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableid","type":"uint256"}],"name":"finishNotarize","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]
var nrabi = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"nodeid","type":"string"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Register","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"locktime","type":"uint256"}],"name":"ApplyForLock","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"nodeid","type":"string"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"UnRegister","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tableManage","type":"address"},{"indexed":false,"name":"tableid","type":"uint256"},{"indexed":false,"name":"player","type":"address"},{"indexed":false,"name":"number","type":"uint256"}],"name":"ApplyNotory","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"roomAddr","type":"address"},{"indexed":false,"name":"tableId","type":"uint256"},{"indexed":false,"name":"number","type":"uint256"}],"name":"ApplyForNotory","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tableManage","type":"address"},{"indexed":false,"name":"tableid","type":"uint256"},{"indexed":false,"name":"retCode","type":"uint8"},{"indexed":false,"name":"number","type":"uint256"}],"name":"ReNotory","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"roomAddr","type":"address"},{"indexed":false,"name":"tableId","type":"uint256"}],"name":"ResetNotarize","type":"event"},{"constant":false,"inputs":[{"name":"tableMgr","type":"address"}],"name":"setTableMgr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"roomMgr","type":"address"}],"name":"setRoomMgrAddr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"numberOfNotary","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"numberOfUnlockNotary","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"nodeid","type":"string"}],"name":"register","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"tableId","type":"uint256"},{"name":"playerAddr","type":"address"},{"name":"number","type":"uint256"}],"name":"applyNotorys","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"roomAddr","type":"address"},{"name":"tableId","type":"uint256"},{"name":"number","type":"uint256"}],"name":"reApplyForNotorys","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"roomAddr","type":"address"},{"name":"tableId","type":"uint256"},{"name":"nrAddr","type":"address"}],"name":"reportFailNorary","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableid","type":"uint256"}],"name":"reNotarize","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tableid","type":"uint256"}],"name":"finishNotarize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"roomAddr","type":"address"},{"name":"tableId","type":"uint256"}],"name":"resetNotarize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tbManage","type":"address"},{"name":"tableid","type":"uint256"}],"name":"getNotaryList","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"roomAddr","type":"address"},{"name":"tableId","type":"uint256"}],"name":"getRoomTableNotarys","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"notaryAddr","type":"address"}],"name":"getNotaryInfo","outputs":[{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]
var room=web3.eth.contract(roomabi).at(roomAddress)
//var notary= web3.eth.contract(nrabi).at(room.notaryManage({from:owner,gas:10000000}))


////var croom=web3.eth.contract(roomabi).at(register.get("CroomManager"))
// txhash = room.setTokenAddr(currencyAddress,{from:owner,gas:10000000});
// wait(txhash);
// wait(
//     croom.setTokenAddr(currencyAddress,{from:owner,gas:10000000})
// )
// txhash = currency.setRoomMgr(roomAddress,{from:owner,gas:10000000});
// wait(txhash);
// wait(
//     currency.setRoomMgr(croom.address,{from:owner,gas:10000000})
// )
// txhash = currency.setauthority(room.authorityAddress({from:owner}),{from:owner,gas:10000000})
// console.log("setauthority:"+txhash)
// wait(
//     txhash
// );
var authabi=[{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newNext","type":"address"}],"name":"setNewAuthority","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getNextAuthority","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"grantContractAuth","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"revokeContractAuth","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"setPayer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"contractAddr","type":"address"}],"name":"getPayer","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"price","type":"uint256"},{"name":"gaslimit","type":"uint64"}],"name":"setGas","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"contractAddr","type":"address"}],"name":"getGas","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"contractAddr","type":"address"}],"name":"getContractInfo","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"grant","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"revoke","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"getAuth","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]
var auth= web3.eth.contract(authabi).at(room.authorityAddress({from:owner}));

// wait(
//     auth.grantContractAuth(currency.address,{from:owner,gas:10000000})
// );



// wait(
//     currency.setTableMgr(tbmgr.address,{from:owner,gas:100000000})
// );

// wait(
//     tbmgr.setTokenAddr(currency.address,{from:owner,gas:100000000})
// );
var A=1; //账户A
var B=2; //账户B
var C=0;
var D=3;
// var rrrr =room.start.call(room.getTableInfo(room.getPlayerInfo(eth.accounts[A])[1])[0],room.getTableInfo(room.getPlayerInfo(eth.accounts[A])[1])[1],{from:eth.accounts[A],gas:1000000000,gasPrice:100000000000000000})

// console.log("r="+rrrr)
// console.log(room.getPlayerInfo(eth.accounts[A]))
// console.log("roomAddress:"+room.address)
// console.log(room.getTableInfo(room.getPlayerInfo(eth.accounts[A])[1]))

// console.log("address:"+eth.accounts[A])

// return
test_init()
// return;
// settle = genSettle();
// console.log("0x"+settle[0].toString("hex"))
// ret=croom.playerSettle.call("0x"+settle[0].toString("hex"),"0x"+settle[1].toString("hex"),{from:eth.accounts[A]});
// croom.playerSettle("0x"+settle[0].toString("hex"),"0x"+settle[1].toString("hex"),{from:eth.accounts[A]});

// console.log("test success:"+ret)

// return
//return;
succ = room.openDoor.call({from:eth.accounts[A],gas:10000000});
if(!succ){
    console.log("用户eth.accounts["+A+"]:"+eth.accounts[A]+"加入房间失败");
    console.log("balanceOf:"+currency.balanceOf(eth.accounts[A]));
    console.log("PlayerInfo:")
    console.log(room.getPlayerInfo(eth.accounts[A]));
    return ;
}
succ = room.openDoor.call({from:eth.accounts[B],gas:10000000});
if(!succ){
    console.log("用户eth.accounts["+B+"]:"+eth.accounts[B]+"加入房间失败");
    console.log("balanceOf:"+currency.balanceOf(eth.accounts[B]));
    console.log("PlayerInfo:")
    console.log(room.getPlayerInfo(eth.accounts[B]));
    return ;
} 
wait(room.openDoor({from:eth.accounts[A],gas:10000000}));
wait(room.openDoor({from:eth.accounts[B],gas:10000000}));


succ = room.sitDown.call({from:eth.accounts[A],gas:10000000});
if(!succ){
    console.log("用户A eth.accounts["+A+"]:"+eth.accounts[A]+" sitDown失败");
    console.log("balanceOf:"+currency.balanceOf(eth.accounts[A]));
    console.log("PlayerInfo:")
    console.log(room.getPlayerInfo(eth.accounts[A]));
    return ;
} 
succ = room.sitDown.call({from:eth.accounts[B]});
if(!succ){
    console.log("用户B eth.accounts["+B+"]:"+eth.accounts[B]+" sitDown失败");
    console.log("balanceOf:"+currency.balanceOf(eth.accounts[B]));
    console.log("PlayerInfo:")
    console.log(room.getPlayerInfo(eth.accounts[B]));
    return ;
}
wait(room.sitDown({from:eth.accounts[A]}));
wait(room.sitDown({from:eth.accounts[B]}));

succ = room.start.call(room.getTableInfo(room.getPlayerInfo(eth.accounts[A])[1])[0],room.getTableInfo(room.getPlayerInfo(eth.accounts[A])[1])[1],{from:eth.accounts[A]})
if(!succ){
    console.log(succ+room.address+"用户A eth.accounts["+A+"]:"+eth.accounts[A]+" 准备失败"+room.getTableInfo(room.getPlayerInfo(eth.accounts[A])[1])[0]+" "+room.getTableInfo(room.getPlayerInfo(eth.accounts[A])[1])[1]);
    console.log("balanceOf:"+currency.balanceOf(eth.accounts[A]));
    console.log("PlayerInfo:")
    console.log(room.getPlayerInfo(eth.accounts[A]));
    return ;
} 
succ = room.start.call(room.getTableInfo(room.getPlayerInfo(eth.accounts[B])[1])[0],room.getTableInfo(room.getPlayerInfo(eth.accounts[B])[1])[1],{from:eth.accounts[B]})
if(!succ){
    console.log("用户B eth.accounts["+B+"]:"+eth.accounts[B]+" 准备失败");
    console.log("balanceOf:"+currency.balanceOf(eth.accounts[B]));
    console.log("PlayerInfo:")
    console.log(room.getPlayerInfo(eth.accounts[B]));
    return ;
}
wait(
    room.start(room.getTableInfo(room.getPlayerInfo(eth.accounts[A])[1])[0],room.getTableInfo(room.getPlayerInfo(eth.accounts[A])[1])[1],{from:eth.accounts[A]})
);
wait(
    room.start(room.getTableInfo(room.getPlayerInfo(eth.accounts[B])[1])[0],room.getTableInfo(room.getPlayerInfo(eth.accounts[B])[1])[1],{from:eth.accounts[B]})
);
var starter = room.getTableStartPlayer(room.getPlayerInfo(eth.accounts[A])[1])
if(emptyaddress(starter)){
    console.log("获取table.starter失败");
    return;
}
succ=room.startGame.call(room.getTableInfo(room.getPlayerInfo(starter)[1])[0],room.getTableInfo(room.getPlayerInfo(starter)[1])[1],{from:starter})
if(!succ){
    console.log("room.startGame 失败");
    return;
}
wait(
    room.startGame(room.getTableInfo(room.getPlayerInfo(starter)[1])[0],room.getTableInfo(room.getPlayerInfo(starter)[1])[1],{from:starter})
);

settle = genSettle();
r = room.playerSettle.call("0x"+settle[0].toString("hex")+settle[1].toString("hex"),{from:starter});

room.playerSettle("0x"+settle[0].toString("hex")+settle[1].toString("hex"),{from:starter});
console.log('room.playerSettle.call("0x'+settle[0].toString("hex")+settle[1].toString("hex")+'"),{from:"'+starter+'"}')
console.log("test success!!"+r)

return
//
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
    console.log("coinbase:"+eth.coinbase)
    val = currency.balanceOf(eth.coinbase,{from:owner,gas:10000000})
    if (val <10000)
    wait(
        currency.transfer(eth.coinbase,1000000,{from:owner,gas:10000000})
    );
    val = currency.balanceOf(eth.accounts[A],{from:owner,gas:10000000})
    if (val <10000)
    wait(
        currency.transfer(eth.accounts[A],1000000,{from:owner,gas:10000000})
    );
    val = currency.balanceOf(eth.accounts[B],{from:owner,gas:10000000})
    if (val <10000)
    wait(
        currency.transfer(eth.accounts[B],1000000,{from:owner,gas:10000000})
    );
    val = currency.balanceOf(eth.accounts[C],{from:owner,gas:10000000})
    if (val <10000)
    wait(
        currency.transfer(eth.accounts[C],1000000,{from:owner,gas:10000000})
    );
    val = currency.balanceOf(eth.accounts[D],{from:owner,gas:10000000})
    if (val <10000)
    wait(
        currency.transfer(eth.accounts[D],1000000,{from:owner,gas:10000000})
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
    var tableid =room.getPlayerInfo(eth.accounts[A])[1].toString()*1
    var hand =room.getTableInfo(tableid)[1].toString()*1
    var data=[room.address,tableid,hand,[ [0,1,3],[1,0,2],[2,0,1] ]];
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
    var tableid =room.getPlayerInfo(eth.accounts[A])[1].toString()*1
    var hand =room.getTableInfo(tableid)[1].toString()*1
    console.log(tableid,hand)
    var data=[room.address,tableid,hand,[ [0,1,2],[1,0,2]]];
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