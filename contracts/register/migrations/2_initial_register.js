
const register = artifacts.require("register");
module.exports = function(deployer){

  deployer.then(function(){
    return deployer.deploy(register);
  });
}
