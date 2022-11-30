import { task } from "hardhat/config";
import { utils } from "ethers";

task("launch", "Launch a campaign")
  .addParam("address", "Crowdfunding contract address.")
  .addParam("goal", "Amount of tokens needed to meet the campaign's goal.")
  .addParam("start", "Campaign start date.")
  .addParam("end", "Campaign end date.")
  .setAction(async (taskArgs, hre) => {
    const { address, goal, start, end } = taskArgs;

    const Crowdfunding = await hre.ethers.getContractFactory("Crowdfunding");
    const crowdfunding = Crowdfunding.attach(address);

    const launch = await crowdfunding.launch(
      utils.parseEther(goal),
      start,
      end
    );

    if (launch) {
      console.log("Campaign launched");
    }
  });
