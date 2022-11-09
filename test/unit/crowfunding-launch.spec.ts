import { ethers, getNamedAccounts } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { Crowdfunding } from "../../typechain-types/contracts/Crowdfunding";
import { expect } from "chai";
import moment from "moment";
import { BigNumber, utils } from "ethers";
import { deployCrowdfundingFixture } from "./fixtures/deploy-crowfunding";

describe("Crowdfunding: launch", function () {
  let crowdfunding: Crowdfunding;

  beforeEach(async function () {
    ({ crowdfunding } = await loadFixture(deployCrowdfundingFixture));
  });

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
    const amount = utils.parseEther("100");

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
    expect(campaign.status).to.be.eq(0);
  });

  it("Should succed if duration lower to max", async () => {
    const { deployer } = await getNamedAccounts();
    const amount = utils.parseEther("100");

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
    expect(campaign.status).to.be.eq(0);
  });
});
