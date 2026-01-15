// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface IFundingToken {
    function buyTokens() external payable;
}

contract SponsorFunding {
    uint256 public sponsorPercentage; // Percentage to sponsor (e.g., 10 for 10%)
    address public owner;
    IERC20 public tokenContract;
    IFundingToken public fundingTokenContract;
    
    event TokensPurchased(uint256 amount, uint256 ethSpent);
    event SponsorshipProvided(address indexed crowdfunding, uint256 amount);
    event SponsorshipFailed(address indexed crowdfunding, uint256 required, uint256 available);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor(uint256 _sponsorPercentage, address _tokenContract) {
        require(_sponsorPercentage > 0 && _sponsorPercentage <= 100, "Invalid percentage");
        require(_tokenContract != address(0), "Invalid token contract address");
        
        owner = msg.sender;
        sponsorPercentage = _sponsorPercentage;
        tokenContract = IERC20(_tokenContract);
        fundingTokenContract = IFundingToken(_tokenContract);
    }
 
    function buyTokensForSponsorship() public payable onlyOwner {
        require(msg.value > 0, "Must send ETH to buy tokens");
        
        uint256 balanceBefore = tokenContract.balanceOf(address(this));
        
        // Buy tokens by calling the FundingToken contract
        fundingTokenContract.buyTokens{value: msg.value}();
        
        uint256 balanceAfter = tokenContract.balanceOf(address(this));
        uint256 tokensPurchased = balanceAfter - balanceBefore;
        
        emit TokensPurchased(tokensPurchased, msg.value);
    }
    
    function sponsorCrowdfunding(address crowdfundingAddress) external returns (bool) {
        require(crowdfundingAddress != address(0), "Invalid crowdfunding address");
        
        // Get the balance of the crowdfunding contract
        uint256 crowdfundingBalance = tokenContract.balanceOf(crowdfundingAddress);
        require(crowdfundingBalance > 0, "Crowdfunding has no balance");
        
        // Calculate sponsorship amount: (balance * percentage) / 100
        uint256 sponsorAmount = (crowdfundingBalance * sponsorPercentage) / 100;
        require(sponsorAmount > 0, "Sponsor amount is zero");
        
        // Check if we have enough tokens
        uint256 availableBalance = tokenContract.balanceOf(address(this));
        
        if (availableBalance < sponsorAmount) {
            emit SponsorshipFailed(crowdfundingAddress, sponsorAmount, availableBalance);
            return false;
        }
        
        // Transfer sponsorship to crowdfunding contract
        require(
            tokenContract.transfer(crowdfundingAddress, sponsorAmount),
            "Token transfer failed"
        );
        
        emit SponsorshipProvided(crowdfundingAddress, sponsorAmount);
        return true;
    }

    function getAvailableBalance() public view returns (uint256) {
        return tokenContract.balanceOf(address(this));
    }
    
    function withdrawTokens(uint256 amount) public onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(
            tokenContract.balanceOf(address(this)) >= amount,
            "Insufficient balance"
        );
        
        require(
            tokenContract.transfer(owner, amount),
            "Token transfer failed"
        );
    }
    
    receive() external payable {
        require(msg.sender == owner, "Only owner can send ETH");
    }
}

