export const networkConfig: { [key: number]: Record<string, any> } = {
  31337: {
    name: "localhost",
    confirmations: 1,
  },
  137: {
    name: "polygon",
    confirmations: 6,
  },
  80001: {
    name: "muambai",
    confirmations: 2,
  },
  5: {
    name: "goerli",
    confirmations: 2,
  },
  11155111: {
    name: "sepolia",
    confirmations: 5,
  },
};

export const developmentChains = ["hardhat", "localhost"];
