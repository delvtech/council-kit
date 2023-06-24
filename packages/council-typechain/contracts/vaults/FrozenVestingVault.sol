// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.3;

import "./VestingVault.sol";


// You can come in but you can never leave
contract FrozenVestingVault is AbstractVestingVault {
    uint256 public immutable lockBalance
    /// @notice Constructs the contract by passing through the the super
    /// @param _token The erc20 token to grant.
    /// @param _stale Stale block used for voting power calculations.
    // constructor(IERC20 _token, uint256 _stale)
    constructor(IERC20 _token, uint256 _stale, uint256 _lockBalance) // add an argument to set the time to turn oon the locking
        AbstractVestingVault(_token, _stale)
    {
        lockBalance=_lockBalance;
    }

    // These functions are the only way for tokens to leave the contract
    // Therefore they now revert

    /// @notice Does nothing, always reverts
    function removeGrant(address) public pure override {
        revert("Frozen");
    }

    /// @notice Does nothing, always reverts
    function claim() public pure override {
        revert("Frozen");
    }

    /// @notice Does nothing, always reverts
    function withdraw(uint256, address) public pure override {
        if (currentBalance<lockBalance)
        revert("Frozen");
    }
}
