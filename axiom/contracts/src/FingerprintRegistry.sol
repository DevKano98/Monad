// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract FingerprintRegistry is Ownable {
    struct Fingerprint {
        string hashValue;
        string language;
        string framework;
        string severity;
        string errorType;
        uint256 matchCount;
        uint256 fixCount;
        uint256 timestamp;
    }

    struct Fix {
        uint256 id;
        string fingerprintHash;
        address submitter;
        bytes32 titleHash;
        bytes32 descriptionHash;
        uint256 upvotes;
        uint256 downvotes;
        int256 trustScore;
        uint256 timestamp;
    }

    mapping(string => Fingerprint) private fingerprints;
    string[] private hashes;
    mapping(uint256 => Fix) private fixes;
    mapping(uint256 => mapping(address => bool)) private fixVotes;
    uint256 private nextFixId = 1;

    event FingerprintPublished(
        string indexed hashValue,
        string language,
        string framework,
        string severity,
        string errorType,
        uint256 matchCount
    );
    event FingerprintMatched(string indexed hashValue, uint256 matchCount);
    event FixSubmitted(
        uint256 indexed fixId,
        string indexed fingerprintHash,
        address indexed submitter,
        bytes32 titleHash,
        bytes32 descriptionHash
    );
    event FixVoted(uint256 indexed fixId, address indexed voter, bool successful, int256 trustScore);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function publishFingerprint(
        string calldata hashValue,
        string calldata language,
        string calldata framework,
        string calldata severity,
        string calldata errorType
    ) external onlyOwner {
        require(bytes(hashValue).length > 0, "hash required");
        require(fingerprints[hashValue].timestamp == 0, "already published");
        fingerprints[hashValue] = Fingerprint(hashValue, language, framework, severity, errorType, 1, 0, block.timestamp);
        hashes.push(hashValue);
        emit FingerprintPublished(hashValue, language, framework, severity, errorType, 1);
    }

    function reportMatch(string calldata hashValue) external onlyOwner {
        require(fingerprints[hashValue].timestamp != 0, "unknown fingerprint");
        fingerprints[hashValue].matchCount += 1;
        emit FingerprintMatched(hashValue, fingerprints[hashValue].matchCount);
    }

    function submitFix(
        string calldata fingerprintHash,
        bytes32 titleHash,
        bytes32 descriptionHash,
        address submitter
    ) external onlyOwner returns (uint256) {
        require(fingerprints[fingerprintHash].timestamp != 0, "unknown fingerprint");
        require(submitter != address(0), "submitter required");

        uint256 fixId = nextFixId;
        nextFixId += 1;
        fixes[fixId] = Fix(fixId, fingerprintHash, submitter, titleHash, descriptionHash, 0, 0, 0, block.timestamp);
        fingerprints[fingerprintHash].fixCount += 1;

        emit FixSubmitted(fixId, fingerprintHash, submitter, titleHash, descriptionHash);
        return fixId;
    }

    function vote(uint256 fixId, address voter, bool successful) external onlyOwner {
        require(fixes[fixId].timestamp != 0, "unknown fix");
        require(voter != address(0), "voter required");
        require(!fixVotes[fixId][voter], "already voted");

        fixVotes[fixId][voter] = true;
        if (successful) {
            fixes[fixId].upvotes += 1;
            fixes[fixId].trustScore += 10;
        } else {
            fixes[fixId].downvotes += 1;
            fixes[fixId].trustScore -= 4;
        }
        emit FixVoted(fixId, voter, successful, fixes[fixId].trustScore);
    }

    function getFingerprint(string calldata hashValue) external view returns (Fingerprint memory) {
        return fingerprints[hashValue];
    }

    function getFix(uint256 fixId) external view returns (Fix memory) {
        return fixes[fixId];
    }

    function getFingerprintCount() external view returns (uint256) {
        return hashes.length;
    }
}
