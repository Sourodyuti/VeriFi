// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

     contract Attendance {
         struct Record {
             uint256 timestamp;
             bool present;
         }
         mapping(address => Record[]) public records;

         function markAttendance(bool present) public {
             records[msg.sender].push(Record(block.timestamp, present));
         }
     }