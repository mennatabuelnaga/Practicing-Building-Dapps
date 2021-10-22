const path = require("path");
// const HDWalletProvider = require('truffle-hdwallet-provider-privkey');


// const privateKey = Buffer.from('97bA1a700E6ED25E1973c93445246f2192F1c32d', 'hex');
// const privateKey = ["97bA1a700E6ED25E1973c93445246f2192F1c32d"];

// require('dotenv').config()
// const projectId = process.env.projectId;
// const mnemonic = process.env.mnemonic;
// const endpointUrl = `https://kovan.infura.io/v3/${projectId}`;
// const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {

  contracts_build_directory: path.join(__dirname, "client/src/contracts"),

  networks: {

    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777",
    },

    // kovan: {
    //   provider: function() {
    //     return new HDWalletProvider(
    //       //private keys array
    //       privateKey,
    //       //url to ethereum node
    //       endpointUrl
    //     )
    //   },
    //   gas: 5000000,
    //   gasPrice: 25000000000,
    //   network_id: 42
    // }

    // kovan: {
    //   provider: () => new HDWalletProvider(mnemonic, endpointUrl),
    //   gas: 5000000,
    //   gasPrice: 25000000000,
    //   network_id: 42
    // },
  }
}