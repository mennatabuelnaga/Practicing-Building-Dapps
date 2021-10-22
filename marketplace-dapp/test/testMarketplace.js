require('chai')
  .use(require('chai-as-promised'))
  .should()

const Marketplace = artifacts.require("./Marketplace.sol");

contract("Marketplace", ([deployer, seller, buyer]) => {

  let marketplaceInstance;
  before(async() => {
    marketplace = await Marketplace.deployed();
  });



  describe("deployment", async() => {

    it('deploys successfully', async () => {
      const address = await marketplace.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    });

    it("has a name", async () => {
    const storedName = await marketplace.name();
    assert.equal(storedName, "my first dapp trial");
    });

  });



  describe("products", async() => {
    let product, productsCount;
    before(async() => {
      product = await marketplace.createProduct("iPhone X", web3.utils.toWei('1', 'Ether'), {from : seller});
      productsCount = await marketplace.productsCount();
    });

    it("creates products", async() => {
      assert.equal(productsCount, 1);
      const event = product.logs[0].args;
      assert.equal(event.id.toNumber(), productsCount.toNumber());
      assert.equal(event.owner, seller);

      await marketplace.createProduct('', web3.utils.toWei('1', 'Ether'), { from: seller }).should.be.rejected;
    });

    it('sells products', async () => {
      // Track the seller balance before purchase
      let oldSellerBalance
      oldSellerBalance = await web3.eth.getBalance(seller)
      oldSellerBalance = new web3.utils.BN(oldSellerBalance)

      // SUCCESS: Buyer makes purchase
      result = await marketplace.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('1', 'Ether')})

      // Check logs
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
      assert.equal(event.name, 'iPhone X', 'name is correct')
      assert.equal(event.price, web3.utils.toWei('1', 'Ether'), 'price is correct')
      assert.equal(event.owner, buyer, 'owner is correct')
      assert.equal(event.purchased, true, 'purchased is correct')

      // Check that seller received funds
      let newSellerBalance
      newSellerBalance = await web3.eth.getBalance(seller)
      newSellerBalance = new web3.utils.BN(newSellerBalance)

      let price
      price = web3.utils.toWei('1', 'Ether')
      price = new web3.utils.BN(price)

      const exepectedBalance = oldSellerBalance.add(price)

      assert.equal(newSellerBalance.toString(), exepectedBalance.toString())

      // FAILURE: Tries to buy a product that does not exist, i.e., product must have valid id
      await marketplace.purchaseProduct(99, { from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;      // FAILURE: Buyer tries to buy without enough ether
      // FAILURE: Buyer tries to buy without enough ether
      await marketplace.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('0.5', 'Ether') }).should.be.rejected;
      // FAILURE: Deployer tries to buy the product, i.e., product can't be purchased twice
      await marketplace.purchaseProduct(productCount, { from: deployer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
      // FAILURE: Buyer tries to buy again, i.e., buyer can't be the seller
      await marketplace.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;
    })

  });
  
});
