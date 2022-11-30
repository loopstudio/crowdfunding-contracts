import { utils } from "ethers";
import { task } from "hardhat/config";

task("balance-of", "Displays an account's balance")
  .addParam("tokenaddress", "The token address")
  .addParam("account", "The account address")
  .setAction(async (taskArgs, hre) => {
    const { tokenaddress, account } = taskArgs;

    const LoopToken = await hre.ethers.getContractFactory("LoopToken");
    const loopToken = LoopToken.attach(tokenaddress);

    const balance = await loopToken.balanceOf(account);

    console.log(`Account's balance: ${utils.formatEther(balance)} LT`);
  });
