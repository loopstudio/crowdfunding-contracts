import { ethers, getNamedAccounts, getUnnamedAccounts, network } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { Crowdfunding } from "../../typechain-types/contracts/Crowdfunding";
import { expect } from "chai";
import moment from "moment";
import { utils } from "ethers";
import { LoopToken } from "../../typechain-types";
import { deployCrowdfundingFixture } from "./fixtures/deploy-crowfunding";

describe("Crowdfunding: pledge", function () {
  let crowdfunding: Crowdfunding;
  let token: LoopToken;

  const id = 1;
  const amount = utils.parseEther("100");
  const start = moment().add(1, "day");
  const end = moment().add(11, "day");
  const pledge = utils.parseEther("20");

  beforeEach(async function () {
    ({ crowdfunding, token } = await loadFixture(deployCrowdfundingFixture));
  });

  it("Should revert if campaign not exists", async () => {
    await expect(
      crowdfunding.pledge(1, utils.parseEther("1"))
    ).to.be.revertedWith("Not exists");
  });

  it("Should revert if amount is zero", async () => {
    await crowdfunding.launch(amount, start.unix(), end.unix());

    await expect(crowdfunding.pledge(id, 0)).to.be.revertedWith(
      "Pledge amount must be gt 0"
    );
  });

  it("Should revert if canceled", async () => {
    await crowdfunding.launch(amount, start.unix(), end.unix());
    await crowdfunding.cancel(id);

    await expect(crowdfunding.pledge(id, pledge)).to.be.revertedWith(
      "Invalid status"
    );
  });

  it("Should revert if not started", async () => {
    await crowdfunding.launch(amount, start.unix(), end.unix());

    await expect(crowdfunding.pledge(id, pledge)).to.be.revertedWith(
      "Not started"
    );
  });

  it("Should revert if ended", async () => {
    const pledgeTime = moment().add(15, "day");

    await crowdfunding.launch(amount, start.unix(), end.unix());

    await network.provider.send("evm_setNextBlockTimestamp", [
      pledgeTime.unix(),
    ]);

    await expect(crowdfunding.pledge(id, pledge)).to.be.revertedWith("Ended");
  });

  it("Should succeed", async () => {
    const { deployer } = await getNamedAccounts();
    const user = await ethers.getSigner((await getUnnamedAccounts())[0]);
    await token.transfer(user.address, utils.parseEther("20"));

    const pledgeTime = moment().add(5, "day");

    await crowdfunding.launch(amount, start.unix(), end.unix());

    //5 days later: 2 users pledge 20 tokens
    await network.provider.send("evm_setNextBlockTimestamp", [
      pledgeTime.unix(),
    ]);

    await token.approve(crowdfunding.address, pledge);
    await expect(crowdfunding.pledge(id, pledge))
      .to.emit(crowdfunding, "Pledge")
      .withArgs(ethers.constants.One, deployer, pledge);

    await token.connect(user).approve(crowdfunding.address, pledge);

    await expect(crowdfunding.connect(user).pledge(id, pledge))
      .to.emit(crowdfunding, "Pledge")
      .withArgs(ethers.constants.One, user.address, pledge);

    // Campaign pledged should be 40
    const campaign = await crowdfunding.idsToCampaigns(id);
    expect(campaign.pledgedAmount).to.be.eq(utils.parseEther("40"));

    // User 1 pledged amount should be 20
    const userOnePledgedAmount = await crowdfunding.idsToPledgedAmountByAddress(
      id,
      deployer
    );

    expect(userOnePledgedAmount).to.be.eq(pledge);

    // User 1 pledged amount should be 20
    const userTwoPledgedAmount = await crowdfunding.idsToPledgedAmountByAddress(
      id,
      user.address
    );

    expect(userTwoPledgedAmount).to.be.eq(pledge);
  });

  it("Should revert if not enough allowance", async () => {
    const allowance = utils.parseEther("9");
    const pledgeTime = moment().add(5, "day");

    await crowdfunding.launch(amount, start.unix(), end.unix());

    await network.provider.send("evm_setNextBlockTimestamp", [
      pledgeTime.unix(),
    ]);

    await token.approve(crowdfunding.address, allowance);
    await expect(crowdfunding.pledge(id, pledge)).to.be.revertedWith(
      "ERC20: insufficient allowance"
    );
  });
});
