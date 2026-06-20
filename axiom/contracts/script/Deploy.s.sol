// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/FingerprintRegistry.sol";
import "../src/ReputationRegistry.sol";

contract Deploy is Script {
    FingerprintRegistry public fingerprintRegistry;
    ReputationRegistry public reputationRegistry;

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        fingerprintRegistry = new FingerprintRegistry(deployer);
        reputationRegistry = new ReputationRegistry(deployer);

        vm.stopBroadcast();
    }
}
