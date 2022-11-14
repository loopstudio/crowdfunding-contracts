import { ethers, getUnnamedAccounts } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

import { expect } from "chai";
import moment from "moment";
import { utils } from "ethers";
import { Crowdfunding } from "../../typechain-types";
import { deployCrowdfundingFixture } from "./fixtures/deploy-crowfunding";

describe("Crowdfunding: cancel", function () {
  let crowdfunding: Crowdfunding;
  const id = 1;
  const amount = utils.parseEther("100");
  const start = moment().add(1, "day");
  const end = moment().add(11, "day");

  beforeEach(async function () {
    ({ crowdfunding } = await loadFixture(deployCrowdfundingFixture));
  });

  it("Should revert if campaign not exists", async () => {
    await expect(crowdfunding.cancel(1)).to.be.revertedWith("Not exists");
  });

  it("Should revert if not creator", async () => {
    const notCreator = await ethers.getSigner((await getUnnamedAccounts())[0]);

    await crowdfunding.launch(amount, start.unix(), end.unix());

    await expect(crowdfunding.connect(notCreator).cancel(1)).to.be.revertedWith(
      "Not creator"
    );
  });

  it("Should cancel succesfuly", async () => {
    await crowdfunding.launch(amount, start.unix(), end.unix());

    await expect(crowdfunding.cancel(id))
      .to.emit(crowdfunding, "Cancel")
      .withArgs(id);

    const canceledCampaign = await crowdfunding.idsToCampaigns(id);
    expect(canceledCampaign.status).to.be.eq(1);
  });
});
