import {
  ethers,
  deployments,
  getNamedAccounts,
  getUnnamedAccounts,
  network,
} from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { Crowdfunding } from "../../typechain-types/contracts/Crowdfunding";
import { expect } from "chai";
import moment from "moment";
import { CAMPAIGN_MAX_DURATION, ERC20_ADDRESS } from "../../utils/constants";
import { BigNumber } from "ethers";

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

    it("Should revert if start is equals to end", async () => {
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
      ).to.be.revertedWith("Duration exceeds maximum");
    });

    it("Should succed if duration equals to max duration", async () => {
      const { deployer } = await getNamedAccounts();
      const amount = 100;

      const start = moment().add(1, "day");
      const end = moment().add(21, "day");

      await expect(crowdfunding.launch(amount, start.unix(), end.unix()))
        .to.emit(crowdfunding, "Launch")
        .withArgs(
          ethers.constants.One,
          amount,
          deployer,
          start.unix(),
          end.unix()
        );

      const campaign = await crowdfunding.idsToCampaigns(ethers.constants.One);
      expect(campaign.creator).to.be.eq(deployer);
      expect(campaign.goalAmount).to.be.eq(BigNumber.from(amount));
      expect(campaign.pledgedAmount).to.be.eq(ethers.constants.Zero);
      expect(campaign.startDate).to.be.eq(start.unix());
      expect(campaign.endDate).to.be.eq(end.unix());
      expect(campaign.claimed).to.be.eq(false);
    });

    it("Should succed if duration lower to max", async () => {
      const { deployer } = await getNamedAccounts();
      const amount = 100;

      const start = moment().add(1, "day");
      const end = moment().add(11, "day");

      await expect(crowdfunding.launch(amount, start.unix(), end.unix()))
        .to.emit(crowdfunding, "Launch")
        .withArgs(
          ethers.constants.One,
          amount,
          deployer,
          start.unix(),
          end.unix()
        );

      const campaign = await crowdfunding.idsToCampaigns(ethers.constants.One);
      expect(campaign.creator).to.be.eq(deployer);
      expect(campaign.goalAmount).to.be.eq(BigNumber.from(amount));
      expect(campaign.pledgedAmount).to.be.eq(ethers.constants.Zero);
      expect(campaign.startDate).to.be.eq(start.unix());
      expect(campaign.endDate).to.be.eq(end.unix());
      expect(campaign.claimed).to.be.eq(false);
    });
  });

  describe("Cancel", async function () {
    it("Should revert if campaign not exists", async () => {
      await expect(crowdfunding.cancel(1)).to.be.revertedWith("Not exists");
    });

    it("Should revert if campaign started", async () => {
      const amount = 100;
      const start = moment().add(1, "day");
      const cancelMoment = moment().add(2, "day");
      const end = moment().add(11, "day");

      // Launches tomorrow
      await crowdfunding.launch(amount, start.unix(), end.unix());

      // Cancels two days from now
      await network.provider.send("evm_setNextBlockTimestamp", [
        cancelMoment.unix(),
      ]);
      await expect(crowdfunding.cancel(1)).to.be.revertedWith(
        "Already started"
      );
    });

    it("Should revert if not creator", async () => {
      let notCreator = await ethers.getSigner((await getUnnamedAccounts())[0]);
      const amount = 100;
      const start = moment().add(1, "day");
      const end = moment().add(11, "day");

      await crowdfunding.launch(amount, start.unix(), end.unix());

      await expect(
        crowdfunding.connect(notCreator).cancel(1)
      ).to.be.revertedWith("Not creator");
    });

    it("Should cancel succesfuly", async () => {
      const id = 1;
      const amount = 100;
      const start = moment().add(1, "day");
      const end = moment().add(11, "day");

      await crowdfunding.launch(amount, start.unix(), end.unix());

      await expect(crowdfunding.cancel(id))
        .to.emit(crowdfunding, "Cancel")
        .withArgs(id);

      const deletedCampaign = await crowdfunding.idsToCampaigns(id);
      expect(deletedCampaign.creator).to.be.eq(ethers.constants.AddressZero);
      expect(deletedCampaign.goalAmount).to.be.eq(ethers.constants.Zero);
      expect(deletedCampaign.pledgedAmount).to.be.eq(ethers.constants.Zero);
      expect(deletedCampaign.startDate).to.be.eq(ethers.constants.Zero);
      expect(deletedCampaign.endDate).to.be.eq(ethers.constants.Zero);
      expect(deletedCampaign.claimed).to.be.eq(false);
    });
  });
});
