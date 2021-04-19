const { assert } = require("chai");
const Web3 = require("web3");

/* eslint-disable no-undef */
const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function tokens(n) {
  return Web3.utils.toWei(n, "ether");
}
contract("TokenFarm", accounts => {
  let daiToken, dappToken, tokenFarm;
  before(async () => {
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);
    await dappToken.transfer(tokenFarm.address, tokens("1000000"));
    await daiToken.transfer(accounts[1], tokens("1000000"), {
      from: accounts[0]
    });
  });

  describe("Mock Dai deployment", async () => {
    it("has a name", async () => {
      const name = await daiToken.name();
      assert.equal(name, "Mock DAI Token");
    });
  });
  describe("Dapp Token deployment", async () => {
    it("has a name", async () => {
      const name = await dappToken.name();
      assert.equal(name, "DApp Token");
    });
  });
  describe("Token Farm deployment", async () => {
    it("has a name", async () => {
      const name = await tokenFarm.name();
      assert.equal(name, "Dapp  Token Farm");
    });
    it("contract has tokens", async () => {
      let balance = await dappToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), tokens("1000000"));
    });
  });

  describe("Farming tokens", async () => {
    it("rewards investors for staking mDai tokens", async () => {
      let result;
      result = await daiToken.balanceOf(accounts[1]);
      assert.equal(result.toString(), tokens("1000000"));

      await daiToken.approve(tokenFarm.address, tokens("1000000"), {
        from: accounts[1]
      });

      await tokenFarm.stakeTokens(tokens("1000000"), { from: accounts[1] });

      result = await daiToken.balanceOf(accounts[1]);
      assert.equal(
        result.toString(),
        tokens("0"),
        "investor mock DAI wallet balance correct after staking"
      );

      result = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(
        result.toString(),
        tokens("1000000"),
        "Token Farm Mock DAI balance correct after staking"
      );

      result = await tokenFarm.stakingBalance(accounts[1]);
      assert.equal(
        result.toString(),
        tokens("1000000"),
        "investor staking balance correct after staking"
      );

      result = await tokenFarm.isStaking(accounts[1]);
      assert.equal(
        result.toString(),
        "true",
        "investor staking status correct after staking"
      );

      await tokenFarm.issueTokens({ from: accounts[0] });

      result = await dappToken.balanceOf(accounts[1]);
      assert.equal(
        result.toString(),
        tokens("1000000"),
        "investor Dapp token wallet balance correct after issuning"
      );

      await tokenFarm.issueTokens({ from: accounts[1] }).should.be.rejected;

      await tokenFarm.unstakeTokens({ from: accounts[1] });

      result = await daiToken.balanceOf(accounts[1]);
      assert.equal(result.toString(), tokens("1000000"));

      result = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(result.toString(), tokens("0"));

      result = await tokenFarm.stakingBalance(accounts[1]);
      assert.equal(result.toString(), tokens("0"));

      result = await tokenFarm.isStaking(accounts[1]);
      assert.equal(result.toString(), "false");
    });
  });
});
