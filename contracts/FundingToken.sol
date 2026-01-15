// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FundingToken {
    string public name = "Funding Token";
    string public symbol = "FUND";
    uint8 public decimals = 18;
    uint256 private _totalSupply;
    uint256 public tokenPrice; // Price in wei per token unit
    address public owner;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event TokensPurchased(address indexed buyer, uint256 amount, uint256 cost);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(uint256 initialSupply, uint256 _tokenPrice) {
        owner = msg.sender;
        tokenPrice = _tokenPrice;
        _totalSupply = initialSupply;
        _balances[address(this)] = initialSupply;
        emit Transfer(address(0), address(this), initialSupply);
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(to != address(0), "Transfer to zero address");
        require(_balances[msg.sender] >= amount, "Insufficient balance");

        _balances[msg.sender] -= amount;
        _balances[to] += amount;
        
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function allowance(address tokenOwner, address spender) public view returns (uint256) {
        return _allowances[tokenOwner][spender];
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        require(spender != address(0), "Approve to zero address");

        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public returns (bool) {
        require(from != address(0), "Transfer from zero address");
        require(to != address(0), "Transfer to zero address");
        require(_balances[from] >= amount, "Insufficient balance");
        require(_allowances[from][msg.sender] >= amount, "Insufficient allowance");

        _balances[from] -= amount;
        _balances[to] += amount;
        _allowances[from][msg.sender] -= amount;

        emit Transfer(from, to, amount);
        return true;
    }

    function buyTokens() public payable {
        require(msg.value > 0, "Send ETH to buy tokens");
        require(tokenPrice > 0, "Token price not set");

        // Calculate token amount based on ETH sent
        uint256 tokenAmount = (msg.value * (10 ** decimals)) / tokenPrice;
        require(_balances[address(this)] >= tokenAmount, "Not enough tokens available");

        _balances[address(this)] -= tokenAmount;
        _balances[msg.sender] += tokenAmount;

        emit TokensPurchased(msg.sender, tokenAmount, msg.value);
        emit Transfer(address(this), msg.sender, tokenAmount);
    }

    function withdrawEther() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        payable(owner).transfer(balance);
    }
    
    receive() external payable {
        buyTokens();
    }
}

