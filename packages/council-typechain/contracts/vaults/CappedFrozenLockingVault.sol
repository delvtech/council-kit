// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.3;

import "./LockingVault.sol";
import "../libraries/History.sol";
import "../libraries/Storage.sol";

contract CappedFrozenLockingVault is AbstractLockingVault {
  // Bring our libraries into scope
  using History for *;
  using Storage for *;
  // the vault closes after this amount
  uint256 public immutable lockBalance;
  // total amount in the vault
  uint256 public totalDeposited;
  address public grantReciever;
  event FundsGranted(address indexed to, uint256 amount);

  /// @notice Constructs the contract by setting immutables
  /// @param _token The external erc20 token contract
  /// @param _staleBlockLag The number of blocks before the delegation history is forgotten
  constructor(
    IERC20 _token,
    uint256 _staleBlockLag,
    uint256 _lockBalance
  ) AbstractLockingVault(_token, _staleBlockLag) {
    lockBalance = _lockBalance;
  }

  function deposit(
    address fundedAccount,
    uint256 amount,
    address firstDelegation
  ) external override {
    if (totalDeposited >= lockBalance) revert("Full");
    // No delegating to zero
    require(firstDelegation != address(0), "Zero addr delegation");
    // Move the tokens into this contract
    token.transferFrom(msg.sender, address(this), amount);
    // Load our deposits storage
    Storage.AddressUint storage userData = _deposits()[fundedAccount];
    // Load who has the user's votes
    address delegate = userData.who;

    if (delegate == address(0)) {
      // If the user is un-delegated we delegate to their indicated address
      delegate = firstDelegation;
      // Set the delegation
      userData.who = delegate;
      // Now we increase the user's balance
      userData.amount += uint96(amount);
    } else {
      // In this case we make no change to the user's delegation
      // Now we increase the user's balance
      userData.amount += uint96(amount);
    }
    // Next we increase the delegation to their delegate
    // Get the storage pointer
    History.HistoricalBalances memory votingPower = _votingPower();
    // Load the most recent voter power stamp
    uint256 delegateeVotes = votingPower.loadTop(delegate);
    // Emit an event to track votes
    emit VoteChange(fundedAccount, delegate, int256(amount));
    // Add the newly deposited votes to the delegate
    votingPower.push(delegate, delegateeVotes + amount);
    totalDeposited += amount;
  }

  /// @notice Removes tokens from this contract and the voting power they represent
  /// @param amount The amount of token to withdraw
  function withdraw(uint256 amount) external virtual override {
    if (totalDeposited >= lockBalance) revert("Frozen");
    // Load our deposits storage
    Storage.AddressUint storage userData = _deposits()[msg.sender];
    // Reduce the user's stored balance
    // If properly optimized this block should result in 1 sload 1 store
    userData.amount -= uint96(amount);
    address delegate = userData.who;
    // Reduce the delegate voting power
    // Get the storage pointer
    History.HistoricalBalances memory votingPower = _votingPower();
    // Load the most recent voter power stamp
    uint256 delegateeVotes = votingPower.loadTop(delegate);
    // remove the votes from the delegate
    votingPower.push(delegate, delegateeVotes - amount);
    // Emit an event to track votes
    emit VoteChange(msg.sender, delegate, -1 * int256(amount));
    // Transfers the result to the sender
    token.transfer(msg.sender, amount);
  }

  /// @notice sends the deposits to a contract while keeping the voting power
  function sendTotal() external {
    if (totalDeposited <= lockBalance) revert("not full");
    // Emit an event to track votes
    emit FundsGranted(grantReciever, totalDeposited);
    // Transfers the result to the grantReciever
    token.transfer(grantReciever, totalDeposited);
  }
}
