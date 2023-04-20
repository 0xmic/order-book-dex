const config = require('../src/config.json')
const hre = require('hardhat')

const tokens = (n) => {
  return hre.ethers.utils.parseUnits(n.toString(), 'ether')
}

const wait = (seconds) => {
  const milliseconds = seconds * 1000
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

async function main() {
  // Fetch accounts from wallet - these are unlocked
  const accounts = await hre.ethers.getSigners()

  // Fetch network
  const { chainId } = await hre.ethers.provider.getNetwork()
  console.log('Using chainId:', chainId)

  // Fetch deployed tokens
  const Dapp = await hre.ethers.getContractAt(
    'Token',
    config[chainId].Dapp.address
  )
  console.log(`Dapp Token fetched: ${Dapp.address}`)

  const mETH = await hre.ethers.getContractAt(
    'Token',
    config[chainId].mETH.address
  )
  console.log(`mETH Token fetched: ${mETH.address}`)

  const mDAI = await hre.ethers.getContractAt(
    'Token',
    config[chainId].mDAI.address
  )
  console.log(`mDAI Token fetched: ${mDAI.address}`)

  // Fetch the deployed exchange
  const exchange = await hre.ethers.getContractAt(
    'Exchange',
    config[chainId].exchange.address
  )
  console.log(`Exchange fetched: ${exchange.address}\n`)

  // Give tokens to accounts[1]
  const sender = accounts[0]
  const receiver = accounts[1]
  let amount = tokens(10000)

  // user1 transfers 10,000 mETH...
  let transaction, result
  transaction = await mETH.connect(sender).transfer(receiver.address, amount)
  console.log(
    `Transferred ${amount} mETH from ${sender.address} to ${receiver.address}`
  )

  // Set up exchange users
  const user1 = accounts[0]
  const user2 = accounts[1]
  amount = tokens(10000)

  // user1 approves 10,000 DAPP ...
  transaction = await Dapp.connect(user1).approve(exchange.address, amount)
  await transaction.wait()
  console.log(`Approved ${amount} DAPP from ${user1.address}`)

  // user1 deposits 10,000 DAPP...
  transaction = await exchange.connect(user1).depositToken(Dapp.address, amount)
  await transaction.wait()
  console.log(`Deposited ${amount} DAPP from ${user1.address}\n`)

  // user2 approves 10,000 mETH...
  transaction = await mETH.connect(user2).approve(exchange.address, amount)
  await transaction.wait()
  console.log(`Approved ${amount} mETH from ${user2.address}`)

  // user2 deposits mETH...
  transaction = await exchange.connect(user2).depositToken(mETH.address, amount)
  await transaction.wait()
  console.log(`Deposited ${amount} mETH from ${user2.address}\n`)

  //////////////////////////
  // Seed a Cancelled Order
  //

  // user1 makes order to get tokens
  let orderId
  transaction = await exchange
    .connect(user1)
    .makeOrder(mETH.address, tokens(100), Dapp.address, tokens(5))
  result = await transaction.wait()
  console.log(`Made order from ${user1.address}`)

  // user1 cancels order
  orderId = result.events[0].args.id
  transaction = await exchange.connect(user1).cancelOrder(orderId)
  await transaction.wait()
  console.log(`Cancelled order from ${user1.address}\n`)

  // Wait 1 second
  await wait(1)

  //////////////////////////
  // Seed Filled Orders
  //

  // user1 makes order
  transaction = await exchange
    .connect(user1)
    .makeOrder(mETH.address, tokens(100), Dapp.address, tokens(10))
  result = await transaction.wait()
  console.log(`Made order from ${user1.address}`)

  // user2 fills order
  orderId = result.events[0].args.id
  transaction = await exchange.connect(user2).fillOrder(orderId)
  result = await transaction.wait()
  console.log(`Filled order from ${user1.address}\n`)

  // user1 makes another order
  transaction = await exchange
    .connect(user1)
    .makeOrder(mETH.address, tokens(50), Dapp.address, tokens(15))
  result = await transaction.wait()
  console.log(`Made another order from ${user1.address}`)

  // user2 fills another order
  orderId = result.events[0].args.id
  transaction = await exchange.connect(user2).fillOrder(orderId)
  result = await transaction.wait()
  console.log(`Filled another order from ${user1.address}\n`)

  // Wait 1 second
  await wait(1)

  // User 1 makes final order
  transaction = await exchange
    .connect(user1)
    .makeOrder(mETH.address, tokens(200), Dapp.address, tokens(20))
  result = await transaction.wait()
  console.log(`Made final order from ${user1.address}`)

  // User 2 fills final order
  orderId = result.events[0].args.id
  transaction = await exchange.connect(user2).fillOrder(orderId)
  result = await transaction.wait()
  console.log(`Filled final order from ${user1.address}\n`)

  // Wait 1 second
  await wait(1)

  //////////////////////////
  // Seed Open Orders
  //

  // user1 makes 10 orders
  for (let i = 1; i <= 10; i++) {
    transaction = await exchange
      .connect(user1)
      .makeOrder(mETH.address, tokens(10 * i), Dapp.address, tokens(10))
    result = await transaction.wait()
    console.log(`Made order ${i} from ${user1.address}`)

    // Wait 1 second
    await wait(1)
  }

  // user2 makes 10 orders
  for (let i = 1; i <= 10; i++) {
    transaction = await exchange
      .connect(user2)
      .makeOrder(Dapp.address, tokens(10), mETH.address, tokens(10 * i))
    result = await transaction.wait()
    console.log(`Made order ${i} from ${user2.address}`)

    // Wait 1 second
    await wait(1)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
