// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.3;

import "./libraries/History.sol";
import "./libraries/Storage.sol";
import "./interfaces/IVotingVault.sol";
import "./libraries/Authorizable.sol";

abstract contract AbstractScoreVault is Authorizable, IVotingVault {
    using History for *;
    using Storage for *;

    enum Result {
        WIN,
        LOSS
    }

    event NewResult(address indexed user, Result indexed result, int256 points);

    function _votingPower()
        internal
        pure
        returns (History.HistoricalBalances memory)
    {
        return (History.load("votingPower"));
    }

    function addResult(
        address user,
        Result result,
        uint256 points
    ) external onlyAuthorized {
        History.HistoricalBalances memory votingPower = _votingPower();
        uint256 currentVotes = votingPower.loadTop(msg.sender);
        if (result == Result.WIN) {
            votingPower.push(msg.sender, currentVotes + points);
        } else {
            votingPower.push(msg.sender, currentVotes - points);
        }
        emit NewResult(user, result, int256(points));
    }

    function queryVotePower(
        address user,
        uint256 blockNumber,
        bytes calldata
    ) external override returns (uint256) {
        History.HistoricalBalances memory votingPower = _votingPower();
        return votingPower.find(user, blockNumber);
    }
}

contract ScoreVault is AbstractScoreVault {
    constructor() AbstractScoreVault() {}
}
