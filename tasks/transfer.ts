import { utils } from "ethers";
import { task } from "hardhat/config";

task("transfer", "Transfers a given amount to a specific address")
  .addParam("tokenaddress", "The contract's address")
  .addParam("account", "The account's address")
  .addParam("amount", "The given amount")
  .setAction(async (taskArgs, hre) => {
    const { amount, account, tokenaddress } = taskArgs;

    const LoopToken = await hre.ethers.getContractFactory("LoopToken");
    const loopToken = LoopToken.attach(tokenaddress);

    const transfer = await loopToken.transfer(
      account,
      utils.parseEther(amount)
    );

    if (transfer) {
      console.log(`Transaction completed`);
      console.log(`Transferred: ${amount} LT to ${account}`);
    }
  });
