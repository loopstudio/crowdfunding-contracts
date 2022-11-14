import { task } from "hardhat/config";
import moment from "moment";

task("launch", "Launch a campaign")
  .addParam("address", "ERC20 token address")
  .setAction(async (taskArgs, hre) => {
    const { address } = taskArgs;
    const start = moment().add(1, "day");
    const end = moment().add(21, "day");

    const Crowdfunding = await hre.ethers.getContractFactory("Crowdfunding");
    const crowdfunding = await Crowdfunding.deploy(
      address,
      end.unix() - start.unix()
    );

    const launch = await crowdfunding.launch("100", start.unix(), end.unix());

    if (launch) {
      console.log("Campaign launched");
    }
  });
