# Delta Token Exchange

This project demonstrates a basic order book based decentralized exchange. It includes smart contracts for ERC-20 tokens that are traded on the exchange, as well as the exchange contract that manages deposits/withdrawals and trades on the DEX. Test files and scripts for deployment and seeding the exchange are also included.

To test the DEX locally, run the following:
```shell
npx hardhat node

npx hardhat --network localhost scripts/1_deploy.js

npx hardhat --network localhost scripts/2_seed_exchange.js

npm run start
```
