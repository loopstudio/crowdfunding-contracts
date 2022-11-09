import { ethers, getNamedAccounts, getUnnamedAccounts, network } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { Crowdfunding } from "../../typechain-types/contracts/Crowdfunding";
import { expect } from "chai";
import moment from "moment";
import { utils } from "ethers";
import { LoopToken } from "../../typechain-types";
import { deployCrowdfundingFixture } from "./fixtures/deploy-crowfunding";

describe("Crowdfunding: refund", function () {
  let crowdfunding: Crowdfunding;
  let token: LoopToken;
  const id = 1;
  const amount = utils.parseEther("100");
  const start = moment().add(1, "day");
  const end = moment().add(11, "day");
  const ended = moment().add(12, "day");

  const pledge = utils.parseEther("20");
  const pledgeTime = moment().add(5, "day");

  beforeEach(async function () {
    ({ crowdfunding, token } = await loadFixture(deployCrowdfundingFixture));
  });

  it("Should revert if campaign not exists", async () => {
    await expect(crowdfunding.refund(id)).to.be.revertedWith("Not exists");
  });

  it("Should revert if campaing still active", async () => {
    await crowdfunding.launch(amount, start.unix(), end.unix());

    await network.provider.send("evm_setNextBlockTimestamp", [
      pledgeTime.unix(),
    ]);

    await token.approve(crowdfunding.address, pledge);
    await crowdfunding.pledge(id, pledge);

    await expect(crowdfunding.refund(id)).to.be.revertedWith("Still active");
  });

  it("Should revert if ended but hasnt pledged", async () => {
    await crowdfunding.launch(amount, start.unix(), end.unix());

    await network.provider.send("evm_setNextBlockTimestamp", [ended.unix()]);

    await expect(crowdfunding.refund(id)).to.be.revertedWith(
      "No funds to refund"
    );
  });

  it("Should revert if already refunded", async () => {
    const { deployer } = await getNamedAccounts();

    await crowdfunding.launch(amount, start.unix(), end.unix());

    await network.provider.send("evm_setNextBlockTimestamp", [
      pledgeTime.unix(),
    ]);

    await token.approve(crowdfunding.address, pledge);
    await crowdfunding.pledge(id, pledge);

    await network.provider.send("evm_setNextBlockTimestamp", [ended.unix()]);

    await expect(crowdfunding.refund(id))
      .to.emit(crowdfunding, "Refund")
      .withArgs(id, deployer, pledge);

    await expect(crowdfunding.refund(id)).to.be.revertedWith(
      "No funds to refund"
    );
  });

  it("Should revert if goal reached", async () => {
    await crowdfunding.launch(amount, start.unix(), end.unix());

    await network.provider.send("evm_setNextBlockTimestamp", [
      pledgeTime.unix(),
    ]);

    await token.approve(crowdfunding.address, amount);
    await crowdfunding.pledge(id, amount);

    await network.provider.send("evm_setNextBlockTimestamp", [ended.unix()]);

    await expect(crowdfunding.refund(id)).to.be.revertedWith(
      "Campaign reached its goal"
    );
  });

  it("Should succeed", async () => {
    const { deployer } = await getNamedAccounts();
    const user = await ethers.getSigner((await getUnnamedAccounts())[0]);
    await token.transfer(user.address, utils.parseEther("20"));
    const userOnePledge = utils.parseEther("60");

    await crowdfunding.launch(amount, start.unix(), end.unix());

    //5 days later: 2 users pledge a total of 60 and 20 tokens respectively
    await network.provider.send("evm_setNextBlockTimestamp", [
      pledgeTime.unix(),
    ]);

    // First user pledges 60 tokens
    await token.approve(crowdfunding.address, userOnePledge);
    await crowdfunding.pledge(id, userOnePledge);

    // Second user pledges 20 tokens
    await token.connect(user).approve(crowdfunding.address, pledge);
    await crowdfunding.connect(user).pledge(id, pledge);

    // Campaing ends
    await network.provider.send("evm_setNextBlockTimestamp", [ended.unix()]);

    // Since total pledged = 80 and goal = 100 it should succed for both users
    // User one should be able to refund 60 tokens
    await expect(crowdfunding.refund(id))
      .to.emit(crowdfunding, "Refund")
      .withArgs(id, deployer, userOnePledge);

    await expect(crowdfunding.refund(id)).to.be.revertedWith(
      "No funds to refund"
    );

    // User one pledged amount should be 0
    const userOnePledgedAmount = await crowdfunding.idsToPledgedAmountByAddress(
      id,
      deployer
    );
    expect(userOnePledgedAmount).to.be.eq(ethers.constants.Zero);

    // User two pledged amount should be still 20
    let userTwoPledgedAmount = await crowdfunding.idsToPledgedAmountByAddress(
      id,
      user.address
    );
    expect(userTwoPledgedAmount).to.be.eq(pledge);

    // User two should be able to refund 20 tokens
    await expect(crowdfunding.connect(user).refund(id))
      .to.emit(crowdfunding, "Refund")
      .withArgs(id, user.address, pledge);

    await expect(crowdfunding.connect(user).refund(id)).to.be.revertedWith(
      "No funds to refund"
    );

    // User two pledged amount should be now 0
    userTwoPledgedAmount = await crowdfunding.idsToPledgedAmountByAddress(
      id,
      user.address
    );
    expect(userTwoPledgedAmount).to.be.eq(ethers.constants.Zero);
  });
});
