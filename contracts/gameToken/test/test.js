
const Web3 = require('web3');
const  Tx = require('ethereumjs-tx')
const interabi = require('./interabi')
const registerabi = require('./registerabi')
const luaabi =require('./luaabi')
const croomabi = require('./croomabi')
const config = require('./config.js')
console.log(config.users)
var host = "http://114.67.7.100:8545"
//host = "http://192.168.0.211:8545"
var web3 = new Web3(new Web3.providers.HttpProvider(host));

var register= web3.eth.contract(registerabi).at("0x1000000000000000000000000000000000000003");

var inter =web3.eth.contract(interabi).at(register.get("InterManager"));
var croom=web3.eth.contract(croomabi).at(register.get("CroomManagertest"))


var lua = web3.eth.contract(luaabi).at("0x71fba69b1d33a783b92ab92d25bc835228567a84")
// var data = lua.setfile.getData("game.lua","0xff385bb0b3cdb267b5abebaa9c9f2321821e5506608a39a139455c1769c0a10f")
// console.log(getRawTransaction({from:lua.owner(),to:lua.address,data:data}))

data = croom.setluaAddress.getData(lua.address)
//console.log(getRawTransaction({from:croom.owner(),to:croom.address,data:data}))

console.log(
	getRawTransaction({from:"0x28b8d733800ffb64a41eaa59470917a96aab51f0",to:"0x197383d00ccdfb0fbdeccc14006b3fc096578bb6",value:100000000000000000000000})
)
senTransaction({from:"",to:croom.address,data:croom.leaveTable.getData()})

function getRawTransaction(options){
    from = options.from;
    to = options.to?options.to:"";
    value = options.value?options.value:0;
    data =options.data?options.data:"";
    gas = options.gas?options.gas:10000000;
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
	tx.sign(config.users[from])
	var serializeTx = tx.serialize()
	
	return "0x"+serializeTx.toString('hex')
}
function senTransaction(options){
    from = options.from;
    to = options.to?options.to:"";
    value = options.value?options.value:0;
    data =options.data?options.data:"";
    gas = options.gas?options.gas:10000000;
    gasPrice = options.gasPrice?options.gasPrice:50000000000;

	var rawTx = {
		nonce:web3.eth.getTransactionCount(from),
		gasPrice:gasprice,
		to:to,
		value:value,
		gasLimit:gas,
		data:data
	}
	var tx = new Tx(rawTx)
	tx.sign(web3.users[from])
	var serializeTx = tx.serialize()
	console.log(rawTx)
	return web3.eth.sendRawTransaction("0x"+serializeTx.toString('hex'))
}
