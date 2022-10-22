import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { network } from "hardhat";

import { developmentChains, networkConfig } from "../helper-hardhat-config";
import { verify } from "../utils/verify";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const HARDHAT_NETWORK_ID = 31337;
  const chainId = network.config.chainId || HARDHAT_NETWORK_ID;
  const currentNetworkConfig = networkConfig[chainId];

  if (!currentNetworkConfig) {
    return log("Network confguration not found");
  }

  const contractToDeploy = "Crowdfunding";
  log(`Starting to deploy ${contractToDeploy}`);
  const maxCampaingPeriodSeconds = 20 * 24 * 60 * 60;

  const constructorArgs = [
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    maxCampaingPeriodSeconds,
  ];
  const greeter = await deploy(contractToDeploy, {
    from: deployer,
    args: constructorArgs,
    log: true,
    waitConfirmations: currentNetworkConfig.confirmations || 6,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY &&
    process.env.VERIFY_CONTRACT === "true"
  ) {
    await verify(greeter.address, constructorArgs);
  }

  log(`${contractToDeploy} deployed successfully`);
};

func.tags = ["all", "crowdfunding"];
export default func;
