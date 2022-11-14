import { ehters, ethers, getNamedAccounts, getUnnamedAccounts, network } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { Crowdfunding } from "../../typechain-types/contracts/Crowdfunding";
import { expect } from "chai";
import moment from "moment";
import { utils } from "ethers";
import { LoopToken } from "../../typechain-types";
import { deployCrowdfundingFixture } from "./fixtures/deploy-crowfunding";

describe("Crowdfunding: claim", function () {
  let crowdfunding: Crowdfunding;
  let token: LoopToken;

  const id = 1;
  const amount = utils.parseEther("100");
  const start = moment().add(1, "day");
  const end = moment().add(11, "day");

  const pledgeTime = moment().add(5, "day");

  beforeEach(async function () {
    ({ crowdfunding, token } = await loadFixture(deployCrowdfundingFixture));
  });

  it("Should revert if campaign not exists", async () => {
    await expect(
      crowdfunding.claim(id)
    ).to.be.revertedWith("Not exists");
  });

  it("Should revert if sender is not the creator", async () => {
    let notCreator = await ethers.getSigner((await getUnnamedAccounts())[0]);

    await crowdfunding.launch(amount, start.unix(), end.unix());

    await expect(crowdfunding.connect(notCreator).claim(1)).to.be.revertedWith(
      "Not creator"
    );
  });

  it("Should revert if insufficient balance to claim", async () => {
    await crowdfunding.launch(amount, start.unix(), end.unix());

    const pledge = utils.parseEther("10");

    await network.provider.send("evm_setNextBlockTimestamp", [
      pledgeTime.unix(),
    ]);

    await token.approve(crowdfunding.address, pledge);
    await crowdfunding.pledge(id, pledge);

    await expect(crowdfunding.claim(id)).to.be.revertedWith(
      "Goal not reached"
    );
  });

  it("should revert if campaign is still active", async () => {
    await crowdfunding.launch(amount, start.unix(), end.unix());

    const pledge = utils.parseEther("100");

    await network.provider.send("evm_setNextBlockTimestamp", [
      pledgeTime.unix(),
    ]);

    await token.approve(crowdfunding.address, pledge);
    await crowdfunding.pledge(id, pledge);

    await expect(crowdfunding.claim(id)).to.be.revertedWith("Still active");
  });

  it("Should claim successfully", async () => {
    const { deployer } = await getNamedAccounts();

    const pledge = utils.parseEther("100");
    const pledgeTime = moment().add(5, "day");
    const campaignEndedDate = moment().add(12, "day");

    //Launch
    await crowdfunding.launch(amount, start.unix(), end.unix());

    //User pledges and reaches goal
    await network.provider.send("evm_setNextBlockTimestamp", [
      pledgeTime.unix(),
    ]);

    await token.approve(crowdfunding.address, pledge);
    await crowdfunding.pledge(id, pledge);

    await network.provider.send("evm_setNextBlockTimestamp", [
      campaignEndedDate.unix(),
    ]);

    // Expect Claim event to be emitted
    await expect(crowdfunding.claim(id))
      .to.emit(crowdfunding, "Claim")
      .withArgs(id, deployer, pledge);

    // Expect campaign status to be Claimed
    const campaign = await crowdfunding.idsToCampaigns(id);
    expect(campaign.status).to.be.eq(2);
  });
});
