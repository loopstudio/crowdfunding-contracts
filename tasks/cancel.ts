import { task } from "hardhat/config";
import { utils } from "ethers";

task("cancel", "Cancel a campaign")
  .addParam("address", "Crowdfunding contract address.")
  .addParam("campaignId", "Campaign ID.")
  .setAction(async (taskArgs, hre) => {
    const { address, campaignId } = taskArgs;

    const Crowdfunding = await hre.ethers.getContractFactory("Crowdfunding");
    const crowdfunding = Crowdfunding.attach(address);

    const cancel = await crowdfunding.cancel(utils.hexlify(+campaignId));

    if (cancel) {
      console.log("Campaign successfully cancelled");
    }
  });
