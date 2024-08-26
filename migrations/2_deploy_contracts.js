var Certification = artifacts.require("./Certification.sol");
var Institution = artifacts.require("./Institution.sol");
var AchievementManagement = artifacts.require("AchievementManagement");
    
module.exports = async function(deployer) {
  // deployer.deploy(Certification);
  

  // Deploy Institution Contract
  deployer.deploy(AchievementManagement);

  
  await deployer.deploy(Institution)
  const institution = await Institution.deployed()

  

  // Deploy Certification Contract
  await deployer.deploy(Certification, institution.address)
  const certification = await Certification.deployed()
};
