const AuthTest = artifacts.require("../contracts/AuthTest.sol");


contract('AuthTest',  (accounts) => {


    let authTest;
    let auth=null;
    let eth=web3.eth;
    let gasPrice = 1000;
    it("账户余额足够+未初始化合约=>调用合约(扣费用户)",async function(){
        authTest = await AuthTest.new()
        //console.log("new authTest:"+authTest.address)

        var value = await web3.eth.getBalance(accounts[0]);
        //console.log("value1:"+value)
        receipt =  await authTest.setAuthConstract("0x1000000000000000000000000000000000000001",{from:accounts[5],gasPrice:gasPrice});
        //AuthConstract = await authTest.getAuthConstract();
        var value2 = await web3.eth.getBalance(accounts[0]);
        //console.log("authcontract:"+Auth)
        //console.log("value2:"+value2)
        //console.log(receipt)
        
        //console.log(receipt)
        assert.equal(value, value2*1+(gasPrice*receipt.receipt.gasUsed), "用户扣费失败");
        return;
    });

    it("账户余额足够+已初始化合约+白名单用户+合约余额不足=>调用合约(调用失败)",async function(){
        var abi = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"changeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newNext","type":"address"}],"name":"setNewAuthority","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getNextAuthority","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"setPayer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"contractAddr","type":"address"}],"name":"getPayer","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"price","type":"uint256"},{"name":"gaslimit","type":"uint64"}],"name":"setGas","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"contractAddr","type":"address"}],"name":"getGas","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"contractAddr","type":"address"}],"name":"getContractInfo","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"grant","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"revoke","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"contractAddr","type":"address"},{"name":"addr","type":"address"}],"name":"getAuth","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];
        auth = new web3.eth.Contract(abi,"0x1000000000000000000000000000000000000001")
        txhash = await authTest.setGas(gasPrice,10000000,{gas:10000000});
        //console.log(txhash)
        authinfo = await auth.methods.getContractInfo(authTest.address).call();
        //console.log(authinfo)
        assert.equal(authinfo[1], gasPrice, "合约初始化失败");
        try{
            receipt =  await authTest.setAuthConstract("0x1000000000000000000000000000000000000001",{from:accounts[5],gasPrice:gasPrice});
            assert.equal("tx success", "tx fail", "合约扣费 合约余额不足交易也成功");
        } catch (e){
                //调到这里是正常
        }

    });

    it("账户余额足够+已初始化合约+白名单用户+合约余额足够=>调用合约(扣费合约)",async function(){

        await web3.eth.sendTransaction({from:accounts[0],to:authTest.address,value:100000000000000000})
        //txhash = await authTest.setGas(gasPrice,10000000,{gas:10000000});
        //console.log(txhash)
        //authinfo = await auth.methods.getContractInfo(authTest.address).call();
        //console.log(authinfo)
        //assert.equal(authinfo[1], gasPrice, "合约初始化失败");
        try{
            var value = await web3.eth.getBalance(authTest.address);

            receipt =  await authTest.setAuthConstract("0x1000000000000000000000000000000000000001",{from:accounts[5],gasPrice:gasPrice});
            //console.log(receipt)
            var value2 = await web3.eth.getBalance(authTest.address);
            assert.equal(value, value2*1+(gasPrice*receipt.receipt.gasUsed), "合约扣费失败");
        } catch (e){
            assert.equal("tx fail", "tx success", "合约扣费失败:"+e);
        }

    });
    it("账户余额足够+已初始化合约+白名单用户+合约余额足够+交易gas,gasPrice置0=>调用合约(扣费合约)",async function(){

        await web3.eth.sendTransaction({from:accounts[0],to:authTest.address,value:100000000000000000})
        //txhash = await authTest.setGas(gasPrice,10000000,{gas:10000000});
        //console.log(txhash)
        //authinfo = await auth.methods.getContractInfo(authTest.address).call();
        //console.log(authinfo)
        //assert.equal(authinfo[1], gasPrice, "合约初始化失败");
        try{
            var value = await web3.eth.getBalance(authTest.address);

            receipt =  await authTest.setAuthConstract("0x1000000000000000000000000000000000000001",{from:accounts[5],gasPrice:0,gas:0});
            //console.log(receipt)
            var value2 = await web3.eth.getBalance(authTest.address);
            assert.equal(value, value2*1+(gasPrice*receipt.receipt.gasUsed), "合约扣费失败");
        } catch (e){
            assert.equal("tx fail", "tx success", "合约扣费失败:"+e);
        }

    });
    it("账户余额足够+已初始化合约+非白名单用户+合约余额足够=>调用合约(调用失败)",async function(){
        //await web3.eth.sendTransaction({from:accounts[1],to:authTest.address,value:100000000000000000000000000})

        //txhash = await authTest.setGas(gasPrice,10000000,{gas:10000000});
        //console.log(txhash)
        //authinfo = await auth.methods.getContractInfo(authTest.address).call();
        //console.log(authinfo)
        //assert.equal(authinfo[1], gasPrice, "合约初始化失败");
        try{
            var value = await web3.eth.getBalance(authTest.address);

            receipt =  await authTest.setAuthConstract("0x1000000000000000000000000000000000000001",{from:accounts[0],gasPrice:gasPrice});
            var value2 = await web3.eth.getBalance(authTest.address);
            assert.equal(value, value2*1+(gasPrice*receipt.receipt.gasUsed), "非法用户调用成功");
        } catch (e){
            //assert.equal("tx fail", "tx success", "合约扣费失败");
        }

    });




});
    function wait(txhash){
        console.log(txhash)
        var r = web3.eth.getTransactionReceipt(txhash);
        if(r==null || r.blockNumber==null){
            
            return wait(txhash);
        }
        return r;
       
    }















    


