import { ethers, getNamedAccounts, getUnnamedAccounts, network } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { Crowdfunding } from "../../typechain-types/contracts/Crowdfunding";
import { expect } from "chai";
import moment from "moment";
import { utils } from "ethers";
import { LoopToken } from "../../typechain-types";
import { deployCrowdfundingFixture } from "./fixtures/deploy-crowfunding";

describe("Crowdfunding: unpledge", function () {
  let crowdfunding: Crowdfunding;
  let token: LoopToken;

  beforeEach(async function () {
    ({ crowdfunding, token } = await loadFixture(deployCrowdfundingFixture));
  });

  it("Should revert if campaign not exists", async () => {
    await expect(
      crowdfunding.unpledge(1, utils.parseEther("1"))
    ).to.be.revertedWith("Not exists");
  });

  it("Should revert if amount is zero", async () => {
    const id = 1;
    const amount = utils.parseEther("100");
    const start = moment().add(1, "day");
    const end = moment().add(11, "day");

    await crowdfunding.launch(amount, start.unix(), end.unix());

    await expect(crowdfunding.unpledge(id, 0)).to.be.revertedWith(
      "Unpledge amount must be gt 0"
    );
  });

  it("Should revert if ended", async () => {
    const id = 1;
    const amount = utils.parseEther("100");
    const start = moment().add(1, "day");
    const end = moment().add(11, "day");

    const pledge = utils.parseEther("10");
    const pledgeTime = moment().add(5, "day");
    const endedTime = moment().add(12, "day");

    await crowdfunding.launch(amount, start.unix(), end.unix());

    await network.provider.send("evm_setNextBlockTimestamp", [
      pledgeTime.unix(),
    ]);

    await token.approve(crowdfunding.address, pledge);
    await crowdfunding.pledge(id, pledge);

    await network.provider.send("evm_setNextBlockTimestamp", [
      endedTime.unix(),
    ]);

    await expect(crowdfunding.unpledge(id, pledge)).to.be.revertedWith("Ended");
  });

  it("Should revert if insufficient balance to unpledge", async () => {
    const id = 1;
    const amount = utils.parseEther("100");
    const start = moment().add(1, "day");
    const end = moment().add(11, "day");

    const pledge = utils.parseEther("10");
    const unpledge = utils.parseEther("11");
    const pledgeTime = moment().add(5, "day");
    const unpledgeTime = moment().add(6, "day");

    await crowdfunding.launch(amount, start.unix(), end.unix());

    await network.provider.send("evm_setNextBlockTimestamp", [
      pledgeTime.unix(),
    ]);

    await token.approve(crowdfunding.address, pledge);
    await crowdfunding.pledge(id, pledge);

    await network.provider.send("evm_setNextBlockTimestamp", [
      unpledgeTime.unix(),
    ]);

    await expect(crowdfunding.unpledge(id, unpledge)).to.be.revertedWith(
      "Insufficient balance to unpledge"
    );
  });

  it("Should succed", async () => {
    const { deployer } = await getNamedAccounts();
    let user = await ethers.getSigner((await getUnnamedAccounts())[0]);
    token.transfer(user.address, utils.parseEther("10"));

    const id = 1;
    const amount = utils.parseEther("100");
    const start = moment().add(1, "day");
    const end = moment().add(11, "day");

    const pledge = utils.parseEther("10");
    const unpledge = utils.parseEther("5");
    const pledgeTime = moment().add(5, "day");
    const unpledgeTime = moment().add(6, "day");

    // Launch
    await crowdfunding.launch(amount, start.unix(), end.unix());

    // 5 days later: 2 users Pledge 10 tokens each
    await network.provider.send("evm_setNextBlockTimestamp", [
      pledgeTime.unix(),
    ]);

    await token.approve(crowdfunding.address, pledge);
    await crowdfunding.pledge(id, pledge);

    await token.connect(user).approve(crowdfunding.address, pledge);
    await crowdfunding.connect(user).pledge(id, pledge);

    // User 1 unpledge 5 tokens
    await network.provider.send("evm_setNextBlockTimestamp", [
      unpledgeTime.unix(),
    ]);

    await expect(crowdfunding.unpledge(id, unpledge))
      .to.emit(crowdfunding, "Unpledge")
      .withArgs(ethers.constants.One, deployer, unpledge);

    // Expect remining amount to be 15 tokens
    const campaign = await crowdfunding.idsToCampaigns(id);
    expect(campaign.pledgedAmount).to.be.eq(utils.parseEther("15"));

    // Expect user 1 pledged amount to be 5 tokens
    const pledgerAmount = await crowdfunding.idsToPledgedAmountByAddress(
      id,
      deployer
    );

    expect(pledgerAmount).to.be.eq(utils.parseEther("5"));
  });
});
