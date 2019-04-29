const Gametoken = artifacts.require("Gametoken");
const authority = artifacts.require("Authority");
module.exports = function(deployer){
  var gameToken,authToken
  deployer.then(function(){
    return deployer.deploy(Gametoken,{value:1000000000000000000000000000});
  }).then(function(result){
    gameToken = result;
    return deployer.deploy(authority);
  }).then(function(result){
    authToken = result;
  }).then(function(result){
    gameToken.setAuthority(authToken.address);
    authToken.grantContractAuth(gameToken.address);
  });
}
