const DecentralBank = artifacts.require('DecentralBank');


module.exports=async function(deployer, network, accounts){

    await deployer.deploy(DecentralBank)
    const decentralBank = await DecentralBank.deployed()
};