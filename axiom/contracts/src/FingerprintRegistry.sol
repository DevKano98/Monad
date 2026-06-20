// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract FingerprintRegistry is Ownable {
    struct Fingerprint {
        string hashValue;
        string language;
        string framework;
        string severity;
        uint256 timestamp;
    }

    mapping(string => Fingerprint) private fingerprints;
    string[] private hashes;

    event FingerprintPublished(string indexed hashValue, string language, string framework, string severity);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function publishFingerprint(
        string calldata hashValue,
        string calldata language,
        string calldata framework,
        string calldata severity
    ) external {
        require(bytes(hashValue).length > 0, "hash required");
        require(fingerprints[hashValue].timestamp == 0, "already published");
        fingerprints[hashValue] = Fingerprint(hashValue, language, framework, severity, block.timestamp);
        hashes.push(hashValue);
        emit FingerprintPublished(hashValue, language, framework, severity);
    }

    function getFingerprint(string calldata hashValue) external view returns (Fingerprint memory) {
        return fingerprints[hashValue];
    }

    function getFingerprintCount() external view returns (uint256) {
        return hashes.length;
    }
}
