import { ethers } from "hardhat";
import { expect } from "chai";

describe("Looptoken: constructor", function () {
  it("Should deploy", async () => {
    const LoopToken = await ethers.getContractFactory("LoopToken");
    await expect(LoopToken.deploy()).not.be.rejected;
  });
});
