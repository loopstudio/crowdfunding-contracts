import { task } from "hardhat/config";
import { utils } from "ethers";
import moment from "moment";

task("launch", "Launch a campaign")
  .addParam("address", "ERC20 token address")
  .addParam("goal", "Amount of tokens needed to meet the campaign's goal.")
  .setAction(async (taskArgs, hre) => {
    const { address, goal } = taskArgs;
    const start = moment().add(1, "day");
    const end = moment().add(21, "day");

    const Crowdfunding = await hre.ethers.getContractFactory("Crowdfunding");
    const crowdfunding = Crowdfunding.attach(address);

    const launch = await crowdfunding.launch(
      utils.parseEther(goal),
      start.unix(),
      end.unix()
    );

    if (launch) {
      console.log("Campaign launched");
    }
  });
