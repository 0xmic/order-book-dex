import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('Greeter', function () {
  let greeter

  beforeEach(async function () {
    const Greeter = await ethers.getContractFactory('Greeter')
    greeter = await Greeter.deploy()
    await greeter.deployed()
  })

  describe('Deployment', function () {
    it('Should set the default greeting', async function () {
      const greeting = await greeter.get()
      expect(greeting).to.equal('Hello, World!')
    })
  })

  describe('set()', function () {
    it('Should set a new greeting', async function () {
      const newGreeting = 'Hello, Ethereum!'
      await greeter.set(newGreeting)
      const greeting = await greeter.get()
      expect(greeting).to.equal(newGreeting)
    })
  })

  describe('get()', function () {
    it('Should return the correct greeting', async function () {
      const initialGreeting = await greeter.get()
      expect(initialGreeting).to.equal('Hello, World!')

      const newGreeting = 'Hello, Ethereum!'
      await greeter.set(newGreeting)
      const updatedGreeting = await greeter.get()
      expect(updatedGreeting).to.equal(newGreeting)
    })
  })
})
