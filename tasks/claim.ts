import { task } from "hardhat/config";
import { utils } from "ethers";

// example: npx hardhat claim --campaign-id 2 --address 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 --network localhost

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
