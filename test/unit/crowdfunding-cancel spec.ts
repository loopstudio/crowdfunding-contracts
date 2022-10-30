import { ethers, getUnnamedAccounts } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { Crowdfunding } from "../../typechain-types/contracts/Crowdfunding";
import { expect } from "chai";
import moment from "moment";
import { utils } from "ethers";
import { LoopToken } from "../../typechain-types";
import { deployCrowdfundingFixture } from "./fixtures/deploy-crowfunding";

describe("Crowdfunding: cancel", function () {
  let crowdfunding: Crowdfunding;
  let token: LoopToken;

  beforeEach(async function () {
    ({ crowdfunding, token } = await loadFixture(deployCrowdfundingFixture));
  });

  it("Should revert if campaign not exists", async () => {
    await expect(crowdfunding.cancel(1)).to.be.revertedWith("Not exists");
  });

  it("Should revert if not creator", async () => {
    let notCreator = await ethers.getSigner((await getUnnamedAccounts())[0]);
    const amount = utils.parseEther("100");
    const start = moment().add(1, "day");
    const end = moment().add(11, "day");

    await crowdfunding.launch(amount, start.unix(), end.unix());

    await expect(crowdfunding.connect(notCreator).cancel(1)).to.be.revertedWith(
      "Not creator"
    );
  });

  it("Should cancel succesfuly", async () => {
    const id = 1;
    const amount = utils.parseEther("100");
    const start = moment().add(1, "day");
    const end = moment().add(11, "day");

    await crowdfunding.launch(amount, start.unix(), end.unix());

    await expect(crowdfunding.cancel(id))
      .to.emit(crowdfunding, "Cancel")
      .withArgs(id);

    const canceledCampaign = await crowdfunding.idsToCampaigns(id);
    expect(canceledCampaign.status).to.be.eq(1);
  });
});
