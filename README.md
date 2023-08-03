# Init Project

Initialize the directory and node project:

```shell
mkdir hardhat-plain
cd hardhat-plain
yarn init -y
```

Add basic dependencies:

```shell
yarn add --dev hardhat @vechain/web3-providers-connex @vechain/hardhat-vechain @vechain/hardhat-web3 @vechain/hardhat-ethers
```

# Init Hardhat

Using hardhat, a template project can be created:

```shell
$ npx hardhat
888    888                      888 888               888
888    888                      888 888               888
888    888                      888 888               888
8888888888  8888b.  888d888 .d88888 88888b.   8888b.  888888
888    888     "88b 888P"  d88" 888 888 "88b     "88b 888
888    888 .d888888 888    888  888 888  888 .d888888 888
888    888 888  888 888    Y88b 888 888  888 888  888 Y88b.
888    888 "Y888888 888     "Y88888 888  888 "Y888888  "Y888

👷 Welcome to Hardhat v2.17.1 👷‍

✔ What do you want to do? · Create a TypeScript project
✔ Hardhat project root: · ./hardhat-plain
✔ Do you want to add a .gitignore? (Y/n) · y
✔ Do you want to install this sample project's dependencies with yarn (@nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-network-helpers @nomicfoundation/hardhat-chai-matchers @nomicfoundation/hardhat-ethers @nomicfoundation/hardhat-verify chai ethers hardhat-gas-reporter solidity-coverage @typechain/hardhat typechain @typechain/ethers-v6 @types/chai @types/mocha @types/node ts-node typescript)? (Y/n) · y
```

# Downgrade ethers

ethers v5 is the maximum version supported by `@vechain/hardhat-vechain` which requires a downgrade by manually installing the older version:

```shell
yarn add --dev ethers@5 @vechain/hardhat-ethers "@nomiclabs/hardhat-ethers@^2.2.2" 
```

# Configure Vechain Network

To add support for Vechain, adjust the `hardhat.config.ts`.

Add the Vechain dependencies and configure the network:

```ts
import "@nomicfoundation/hardhat-toolbox";
import "@vechain/hardhat-vechain";
import '@vechain/hardhat-ethers';

const config = {
  solidity: "0.8.19",
  networks: {
    vechain_testnet: {
      url: "https://node-testnet.vechain.energy",
      accounts: ["0x765573031fb5c056bff1b764a797a571478b6fcc97f34165b047da9b09c02e10"],
      restful: true,
      gas: 10000000,
      
      // optionally use fee delegation to let someone else pay the gas fees
      // visit vechain.energy for a public fee delegation service
      delegate: {
        url: "https://sponsor-testnet.vechain.energy/by/90"
      }
    },
    vechain_mainnet: {
      url: "https://node-mainnet.vechain.energy",
      accounts: ["0x765573031fb5c056bff1b764a797a571478b6fcc97f34165b047da9b09c02e10"],
      restful: true,
      gas: 10000000,
    },
  },
};

export default config;
```

_Make sure to use `vechain` within the networks name. It must be included in the name to work correctly._

# Adjust Deployment Example

The deployment example in `scripts/deploy.ts` is based on ethers v6, to make it work it needs to be adjusted to work with v5:

```ts
import { ethers } from "hardhat";

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = ethers.utils.parseEther("0.001");

  const Lock = await ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  await lock.deployed();

  console.log(
    `Lock with ${ethers.utils.formatEther(lockedAmount)}ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
```

# Deploy

Running the example deployment script from Hardhat will work if the configured account has some VET & VTHO in it:

```shell
$ npx hardhat run scripts/deploy.ts --network vechain_testnet

Lock with 0.001ETH and unlock timestamp 1691048036 deployed to 0xA7C02e629855388e472435e612a0646ACD039eD4
```

# Bonus: OpenZeppelin

Add OpenZeppelin libraries:

```shell
yarn add @openzeppelin/contracts
```

Visit https://wizard.openzeppelin.com/ and generate your contracts source code.

Paste the result for example in `contracts/MyToken.sol`:

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyToken is ERC721 {
    constructor() ERC721("MyToken", "MTK") {}
}
```

Create a simplified deployment script in `scripts/deploy-MyToken.ts`:

```ts
import { ethers } from "hardhat";

async function main() {
  // adjust "MyToken" to be your contracts name
  const NFT = await ethers.getContractFactory("MyToken");
  const nft = await NFT.deploy();
  await nft.deployed();

  console.log(`NFT deployed to ${nft.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
```

Deploy the newly created NFT contract:

```shell
$ npx hardhat run scripts/deploy-MyToken.ts --network vechain_testnet

Compiled 12 Solidity files successfully
NFT deployed to 0x075D72Ec739f168B96F8861Ce80B1fcD7C0134A1
```

# Conclusion

It is becoming very easy to get started on Vechain. Combine that with OpenZeppelin and many building blocks are available to make your ideas a reality.


# Optional

## Private Key Generation

Generate a private key for testing purpose:

```shell
$ openssl rand -hex 32
765573031fb5c056bff1b764a797a571478b6fcc97f34165b047da9b09c02e10

$ echo 0x765573031fb5c056bff1b764a797a571478b6fcc97f34165b047da9b09c02e10 | npx ethereum-private-key-to-address
0x2aC7ab218f0cBB77273D1C39D46FE19165FF2BB3
```

## TestNet Faucet

You can get some VET and VTHO from the TestNet faucet:
https://faucet.vecha.in
