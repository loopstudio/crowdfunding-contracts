import { task } from "hardhat/config";
import { utils } from "ethers";

// example: npx hardhat pledge --goal 1 --campaign-id 5 --address 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 --network localhost

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
