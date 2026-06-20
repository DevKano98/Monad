// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../src/FingerprintRegistry.sol";

contract FingerprintRegistryTest {
    function testPublishFingerprint() external {
        FingerprintRegistry registry = new FingerprintRegistry(address(this));
        registry.publishFingerprint("hash", "nodejs", "express", "high");
        require(registry.getFingerprintCount() == 1, "count mismatch");
    }
}
