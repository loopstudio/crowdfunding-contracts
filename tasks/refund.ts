import { task } from "hardhat/config";
import { utils } from "ethers";

task("refund", "Refund a campaign")
  .addParam("address", "Crowdfunding contract address.")
  .addParam("campaignId", "Campaign ID.")
  .setAction(async (taskArgs, hre) => {
    const { address, campaignId } = taskArgs;

    const Crowdfunding = await hre.ethers.getContractFactory("Crowdfunding");
    const crowdfunding = Crowdfunding.attach(address);

    const refund = await crowdfunding.refund(utils.hexlify(+campaignId));

    if (refund) {
      console.log("Refund made successfully");
    }
  });
