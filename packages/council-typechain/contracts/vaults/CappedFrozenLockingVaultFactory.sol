// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.3;

import "./CappedFrozenLockingVault.sol";

contract CappedFrozenLockingVaultFactory {
  event CappedFrozenLockingVaultCreated(
    address vaultAddress,
    address token,
    uint256 staleBlockLag,
    uint256 lockBalance
  );

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
