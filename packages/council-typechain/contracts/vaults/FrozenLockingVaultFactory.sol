// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.3;

import "./CappedFrozenLockingVault.sol";
import "./LockingVault.sol";

contract FrozenLockingVaultFactory is AbstractLockingVault {
  event CappedFrozenLockingVaultCreated(
    address vaultAddress,
    address token,
    uint256 staleBlockLag,
    uint256 lockBalance
  );

  /// @notice Constructs the contract by setting immutables
  /// @param _token The external erc20 token contract
  /// @param _staleBlockLag The number of blocks before the delegation history is forgotten
  constructor(IERC20 _token, uint256 _staleBlockLag)
    AbstractLockingVault(_token, _staleBlockLag)
  {}

  function createCappedFrozenLockingVault(
    IERC20 _token,
    uint256 _staleBlockLag,
    uint256 _lockBalance
  ) public returns (address) {
    CappedFrozenLockingVault vault = new CappedFrozenLockingVault(
      _token,
      _staleBlockLag,
      _lockBalance
    );
    emit CappedFrozenLockingVaultCreated(
      address(vault),
      address(_token),
      _staleBlockLag,
      _lockBalance
    );
    return address(vault);
  }
}
