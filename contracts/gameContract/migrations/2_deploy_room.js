var Croom= artifacts.require("./CroomManager.sol");

module.exports = function(deployer, network, accounts) {
    deployer.then(function() {
        return deployer.deploy(Croom,"CroomManagertest",3,10,2000,16,1,{value:1000000*1e18});
    });
};

