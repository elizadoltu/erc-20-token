import { ethers } from "hardhat";

async function main() {
  console.log("Starting deployment...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy parameters
  const INITIAL_SUPPLY = ethers.parseUnits("1000000", 18); // 1 million tokens
  const TOKEN_PRICE = ethers.parseEther("0.001"); // 0.001 ETH per token
  const FUNDING_GOAL = ethers.parseUnits("10000", 18); // 10,000 tokens
  const SPONSOR_PERCENTAGE = 10; // 10% sponsorship

  // 1. Deploy FundingToken
  console.log("1. Deploying FundingToken...");
  const FundingToken = await ethers.getContractFactory("FundingToken");
  const fundingToken = await FundingToken.deploy(INITIAL_SUPPLY, TOKEN_PRICE);
  await fundingToken.waitForDeployment();
  const tokenAddress = await fundingToken.getAddress();
  console.log("   FundingToken deployed to:", tokenAddress);
  console.log("   Initial supply:", ethers.formatUnits(INITIAL_SUPPLY, 18), "tokens");
  console.log("   Token price:", ethers.formatEther(TOKEN_PRICE), "ETH per token\n");

  // 2. Deploy DistributeFunding
  console.log("2. Deploying DistributeFunding...");
  const DistributeFunding = await ethers.getContractFactory("DistributeFunding");
  const distributeFunding = await DistributeFunding.deploy(tokenAddress);
  await distributeFunding.waitForDeployment();
  const distributeAddress = await distributeFunding.getAddress();
  console.log("   DistributeFunding deployed to:", distributeAddress, "\n");

  // 3. Deploy SponsorFunding
  console.log("3. Deploying SponsorFunding...");
  const SponsorFunding = await ethers.getContractFactory("SponsorFunding");
  const sponsorFunding = await SponsorFunding.deploy(SPONSOR_PERCENTAGE, tokenAddress);
  await sponsorFunding.waitForDeployment();
  const sponsorAddress = await sponsorFunding.getAddress();
  console.log("   SponsorFunding deployed to:", sponsorAddress);
  console.log("   Sponsor percentage:", SPONSOR_PERCENTAGE, "%\n");

  // 4. Deploy CrowdFunding
  console.log("4. Deploying CrowdFunding...");
  const CrowdFunding = await ethers.getContractFactory("CrowdFunding");
  const crowdFunding = await CrowdFunding.deploy(
    FUNDING_GOAL,
    tokenAddress,
    sponsorAddress,
    distributeAddress
  );
  await crowdFunding.waitForDeployment();
  const crowdFundingAddress = await crowdFunding.getAddress();
  console.log("   CrowdFunding deployed to:", crowdFundingAddress);
  console.log("   Funding goal:", ethers.formatUnits(FUNDING_GOAL, 18), "tokens\n");

  // 5. Add shareholders to DistributeFunding
  console.log("5. Adding shareholders to DistributeFunding...");
  const shareholder1 = deployer.address;
  const shareholder2 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Example address
  const shareholder3 = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"; // Example address
  
  await distributeFunding.addShareholder(shareholder1, 50); // 50%
  console.log("   Added shareholder 1:", shareholder1, "- 50%");
  await distributeFunding.addShareholder(shareholder2, 30); // 30%
  console.log("   Added shareholder 2:", shareholder2, "- 30%");
  await distributeFunding.addShareholder(shareholder3, 20); // 20%
  console.log("   Added shareholder 3:", shareholder3, "- 20%");
  console.log("   Total percentage:", await distributeFunding.getTotalPercentage(), "%\n");

  // 6. Fund SponsorFunding with tokens
  console.log("6. Funding SponsorFunding with tokens...");
  const sponsorTokenAmount = ethers.parseUnits("5000", 18); // 5000 tokens for sponsorship
  const ethRequired = (sponsorTokenAmount * TOKEN_PRICE) / ethers.parseUnits("1", 18);
  
  const tx = await sponsorFunding.buyTokensForSponsorship({ value: ethRequired });
  await tx.wait();
  const sponsorBalance = await fundingToken.balanceOf(sponsorAddress);
  console.log("   Sponsor balance:", ethers.formatUnits(sponsorBalance, 18), "tokens");
  console.log("   ETH spent:", ethers.formatEther(ethRequired), "ETH\n");

  // Print summary
  console.log("=".repeat(60));
  console.log("DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("FundingToken:        ", tokenAddress);
  console.log("CrowdFunding:        ", crowdFundingAddress);
  console.log("SponsorFunding:      ", sponsorAddress);
  console.log("DistributeFunding:   ", distributeAddress);
  console.log("=".repeat(60));
  console.log("\nDeployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

