import { task } from "hardhat/config";
import { utils } from "ethers";

task("pledge", "Pledge a campaign")
  .addParam("address", "Crowdfunding contract address.")
  .addParam("campaignId", "Campaign ID.")
  .addParam("goal", "Amount of tokens to be pledged.")
  .setAction(async (taskArgs, hre) => {
    const { address, campaignId, goal } = taskArgs;

    const Crowdfunding = await hre.ethers.getContractFactory("Crowdfunding");
    const crowdfunding = Crowdfunding.attach(address);

    const pledge = await crowdfunding.pledge(
      utils.hexlify(+campaignId),
      utils.parseEther(goal)
    );

    if (pledge) {
      console.log("Pledge made successfully");
    }
  });
