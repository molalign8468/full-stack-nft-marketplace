require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    holesky: {
      url: ALCHEMY_HOLESKY_URL || "", // Provide a default empty string if not found
      accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : [], // Only add if private key exists
      chainId: 17000, // Explicitly set Holesky Chain ID
    },
    // You can add other networks here like sepolia, mainnet, etc.
  },
};
