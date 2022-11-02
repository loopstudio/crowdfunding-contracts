import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { Crowdfunding } from "../../typechain-types/contracts/Crowdfunding";
import { expect } from "chai";
import { CAMPAIGN_MAX_DURATION, ERC20_ADDRESS } from "../../utils/constants";
import { LoopToken } from "../../typechain-types";
import { deployCrowdfundingFixture } from "./fixtures/deploy-crowfunding";

describe("Crowdfunding: constructor", function () {
  let crowdfunding: Crowdfunding;
  let token: LoopToken;

  beforeEach(async function () {
    ({ crowdfunding, token } = await loadFixture(deployCrowdfundingFixture));
  });

  it("Should revert if max duration is not greater than zero", async () => {
    const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
    await expect(Crowdfunding.deploy(ERC20_ADDRESS, 0)).rejected;
  });

  it("Should revert if ERC20 address is zero", async () => {
    const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
    await expect(
      Crowdfunding.deploy(ethers.constants.AddressZero, CAMPAIGN_MAX_DURATION)
    ).rejected;
  });

  it("Should set max campaign duration and token address", async () => {
    expect(await crowdfunding.maxCampaignDurationInDays()).to.be.greaterThan(
      ethers.constants.Zero
    );
    expect(await crowdfunding.tokenAddress()).to.be.not.null;
  });
});
