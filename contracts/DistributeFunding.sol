// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract DistributeFunding {
    struct Shareholder {
        address addr;
        uint256 percentage;
        bool withdrawn;
        bool exists;
    }
    
    address public owner;
    IERC20 public tokenContract;
    uint256 public totalReceived;
    bool public fundsReceived;
    
    mapping(address => Shareholder) public shareholders;
    address[] public shareholderAddresses;
    
    event ShareholderAdded(address indexed shareholder, uint256 percentage);
    event FundsReceived(uint256 amount);
    event ShareWithdrawn(address indexed shareholder, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier beforeFundsReceived() {
        require(!fundsReceived, "Funds already received, cannot modify shareholders");
        _;
    }
    
    modifier afterFundsReceived() {
        require(fundsReceived, "Funds not yet received");
        _;
    }

    constructor(address _tokenContract) {
        require(_tokenContract != address(0), "Invalid token contract address");
        
        owner = msg.sender;
        tokenContract = IERC20(_tokenContract);
        fundsReceived = false;
        totalReceived = 0;
    }
  
    function addShareholder(address addr, uint256 percentage) public onlyOwner beforeFundsReceived {
        require(addr != address(0), "Invalid shareholder address");
        require(percentage > 0 && percentage <= 100, "Invalid percentage");
        require(!shareholders[addr].exists, "Shareholder already exists");
        
        uint256 totalPercentage = getTotalPercentage() + percentage;
        require(totalPercentage <= 100, "Total percentage exceeds 100%");
        
        shareholders[addr] = Shareholder({
            addr: addr,
            percentage: percentage,
            withdrawn: false,
            exists: true
        });
        
        shareholderAddresses.push(addr);
        
        emit ShareholderAdded(addr, percentage);
    }
    
    function receiveFunds(uint256 amount) public onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(!fundsReceived, "Funds already received");
        
        // Verify the tokens were actually received
        uint256 balance = tokenContract.balanceOf(address(this));
        require(balance >= amount, "Insufficient tokens received");
        
        totalReceived = amount;
        fundsReceived = true;
        
        emit FundsReceived(amount);
    }
 
    function withdrawShare() public afterFundsReceived {
        require(shareholders[msg.sender].exists, "Not a shareholder");
        require(!shareholders[msg.sender].withdrawn, "Share already withdrawn");
        
        Shareholder storage shareholder = shareholders[msg.sender];
        
        // Calculate share: (totalReceived * percentage) / 100
        uint256 shareAmount = (totalReceived * shareholder.percentage) / 100;
        require(shareAmount > 0, "Share amount is zero");
        
        // Mark as withdrawn before transfer (reentrancy protection)
        shareholder.withdrawn = true;
        
        require(
            tokenContract.transfer(msg.sender, shareAmount),
            "Token transfer failed"
        );
        
        emit ShareWithdrawn(msg.sender, shareAmount);
    }

    function getShareholderInfo(address addr) public view returns (
        uint256 percentage,
        bool withdrawn,
        bool exists
    ) {
        Shareholder memory shareholder = shareholders[addr];
        return (shareholder.percentage, shareholder.withdrawn, shareholder.exists);
    }
    
    function getTotalPercentage() public view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < shareholderAddresses.length; i++) {
            total += shareholders[shareholderAddresses[i]].percentage;
        }
        return total;
    }
  
    function getShareholderCount() public view returns (uint256) {
        return shareholderAddresses.length;
    }
    
    function getShareholderAddress(uint256 index) public view returns (address) {
        require(index < shareholderAddresses.length, "Index out of bounds");
        return shareholderAddresses[index];
    }
   
    function calculateShare(address addr) public view returns (uint256) {
        require(shareholders[addr].exists, "Not a shareholder");
        if (!fundsReceived) {
            return 0;
        }
        return (totalReceived * shareholders[addr].percentage) / 100;
    }
}

