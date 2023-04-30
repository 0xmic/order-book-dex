const hre = require('hardhat')

async function main() {
  console.log(`Preparing deployment...\n`)

  // Fetch contracts to deploy
  const Token = await hre.ethers.getContractFactory('Token')
  const Exchange = await hre.ethers.getContractFactory('Exchange')

  // Fetch accounts
  const accounts = await hre.ethers.getSigners()
  console.log(`Accounts fetched:\n${accounts[0].address}\n${accounts[1].address}\n`)

  // Deploy contracts
  const deltaToken = await Token.deploy('Delta Token', 'DELTA', '1000000')
  await deltaToken.deployed()
  console.log(`Delta Token (DELTA) deployed to ${deltaToken.address}`)

  const mETH = await Token.deploy('mETH', 'mETH', '1000000')
  await mETH.deployed()
  console.log(`mETH (mETH) deployed to ${mETH.address}`)

  const mDAI = await Token.deploy('mDAI', 'mDAI', '1000000')
  await mDAI.deployed()
  console.log(`mDAI (mDAI) deployed to ${mDAI.address}`)

  const exchange = await Exchange.deploy(accounts[1].address, 10)
  await exchange.deployed()
  console.log(`Exchange deployed to ${exchange.address}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
