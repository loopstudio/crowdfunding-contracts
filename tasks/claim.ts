import { task } from "hardhat/config";
import { utils } from "ethers";

task("claim", "Claim a campaign")
  .addParam("address", "Crowdfunding contract address.")
  .addParam("campaignId", "Campaign ID.")
  .setAction(async (taskArgs, hre) => {
    const { address, campaignId } = taskArgs;

    const Crowdfunding = await hre.ethers.getContractFactory("Crowdfunding");
    const crowdfunding = Crowdfunding.attach(address);

    const claim = await crowdfunding.claim(utils.hexlify(+campaignId));

    if (claim) {
      console.log("Claim made successfully");
    }
  });
