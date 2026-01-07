// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface ISponsorFunding {
    function sponsorCrowdfunding(address crowdfundingAddress) external returns (bool);
}

/**
 * @title CrowdFunding
 * @dev Manages crowdfunding campaign with three states: NEFINANTAT, PREFINANTAT, FINANTAT
 */
contract CrowdFunding {
    enum State { NEFINANTAT, PREFINANTAT, FINANTAT }
    
    State public currentState;
    uint256 public fundingGoal;
    uint256 public totalRaised;
    address public owner;
    
    IERC20 public tokenContract;
    ISponsorFunding public sponsorContract;
    address public distributionContract;
    
    mapping(address => uint256) public contributions;
    
    event Deposit(address indexed contributor, uint256 amount);
    event Withdrawal(address indexed contributor, uint256 amount);
    event GoalReached(uint256 totalAmount);
    event SponsorshipRequested();
    event SponsorshipReceived(uint256 amount);
    event StateChanged(State newState);
    event FundsTransferredToDistribution(uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier inState(State _state) {
        require(currentState == _state, "Invalid state for this operation");
        _;
    }
    
    /**
     * @dev Constructor
     * @param _fundingGoal Target amount to raise in token units
     * @param _tokenContract Address of the ERC-20 token contract
     * @param _sponsorContract Address of the SponsorFunding contract
     * @param _distributionContract Address of the DistributeFunding contract
     */
    constructor(
        uint256 _fundingGoal,
        address _tokenContract,
        address _sponsorContract,
        address _distributionContract
    ) {
        require(_fundingGoal > 0, "Funding goal must be greater than 0");
        require(_tokenContract != address(0), "Invalid token contract address");
        require(_sponsorContract != address(0), "Invalid sponsor contract address");
        require(_distributionContract != address(0), "Invalid distribution contract address");
        
        owner = msg.sender;
        fundingGoal = _fundingGoal;
        tokenContract = IERC20(_tokenContract);
        sponsorContract = ISponsorFunding(_sponsorContract);
        distributionContract = _distributionContract;
        currentState = State.NEFINANTAT;
    }
    
    /**
     * @dev Allows contributors to deposit tokens
     * @param amount Amount of tokens to deposit
     */
    function deposit(uint256 amount) public inState(State.NEFINANTAT) {
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer tokens from contributor to this contract
        require(
            tokenContract.transferFrom(msg.sender, address(this), amount),
            "Token transfer failed"
        );
        
        contributions[msg.sender] += amount;
        totalRaised += amount;
        
        emit Deposit(msg.sender, amount);
        
        // Check if funding goal is reached
        if (totalRaised >= fundingGoal) {
            currentState = State.PREFINANTAT;
            emit GoalReached(totalRaised);
            emit StateChanged(State.PREFINANTAT);
        }
    }
    
    /**
     * @dev Allows contributors to withdraw their contributions
     * @param amount Amount to withdraw (0 means withdraw all)
     */
    function withdraw(uint256 amount) public inState(State.NEFINANTAT) {
        require(contributions[msg.sender] > 0, "No contributions to withdraw");
        
        uint256 withdrawAmount = amount;
        if (amount == 0) {
            withdrawAmount = contributions[msg.sender];
        }
        
        require(contributions[msg.sender] >= withdrawAmount, "Insufficient contribution balance");
        
        contributions[msg.sender] -= withdrawAmount;
        totalRaised -= withdrawAmount;
        
        require(
            tokenContract.transfer(msg.sender, withdrawAmount),
            "Token transfer failed"
        );
        
        emit Withdrawal(msg.sender, withdrawAmount);
    }
    
    /**
     * @dev Owner requests sponsorship from SponsorFunding contract
     */
    function requestSponsorship() public onlyOwner inState(State.PREFINANTAT) {
        emit SponsorshipRequested();
        
        uint256 balanceBefore = tokenContract.balanceOf(address(this));
        
        // Request sponsorship
        bool success = sponsorContract.sponsorCrowdfunding(address(this));
        
        if (success) {
            uint256 balanceAfter = tokenContract.balanceOf(address(this));
            uint256 sponsorAmount = balanceAfter - balanceBefore;
            
            if (sponsorAmount > 0) {
                totalRaised += sponsorAmount;
                emit SponsorshipReceived(sponsorAmount);
            }
        }
        
        // Move to FINANTAT state regardless of sponsorship success
        currentState = State.FINANTAT;
        emit StateChanged(State.FINANTAT);
    }
    
    /**
     * @dev Owner transfers funds to DistributeFunding contract
     */
    function transferToDistribution() public onlyOwner inState(State.FINANTAT) {
        require(totalRaised > 0, "No funds to transfer");
        
        uint256 amount = totalRaised;
        
        require(
            tokenContract.transfer(distributionContract, amount),
            "Token transfer failed"
        );
        
        emit FundsTransferredToDistribution(amount);
    }
    
    /**
     * @dev Returns the current state as a string
     */
    function getState() public view returns (string memory) {
        if (currentState == State.NEFINANTAT) {
            return "nefinantat";
        } else if (currentState == State.PREFINANTAT) {
            return "prefinantat";
        } else {
            return "finantat";
        }
    }
    
    /**
     * @dev Returns the contribution balance of a contributor
     */
    function getContributorBalance(address contributor) public view returns (uint256) {
        return contributions[contributor];
    }
    
    /**
     * @dev Returns the current token balance of the contract
     */
    function getBalance() public view returns (uint256) {
        return tokenContract.balanceOf(address(this));
    }
}

