// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../src/FingerprintRegistry.sol";

contract FingerprintRegistryTest {
    function testPublishFingerprint() external {
        FingerprintRegistry registry = new FingerprintRegistry(address(this));
        registry.publishFingerprint("hash", "nodejs", "express", "high", "RedisConnectionTimeout");
        require(registry.getFingerprintCount() == 1, "count mismatch");
        FingerprintRegistry.Fingerprint memory fingerprint = registry.getFingerprint("hash");
        require(fingerprint.matchCount == 1, "match count mismatch");
    }

    function testDuplicatePublishRejected() external {
        FingerprintRegistry registry = new FingerprintRegistry(address(this));
        registry.publishFingerprint("hash", "nodejs", "express", "high", "RedisConnectionTimeout");

        (bool ok,) = address(registry).call(
            abi.encodeWithSelector(
                registry.publishFingerprint.selector,
                "hash",
                "nodejs",
                "express",
                "high",
                "RedisConnectionTimeout"
            )
        );
        require(!ok, "duplicate publish accepted");
    }

    function testReportMatchIncrementsCount() external {
        FingerprintRegistry registry = new FingerprintRegistry(address(this));
        registry.publishFingerprint("hash", "nodejs", "express", "high", "RedisConnectionTimeout");
        registry.reportMatch("hash");

        FingerprintRegistry.Fingerprint memory fingerprint = registry.getFingerprint("hash");
        require(fingerprint.matchCount == 2, "match count mismatch");
    }

    function testFixSubmissionVoteAndDuplicateVoteRejection() external {
        FingerprintRegistry registry = new FingerprintRegistry(address(this));
        registry.publishFingerprint("hash", "nodejs", "express", "high", "RedisConnectionTimeout");
        uint256 fixId = registry.submitFix(
            "hash",
            keccak256(bytes("title")),
            keccak256(bytes("description")),
            address(0xBEEF)
        );

        registry.vote(fixId, address(0xCAFE), true);
        FingerprintRegistry.Fix memory fix = registry.getFix(fixId);
        require(fix.upvotes == 1, "upvote mismatch");
        require(fix.trustScore == 10, "trust score mismatch");

        (bool ok,) = address(registry).call(abi.encodeWithSelector(registry.vote.selector, fixId, address(0xCAFE), true));
        require(!ok, "duplicate vote accepted");
    }
}
