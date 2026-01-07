import { expect } from "chai";
import { ethers } from "hardhat";
import { FundingToken, CrowdFunding, SponsorFunding, DistributeFunding } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("ERC-20 Funding System", function () {
  let fundingToken: FundingToken;
  let crowdFunding: CrowdFunding;
  let sponsorFunding: SponsorFunding;
  let distributeFunding: DistributeFunding;
  
  let owner: SignerWithAddress;
  let contributor1: SignerWithAddress;
  let contributor2: SignerWithAddress;
  let shareholder1: SignerWithAddress;
  let shareholder2: SignerWithAddress;
  let shareholder3: SignerWithAddress;
  
  const INITIAL_SUPPLY = ethers.parseUnits("1000000", 18);
  const TOKEN_PRICE = ethers.parseEther("0.001");
  const FUNDING_GOAL = ethers.parseUnits("10000", 18);
  const SPONSOR_PERCENTAGE = 10;
  
  beforeEach(async function () {
    [owner, contributor1, contributor2, shareholder1, shareholder2, shareholder3] = await ethers.getSigners();
    
    // Deploy FundingToken
    const FundingToken = await ethers.getContractFactory("FundingToken");
    fundingToken = await FundingToken.deploy(INITIAL_SUPPLY, TOKEN_PRICE);
    await fundingToken.waitForDeployment();
    
    // Deploy DistributeFunding
    const DistributeFunding = await ethers.getContractFactory("DistributeFunding");
    distributeFunding = await DistributeFunding.deploy(await fundingToken.getAddress());
    await distributeFunding.waitForDeployment();
    
    // Deploy SponsorFunding
    const SponsorFunding = await ethers.getContractFactory("SponsorFunding");
    sponsorFunding = await SponsorFunding.deploy(SPONSOR_PERCENTAGE, await fundingToken.getAddress());
    await sponsorFunding.waitForDeployment();
    
    // Deploy CrowdFunding
    const CrowdFunding = await ethers.getContractFactory("CrowdFunding");
    crowdFunding = await CrowdFunding.deploy(
      FUNDING_GOAL,
      await fundingToken.getAddress(),
      await sponsorFunding.getAddress(),
      await distributeFunding.getAddress()
    );
    await crowdFunding.waitForDeployment();
    
    // Owner buys tokens for testing purposes
    await fundingToken.connect(owner).buyTokens({ value: ethers.parseEther("100") });
  });
  
  describe("FundingToken", function () {
    it("Should deploy with correct initial supply", async function () {
      expect(await fundingToken.totalSupply()).to.equal(INITIAL_SUPPLY);
      // Note: Owner bought some tokens in beforeEach, so contract balance is less than initial supply
      const contractBalance = await fundingToken.balanceOf(await fundingToken.getAddress());
      const ownerBalance = await fundingToken.balanceOf(owner.address);
      expect(contractBalance + ownerBalance).to.equal(INITIAL_SUPPLY);
    });
    
    it("Should have correct token metadata", async function () {
      expect(await fundingToken.name()).to.equal("Funding Token");
      expect(await fundingToken.symbol()).to.equal("FUND");
      expect(await fundingToken.decimals()).to.equal(18);
    });
    
    it("Should allow buying tokens with ETH", async function () {
      const ethAmount = ethers.parseEther("1");
      const expectedTokens = (ethAmount * ethers.parseUnits("1", 18)) / TOKEN_PRICE;
      
      await fundingToken.connect(contributor1).buyTokens({ value: ethAmount });
      
      expect(await fundingToken.balanceOf(contributor1.address)).to.equal(expectedTokens);
    });
    
    it("Should transfer tokens correctly", async function () {
      const amount = ethers.parseUnits("100", 18);
      
      // Buy tokens first
      await fundingToken.connect(contributor1).buyTokens({ value: ethers.parseEther("0.1") });
      
      const balance = await fundingToken.balanceOf(contributor1.address);
      await fundingToken.connect(contributor1).transfer(contributor2.address, amount);
      
      expect(await fundingToken.balanceOf(contributor2.address)).to.equal(amount);
      expect(await fundingToken.balanceOf(contributor1.address)).to.equal(balance - amount);
    });
    
    it("Should handle approve and transferFrom", async function () {
      const amount = ethers.parseUnits("100", 18);
      
      await fundingToken.connect(contributor1).buyTokens({ value: ethers.parseEther("0.1") });
      await fundingToken.connect(contributor1).approve(contributor2.address, amount);
      
      expect(await fundingToken.allowance(contributor1.address, contributor2.address)).to.equal(amount);
      
      await fundingToken.connect(contributor2).transferFrom(contributor1.address, contributor2.address, amount);
      expect(await fundingToken.balanceOf(contributor2.address)).to.equal(amount);
    });
    
    it("Should fail to buy tokens without sending ETH", async function () {
      await expect(
        fundingToken.connect(contributor1).buyTokens({ value: 0 })
      ).to.be.revertedWith("Send ETH to buy tokens");
    });
  });
  
  describe("CrowdFunding", function () {
    beforeEach(async function () {
      // Contributors buy tokens
      await fundingToken.connect(contributor1).buyTokens({ value: ethers.parseEther("10") });
      await fundingToken.connect(contributor2).buyTokens({ value: ethers.parseEther("10") });
    });
    
    it("Should start in NEFINANTAT state", async function () {
      expect(await crowdFunding.getState()).to.equal("nefinantat");
    });
    
    it("Should allow deposits in NEFINANTAT state", async function () {
      const amount = ethers.parseUnits("1000", 18);
      
      await fundingToken.connect(contributor1).approve(await crowdFunding.getAddress(), amount);
      await crowdFunding.connect(contributor1).deposit(amount);
      
      expect(await crowdFunding.getContributorBalance(contributor1.address)).to.equal(amount);
      expect(await crowdFunding.totalRaised()).to.equal(amount);
    });
    
    it("Should allow withdrawals in NEFINANTAT state", async function () {
      const amount = ethers.parseUnits("1000", 18);
      
      await fundingToken.connect(contributor1).approve(await crowdFunding.getAddress(), amount);
      await crowdFunding.connect(contributor1).deposit(amount);
      
      const balanceBefore = await fundingToken.balanceOf(contributor1.address);
      await crowdFunding.connect(contributor1).withdraw(amount);
      
      expect(await crowdFunding.getContributorBalance(contributor1.address)).to.equal(0);
      expect(await fundingToken.balanceOf(contributor1.address)).to.equal(balanceBefore + amount);
    });
    
    it("Should transition to PREFINANTAT when goal is reached", async function () {
      await fundingToken.connect(contributor1).approve(await crowdFunding.getAddress(), FUNDING_GOAL);
      await crowdFunding.connect(contributor1).deposit(FUNDING_GOAL);
      
      expect(await crowdFunding.getState()).to.equal("prefinantat");
    });
    
    it("Should not allow deposits after goal is reached", async function () {
      await fundingToken.connect(contributor1).approve(await crowdFunding.getAddress(), FUNDING_GOAL);
      await crowdFunding.connect(contributor1).deposit(FUNDING_GOAL);
      
      const extraAmount = ethers.parseUnits("100", 18);
      await fundingToken.connect(contributor2).approve(await crowdFunding.getAddress(), extraAmount);
      
      await expect(
        crowdFunding.connect(contributor2).deposit(extraAmount)
      ).to.be.revertedWith("Invalid state for this operation");
    });
    
    it("Should not allow withdrawals after goal is reached", async function () {
      const amount = ethers.parseUnits("5000", 18);
      await fundingToken.connect(contributor1).approve(await crowdFunding.getAddress(), amount);
      await crowdFunding.connect(contributor1).deposit(amount);
      
      await fundingToken.connect(contributor2).approve(await crowdFunding.getAddress(), amount);
      await crowdFunding.connect(contributor2).deposit(amount);
      
      await expect(
        crowdFunding.connect(contributor1).withdraw(amount)
      ).to.be.revertedWith("Invalid state for this operation");
    });
  });
  
  describe("SponsorFunding", function () {
    it("Should deploy with correct percentage", async function () {
      expect(await sponsorFunding.sponsorPercentage()).to.equal(SPONSOR_PERCENTAGE);
    });
    
    it("Should allow owner to buy tokens for sponsorship", async function () {
      const ethAmount = ethers.parseEther("1");
      const expectedTokens = (ethAmount * ethers.parseUnits("1", 18)) / TOKEN_PRICE;
      
      await sponsorFunding.connect(owner).buyTokensForSponsorship({ value: ethAmount });
      
      expect(await fundingToken.balanceOf(await sponsorFunding.getAddress())).to.equal(expectedTokens);
    });
    
    it("Should provide sponsorship if sufficient balance", async function () {
      // Fund sponsor contract
      await sponsorFunding.connect(owner).buyTokensForSponsorship({ value: ethers.parseEther("2") });
      
      // Reach funding goal
      await fundingToken.connect(contributor1).buyTokens({ value: ethers.parseEther("10") });
      await fundingToken.connect(contributor1).approve(await crowdFunding.getAddress(), FUNDING_GOAL);
      await crowdFunding.connect(contributor1).deposit(FUNDING_GOAL);
      
      // Request sponsorship
      await crowdFunding.connect(owner).requestSponsorship();
      
      const expectedSponsorship = (FUNDING_GOAL * BigInt(SPONSOR_PERCENTAGE)) / BigInt(100);
      expect(await crowdFunding.totalRaised()).to.be.gte(FUNDING_GOAL + expectedSponsorship);
      expect(await crowdFunding.getState()).to.equal("finantat");
    });
    
    it("Should fail sponsorship if insufficient balance", async function () {
      // Don't fund sponsor contract
      
      // Reach funding goal
      await fundingToken.connect(contributor1).buyTokens({ value: ethers.parseEther("10") });
      await fundingToken.connect(contributor1).approve(await crowdFunding.getAddress(), FUNDING_GOAL);
      await crowdFunding.connect(contributor1).deposit(FUNDING_GOAL);
      
      // Request sponsorship (should fail but still transition state)
      await crowdFunding.connect(owner).requestSponsorship();
      
      expect(await crowdFunding.totalRaised()).to.equal(FUNDING_GOAL);
      expect(await crowdFunding.getState()).to.equal("finantat");
    });
    
    it("Should not allow non-owner to buy tokens", async function () {
      await expect(
        sponsorFunding.connect(contributor1).buyTokensForSponsorship({ value: ethers.parseEther("1") })
      ).to.be.revertedWith("Only owner can call this function");
    });
  });
  
  describe("DistributeFunding", function () {
    beforeEach(async function () {
      // Add shareholders
      await distributeFunding.addShareholder(shareholder1.address, 50);
      await distributeFunding.addShareholder(shareholder2.address, 30);
      await distributeFunding.addShareholder(shareholder3.address, 20);
    });
    
    it("Should add shareholders correctly", async function () {
      const info1 = await distributeFunding.getShareholderInfo(shareholder1.address);
      expect(info1.percentage).to.equal(50);
      expect(info1.exists).to.be.true;
      
      expect(await distributeFunding.getTotalPercentage()).to.equal(100);
    });
    
    it("Should not allow adding shareholders after funds received", async function () {
      const amount = ethers.parseUnits("1000", 18);
      await fundingToken.transfer(await distributeFunding.getAddress(), amount);
      await distributeFunding.receiveFunds(amount);
      
      await expect(
        distributeFunding.addShareholder(contributor1.address, 10)
      ).to.be.revertedWith("Funds already received, cannot modify shareholders");
    });
    
    it("Should not allow total percentage to exceed 100%", async function () {
      await expect(
        distributeFunding.addShareholder(contributor1.address, 1)
      ).to.be.revertedWith("Total percentage exceeds 100%");
    });
    
    it("Should allow shareholders to withdraw their share", async function () {
      const amount = ethers.parseUnits("1000", 18);
      
      // Transfer funds to distribution contract
      await fundingToken.transfer(await distributeFunding.getAddress(), amount);
      await distributeFunding.receiveFunds(amount);
      
      // Shareholder1 (50%) withdraws
      await distributeFunding.connect(shareholder1).withdrawShare();
      
      const expectedShare = (amount * BigInt(50)) / BigInt(100);
      expect(await fundingToken.balanceOf(shareholder1.address)).to.equal(expectedShare);
    });
    
    it("Should not allow double withdrawal", async function () {
      const amount = ethers.parseUnits("1000", 18);
      
      await fundingToken.transfer(await distributeFunding.getAddress(), amount);
      await distributeFunding.receiveFunds(amount);
      
      await distributeFunding.connect(shareholder1).withdrawShare();
      
      await expect(
        distributeFunding.connect(shareholder1).withdrawShare()
      ).to.be.revertedWith("Share already withdrawn");
    });
    
    it("Should not allow non-shareholders to withdraw", async function () {
      const amount = ethers.parseUnits("1000", 18);
      
      await fundingToken.transfer(await distributeFunding.getAddress(), amount);
      await distributeFunding.receiveFunds(amount);
      
      await expect(
        distributeFunding.connect(contributor1).withdrawShare()
      ).to.be.revertedWith("Not a shareholder");
    });
    
    it("Should calculate shares correctly", async function () {
      const amount = ethers.parseUnits("1000", 18);
      
      await fundingToken.transfer(await distributeFunding.getAddress(), amount);
      await distributeFunding.receiveFunds(amount);
      
      expect(await distributeFunding.calculateShare(shareholder1.address)).to.equal(ethers.parseUnits("500", 18));
      expect(await distributeFunding.calculateShare(shareholder2.address)).to.equal(ethers.parseUnits("300", 18));
      expect(await distributeFunding.calculateShare(shareholder3.address)).to.equal(ethers.parseUnits("200", 18));
    });
  });
  
  describe("Integration: Full Flow", function () {
    it("Should complete full crowdfunding cycle with sponsorship and distribution", async function () {
      // Setup: Add shareholders
      await distributeFunding.addShareholder(shareholder1.address, 50);
      await distributeFunding.addShareholder(shareholder2.address, 30);
      await distributeFunding.addShareholder(shareholder3.address, 20);
      
      // Fund sponsor contract
      await sponsorFunding.connect(owner).buyTokensForSponsorship({ value: ethers.parseEther("5") });
      
      // Contributors buy tokens (need enough for deposits)
      // FUNDING_GOAL = 10000 tokens, token price = 0.001 ETH
      // So we need 10 ETH worth of tokens minimum
      await fundingToken.connect(contributor1).buyTokens({ value: ethers.parseEther("6") });
      await fundingToken.connect(contributor2).buyTokens({ value: ethers.parseEther("4") });
      
      // Phase 1: NEFINANTAT - Contributors deposit
      const contrib1Amount = ethers.parseUnits("6000", 18);
      const contrib2Amount = ethers.parseUnits("4000", 18);
      
      await fundingToken.connect(contributor1).approve(await crowdFunding.getAddress(), contrib1Amount);
      await crowdFunding.connect(contributor1).deposit(contrib1Amount);
      
      expect(await crowdFunding.getState()).to.equal("nefinantat");
      
      await fundingToken.connect(contributor2).approve(await crowdFunding.getAddress(), contrib2Amount);
      await crowdFunding.connect(contributor2).deposit(contrib2Amount);
      
      // Phase 2: PREFINANTAT - Goal reached
      expect(await crowdFunding.getState()).to.equal("prefinantat");
      expect(await crowdFunding.totalRaised()).to.equal(FUNDING_GOAL);
      
      // Phase 3: Request sponsorship
      await crowdFunding.connect(owner).requestSponsorship();
      
      expect(await crowdFunding.getState()).to.equal("finantat");
      const expectedSponsorship = (FUNDING_GOAL * BigInt(SPONSOR_PERCENTAGE)) / BigInt(100);
      expect(await crowdFunding.totalRaised()).to.be.gte(FUNDING_GOAL + expectedSponsorship);
      
      // Phase 4: Transfer to distribution
      const totalAmount = await crowdFunding.totalRaised();
      await crowdFunding.connect(owner).transferToDistribution();
      await distributeFunding.receiveFunds(totalAmount);
      
      // Phase 5: Shareholders withdraw
      await distributeFunding.connect(shareholder1).withdrawShare();
      await distributeFunding.connect(shareholder2).withdrawShare();
      await distributeFunding.connect(shareholder3).withdrawShare();
      
      const expectedShare1 = (totalAmount * BigInt(50)) / BigInt(100);
      const expectedShare2 = (totalAmount * BigInt(30)) / BigInt(100);
      const expectedShare3 = (totalAmount * BigInt(20)) / BigInt(100);
      
      expect(await fundingToken.balanceOf(shareholder1.address)).to.equal(expectedShare1);
      expect(await fundingToken.balanceOf(shareholder2.address)).to.equal(expectedShare2);
      expect(await fundingToken.balanceOf(shareholder3.address)).to.equal(expectedShare3);
    });
    
    it("Should handle case with <100% shareholder allocation", async function () {
      // Add shareholders totaling 80%
      await distributeFunding.addShareholder(shareholder1.address, 50);
      await distributeFunding.addShareholder(shareholder2.address, 30);
      
      const amount = ethers.parseUnits("1000", 18);
      await fundingToken.transfer(await distributeFunding.getAddress(), amount);
      await distributeFunding.receiveFunds(amount);
      
      await distributeFunding.connect(shareholder1).withdrawShare();
      await distributeFunding.connect(shareholder2).withdrawShare();
      
      // 20% should remain in contract
      const remaining = await fundingToken.balanceOf(await distributeFunding.getAddress());
      expect(remaining).to.equal(ethers.parseUnits("200", 18));
    });
    
    it("Should handle withdrawal before sponsorship", async function () {
      // Contributors deposit but don't reach goal
      await fundingToken.connect(contributor1).buyTokens({ value: ethers.parseEther("5") });
      const amount = ethers.parseUnits("5000", 18);
      
      await fundingToken.connect(contributor1).approve(await crowdFunding.getAddress(), amount);
      await crowdFunding.connect(contributor1).deposit(amount);
      
      // Should be able to withdraw
      const balanceBefore = await fundingToken.balanceOf(contributor1.address);
      await crowdFunding.connect(contributor1).withdraw(amount);
      
      expect(await fundingToken.balanceOf(contributor1.address)).to.equal(balanceBefore + amount);
    });
  });
});

