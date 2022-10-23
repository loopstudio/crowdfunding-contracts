import { ethers, deployments, network } from "hardhat";
import { networkConfig } from "../../helper-hardhat-config";

import { Crowdfunding } from "../../typechain-types/Crowdfunding";

describe("Crowdfunding", function () {
  let crowdfunding: Crowdfunding;

  let chainId = network.config.chainId || HARDHAT_NETWORK_ID;
  let currentNetworkConfig = networkConfig[chainId];

  before(async function () {
    await deployments.fixture(["crowdfunding"]);
    crowdfunding = await ethers.getContract("Crowdfunding");
  });
});
