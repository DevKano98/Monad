// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../src/ReputationRegistry.sol";

contract ReputationRegistryTest {
    function testUpdateReputation() external {
        ReputationRegistry registry = new ReputationRegistry(address(this));
        registry.updateReputation(address(this), 10, 1, 0);
        ReputationRegistry.Reputation memory reputation = registry.getReputation(address(this));
        require(reputation.score == 10, "score mismatch");
    }
}
