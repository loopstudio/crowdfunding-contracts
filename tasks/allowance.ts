import { utils } from "ethers";
import { task } from "hardhat/config";

task("allowance", "Allowance for a given account")
  .addParam("tokenaddress", "The token contract's address")
  .addParam("account", "The account's address to be allowed")
  .addParam("amount", "The given amount")
  .setAction(async (taskArgs, hre) => {
    const { amount, account, tokenaddress } = taskArgs;

    const LoopToken = await hre.ethers.getContractFactory("LoopToken");
    const loopToken = LoopToken.attach(tokenaddress);

    const approve = await loopToken.approve(account, utils.parseEther(amount));

    if (approve) {
      console.log(`Transaction completed`);
      console.log(`Allowed: ${amount} LT to ${account}`);
    }
  });
