import ethUtil from 'ethereumjs-util';

var Table = artifacts.require('../contracts/Warrant.sol');

contract('Warrant', function(accounts) {

  it("test warrant.", async () => {
    const warrant = await Warrant.new();

    assert.equal(warrant.getAddress(), '3N1v2QSgptvvRMFhxtnciiMFKCkMcQiWcy', 'test getAddress failed.');
  });

});
