// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ReputationRegistry is Ownable {
    struct Reputation {
        address wallet;
        int256 score;
        uint256 successfulFixes;
        uint256 failedFixes;
        uint256 updatedAt;
    }

    mapping(address => Reputation) private reputations;

    event ReputationSubmitted(address indexed wallet, int256 score);
    event ReputationUpdated(address indexed wallet, int256 score, uint256 successfulFixes, uint256 failedFixes);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function submitReputation(address wallet, int256 score, uint256 successfulFixes, uint256 failedFixes) external {
        require(wallet != address(0), "wallet required");
        reputations[wallet] = Reputation(wallet, score, successfulFixes, failedFixes, block.timestamp);
        emit ReputationSubmitted(wallet, score);
    }

    function updateReputation(address wallet, int256 score, uint256 successfulFixes, uint256 failedFixes) external {
        require(wallet != address(0), "wallet required");
        reputations[wallet] = Reputation(wallet, score, successfulFixes, failedFixes, block.timestamp);
        emit ReputationUpdated(wallet, score, successfulFixes, failedFixes);
    }

    function getReputation(address wallet) external view returns (Reputation memory) {
        return reputations[wallet];
    }
}
