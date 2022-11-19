import { task } from "hardhat/config";
import { utils } from "ethers";

// example: npx hardhat launch --goal 10 --start 1668864785 --end 1668864966 --address 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 --network localhost

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
