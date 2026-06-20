// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../src/FingerprintRegistry.sol";
import "../src/ReputationRegistry.sol";

contract Deploy {
    FingerprintRegistry public fingerprintRegistry;
    ReputationRegistry public reputationRegistry;

    constructor() {
        fingerprintRegistry = new FingerprintRegistry(msg.sender);
        reputationRegistry = new ReputationRegistry(msg.sender);
    }
}
