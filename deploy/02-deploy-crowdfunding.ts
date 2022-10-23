import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { network } from "hardhat";

import { developmentChains, networkConfig } from "../helper-hardhat-config";
import { verify } from "../utils/verify";
import {
  CAMPAIGN_MAX_DURATION,
  HARDHAT_NETWORK_ID,
  ERC20_ADDRESS,
} from "../utils/constants";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId || HARDHAT_NETWORK_ID;
  const currentNetworkConfig = networkConfig[chainId];

  if (!currentNetworkConfig) {
    return log("Network confguration not found");
  }

  const contractToDeploy = "Crowdfunding";
  log(`Starting to deploy ${contractToDeploy}`);

  const constructorArgs = [ERC20_ADDRESS, CAMPAIGN_MAX_DURATION];
  const crowdfunding = await deploy(contractToDeploy, {
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
    await verify(crowdfunding.address, constructorArgs);
  }

  log(`${contractToDeploy} deployed successfully`);
};

func.tags = ["all", "crowdfunding"];
export default func;
