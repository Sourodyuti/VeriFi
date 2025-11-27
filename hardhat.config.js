require('@nomiclabs/hardhat-ethers');
require('dotenv').config();

module.exports = {
  solidity: '0.8.17',
  networks: {
    hardhat: {},
    localhost: {
      url: process.env.RPC_URL || 'http://127.0.0.1:8545'
    }
  }
};
