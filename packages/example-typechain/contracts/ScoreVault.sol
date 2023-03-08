// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.3;

import "./interfaces/IVotingVault.sol";
import "./libraries/Authorizable.sol";

abstract contract AbstractScoreVault is Authorizable, IVotingVault {
    mapping(address => uint256) public scores;

    enum Result {
        WIN,
        LOSS
    }

    event ScoreChange(
        address indexed user,
        Result indexed result,
        int256 newScore
    );

    function addResult(address user, Result result, uint256 points) external {
        if (result == Result.WIN) {
            scores[user] += points;
        } else {
            scores[user] -= points;
        }
        emit ScoreChange(user, result, int256(scores[user]));
    }

    function queryVotePower(
        address user,
        uint256 blockNumber,
        bytes calldata extraData
    ) external override returns (uint256) {
        return scores[user];
    }
}

contract ScoreVault is AbstractScoreVault {
    constructor() AbstractScoreVault() {}
}
