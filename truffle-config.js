const path = require("path");
module.exports = {
    contracts_build_directory: path.join(__dirname, "client/src/contracts"),
    networks: {
        development: {
            network_id: "*",
            host: 'localhost',
            port: 7545,
            gas: 6721975,
            gasPrice: 20000000000
        }
    },
    compilers: {
        solc: {
            version: "0.8.13",
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    }
};