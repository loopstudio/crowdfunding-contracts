import { ethers, deployments } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { Crowdfunding } from "../../typechain-types/contracts/Crowdfunding";
import { expect } from "chai";

describe("Crowdfunding", function () {
  let crowdfunding: Crowdfunding;

  beforeEach(async function () {
    crowdfunding = await loadFixture(deployCrowdfundingFixture);
  });

  async function deployCrowdfundingFixture() {
    await deployments.fixture(["crowdfunding"]);
    const crowdfunding = await ethers.getContract("Crowdfunding");
    return crowdfunding;
  }

  describe("constructor", async function () {
    it("Should set max campaign period and token address", async () => {
      expect(await crowdfunding.maxCampaignPeriodInDays()).to.be.greaterThan(
        ethers.constants.Zero
      );
      expect(await crowdfunding.token()).to.be.not.null;
    });
  });
});
