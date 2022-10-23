import { ethers, deployments } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { Crowdfunding } from "../../typechain-types/contracts/Crowdfunding";
import { expect } from "chai";
import moment from "moment";

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
      expect(await crowdfunding.maxCampaignDurationInDays()).to.be.greaterThan(
        ethers.constants.Zero
      );
      expect(await crowdfunding.token()).to.be.not.null;
    });
  });

  describe("launch", async function () {
    it("Should revert if goal is not greater than zero", async () => {
      const start = moment().add(1, "day");
      const end = moment().add(2, "day");

      await expect(
        crowdfunding.launch(0, start.seconds(), end.seconds())
      ).to.be.revertedWith("Goal must be gt 0");
    });

    it("Should revert if start its in the past", async () => {
      const start = moment().subtract(30, "second");
      const end = moment().add(2, "day");
      await expect(
        crowdfunding.launch(100, start.unix(), end.unix())
      ).to.be.revertedWith("Start must be gte now");
    });

    it("Should revert if start is greater than end", async () => {
      const start = moment().add(2, "day");
      const end = moment().add(1, "day");

      await expect(
        crowdfunding.launch(100, start.unix(), end.unix())
      ).to.be.revertedWith("End date must be gt start date");
    });

    it("Should revert if start is equals than end", async () => {
      const start = moment().add(1, "day");
      await expect(
        crowdfunding.launch(100, start.unix(), start.unix())
      ).to.be.revertedWith("End date must be gt start date");
    });

    it("Should revert if exceeds max campaign duration", async () => {
      const start = moment().add(1, "day");
      const end = moment().add(22, "day");

      await expect(
        crowdfunding.launch(100, start.unix(), end.unix())
      ).to.be.revertedWith("End date must be gt start date");
    });

    // TODO succesful cases
  });
});
