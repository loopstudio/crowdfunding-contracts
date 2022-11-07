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
  const id = 1;
  const amount = utils.parseEther("100");
  const start = moment().add(1, "day");
  const end = moment().add(11, "day");

  beforeEach(async function () {
    ({ crowdfunding, token } = await loadFixture(deployCrowdfundingFixture));
  });

  it("Should revert if campaign not exists", async () => {
    await expect(crowdfunding.refund(1)).to.be.revertedWith("Not exists");
  });

  it("Should revert if campaing still active", async () => {});

  it("Should revert if ended but hasnt pledged", async () => {});

  it("Should revert if already refunded", async () => {});

  it("Should revert if goal reached", async () => {});

  it("Should succeed", async () => {});
});
