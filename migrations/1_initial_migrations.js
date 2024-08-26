const Migrations = artifacts.require("Migrations");
// const Institution = artifacts.require("Institution");

// const Certification = artifacts.require("Certification");


module.exports = function (deployer){
    deployer.deploy(Migrations);
    
}