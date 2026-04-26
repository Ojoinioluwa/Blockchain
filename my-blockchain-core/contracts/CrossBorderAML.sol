// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CrossBorderAML {
    address public bankAdmin;
    uint256 public constant DAILY_LIMIT = 10000 * 10**18;

    mapping(address => bool) public isWhitelisted;
    mapping(address => uint256) public dailyVolume;
    mapping(address => uint256) public lastTransferTimestamp; // Track the time

    event TransferVerified(address indexed from, address indexed to, uint256 amount);
    event ComplianceUpdated(address indexed user, bool status);

    constructor() {
        bankAdmin = msg.sender;
    }

    modifier onlyBank() {
        require(msg.sender == bankAdmin, "Not authorized");
        _;
    }

    function updateComplianceStatus(address _user, bool _status) external onlyBank {
        isWhitelisted[_user] = _status;
        emit ComplianceUpdated(_user, _status);
    }

    function initiateTransfer(address _to, uint256 _amount) external {
        require(isWhitelisted[msg.sender], "Sender failed AML check");
        require(isWhitelisted[_to], "Recipient failed AML check");

        // Logic: If 24 hours have passed since the last transfer, reset the volume
        if (block.timestamp >= lastTransferTimestamp[msg.sender] + 1 days) {
            dailyVolume[msg.sender] = 0;
        }

        require(dailyVolume[msg.sender] + _amount <= DAILY_LIMIT, "Daily limit exceeded");

        dailyVolume[msg.sender] += _amount;
        lastTransferTimestamp[msg.sender] = block.timestamp; // Update time
        
        emit TransferVerified(msg.sender, _to, _amount);
    }
}