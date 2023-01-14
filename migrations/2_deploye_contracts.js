const Election = artifacts.require('Election');


module.exports=async function(deployer, network, accounts){

    await deployer.deploy(Election)
};