import { Contract } from "ethers";
import { ethers, deployments } from "hardhat";

export async function deployCrowdfundingFixture(): Promise<{
  crowdfunding: Contract;
  token: Contract;
}> {
  await deployments.fixture(["crowdfunding", "erc20"]);

  const crowdfunding = await ethers.getContract("Crowdfunding");
  const token = await ethers.getContract("LoopToken");

  return { crowdfunding, token };
}
