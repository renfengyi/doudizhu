var Lua = artifacts.require("./Lua.sol");
var Tx = require('ethereumjs-tx')
var zlib = require('zlib');
var fs = require('fs');
var path = require('path');//解析需要遍历的文件夹
var Web3 = require('web3');
var filePath = path.resolve('../../');
var gameContract = "CroomManagertest";
var name = "luadoudizhu"; 
var version = "0.1.1";
var users = {	
    "0x7eff122b94897ea5b0e2a9abf47b86337fafebdc":new Buffer("0ce9f0b80483fbae111ac7df48527d443594a902b00fc797856e35eb7b12b4be","hex"), //eth.accounts[0]
    "0x2063d0a0f15a03abd1a3d15601294e3dcb79518b":new Buffer("c66a89cba97914a11da0fe31a8dfaa13bb624efd8b7a59e03397cf3805a4931e","hex"), //eth.accounts[1]
    "0xf9e3a40adf8c6bdecc34dfee57eea62a0edd9d6d":new Buffer("f512940f1e67b82c92d3ff7413212a89a5fd7fab62339fea69f34f55a83fa6bd","hex"), //eth.accounts[2]
    "0x0557d37d996b123fc1799b17b417a6e5d6773038":new Buffer("f1375feeb6aef1838f7e7ef448fe3308e17884fe334e92aa71a5e1642a394768","hex"), //eth.accounts[3]
    "0x1805b7ee5dd340981628b81d5d094c44a027bdc5":new Buffer("971dc4a4e2793bc1b094c0716d8507f9896c03b1f524e354f33aa8f9d2897347","hex"), //eth.accounts[4]
    "0x197383d00ccdfb0fbdeccc14006b3fc096578bb6":new Buffer("f484275631f47849b769267c72d73e9fbb0fcc5445ac1052f5bc30a912b0fd8a","hex"), //eth.accounts[5]
    "0x28b8d733800ffb64a41eaa59470917a96aab51f0":new Buffer("067a1d264d142656d5a70c052f9cf90c35d01da9893d3af2ba49274717f9c340","hex"), //eth.accounts[6]
};
var options ={
	"product":{
		"host":"http://114.67.7.100:8545"
	},
	"development":{
		"host":"http://127.0.0.1:8545"
	},
	"testnet":{
		"host":"http://192.168.0.211:8545"
	},
	"testnet2":{
		"host":"http://192.168.0.212:8545"
	}
}
var web3 = null;
var lua = null;

module.exports = function(deployer) {

  deployer.deploy(Lua,name,version).then(function (instance){
    lua = instance;
    web3= new Web3(options[deployer["network"]]["host"])
	//console.log(lua.constructor.web3.currentProvider)
	//console.log("aaaaaaaaa",web3.eth.getTransactionCount(await lua.owner()))
    return fileDisplay(lua,filePath).then(function(){
        var abi=[{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_contract","type":"address"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"get","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}];
        var contract="0x1000000000000000000000000000000000000003";
        //var register= web3.eth.contract(abi).at(contract);
        var register = new web3.eth.Contract(abi,contract)
        var gameabi = [{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setluaAddress","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]
        //var game = web3.eth.contract(gameabi).at(register.get(gameContract))
        var game; 
        var gameAddress;
        var owner;
        return register.methods.get(gameContract).call().then(function(ret){
           gameAddress = ret;
           game = new web3.eth.Contract(gameabi,gameAddress);
           return game.methods.owner().call();
        }).then(function(ret){
            owner = ret;
            return web3senTransaction(owner,gameAddress,game.methods.setluaAddress(lua.address).encodeABI())
        })
    }).then(function(txhash){
        console.log("txhash",txhash)
        exit(0)
    })
  })
};


async function fileDisplay(lua,filePath){
  //根据文件路径读取文件，返回文件列表
  var readDir = fs.readdirSync(filePath);
    for(var i=0;i<readDir.length;i++){
        filename = readDir[i];

        var filedir = path.join(filePath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        stats = await fs.statSync(filedir)
        if(stats.isDirectory()){
            continue;
        }
        var content = fs.readFileSync(filedir, 'utf-8');
        //console.log(content.length)
        buff = zlib.deflateSync(content)
        await sendTransaction(lua,filename,buff)
    }
}

 async function sendTransaction(lua,filename,buff){
    console.log(filename+"   sendTransaction start  ",buff.length)
    owner = await lua.owner.call();
    if (buff.length > 25000) {
        console.log("file ",filename,"too large")
        exit(1)
    }
    for(var i=0; i*25000<buff.length; i++){

        end = (i+1)*25000;
        if((i+1)*25000>buff.length){
            end = buff.length
        }
        data = buff.slice(i*25000,end);
       // console.log(data.length)
        txhash = await web3senTransaction(owner,owner,"0x"+data.toString("hex"))
		//txhash = provider.({from:owner,to:owner,gas:2000000,input:"0x"+data.toString("hex")})
        await wait(lua,txhash)
        console.log("end"+txhash,await web3.eth.getTransactionCount(owner))

        tx = await lua.setfile(filename,txhash,{nonce:await web3.eth.getTransactionCount(owner)})
        //console.log("92setfile")
        //console.log(tx)
        await wait(lua,tx["tx"])
        console.log("setfile tx:"+tx["tx"])
    }
}
async function web3senTransaction(from,to,data,value=0,gas=10000000,gasprice=50000000000){
    from = from.toLowerCase()
	var rawTx = {
		nonce:await web3.eth.getTransactionCount(from),
		gasPrice:gasprice,
		to:to,
		value:value,
		gasLimit:gas,
		data:data
	}
	
    var tx = new Tx(rawTx)

	tx.sign(users[from])
	var serializeTx = tx.serialize()
    //console.log("0x"+serializeTx.toString('hex'))

    //console.log("nnonce",rawTx.nonce)

    var txhash = null;
    await web3.eth.sendSignedTransaction("0x"+serializeTx.toString('hex')).then(function(receipt){
        txhash = receipt.transactionHash;
    })
    return txhash
}

async function wait(lua,txhash){
	console.log("wait txhash:")
    console.log(txhash)
    owner = await lua.owner.call();
    receipt =  await web3.eth.getTransactionReceipt(txhash);
    while(receipt == null|| receipt.blockNumber==null){
        try{
            receipt =  await web3.eth.getTransactionReceipt(txhash);
        } catch(e) {
            receipt =  await web3.eth.getTransactionReceipt(txhash);
        }
    }
    if(receipt.status !="0x1"){

        console.log("error: "+txhash+" faild")
        exit(1)
    }
}
function exit(code=0){
    process.exit(code)
}