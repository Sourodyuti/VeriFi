// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract Payment {
         mapping(address => uint256) public balances;

         function paySalary(address employee, uint256 amount) public {
             balances[employee] += amount;
         }

         function withdraw() public {
             uint256 amount = balances[msg.sender];
             require(amount > 0, "No balance to withdraw");
             payable(msg.sender).transfer(amount);
             balances[msg.sender] = 0;
         }
     }