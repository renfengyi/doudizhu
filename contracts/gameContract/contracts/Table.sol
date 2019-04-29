pragma solidity ^0.4.11;

import './ERC20Abi.sol';
import './SafeMath.sol';

contract Table {
  using SafeMath for uint;

  event Join(address indexed addr, uint256 amount);
  event NettingRequest(uint256 hand);
  event Netted(uint256 hand);
  event Leave(address addr);

  uint16[] public blindStructure;
  uint256 public blindLevelDuration;

  address public oracle;
  address public tokenAddr;
  uint256 jozDecimals = 1000000000;

  bool public active = true;

  struct Hand {
    //in
    mapping (address => uint256) ins;
    //out
    uint256 claimCount;
    mapping (address => uint256) outs;
  }

  struct Seat {
    address senderAddr;
    uint256 amount;
    address signerAddr;
    uint256 exitHand;
  }

  uint8 lastPos = 20;
  address lastSignerAddr;
  address lastFrom;
  uint256 lasti = 20;
  //uint8 handsNetted = 0;
  uint8 hsNetted = 0;

  Hand[] public hands;
  Seat[] public seats;

  uint32 public lastHandNetted;

  uint32 public lastNettingRequestHandId;
  uint256 public lastNettingRequestTime;
  uint256 disputeTime;

  function Table(address _token, address _oracle, uint256 _seats, uint256 _disputeTime, uint16[] _blindStructure, uint256 _blindLevelDuration) {
    tokenAddr = _token;
    oracle = _oracle;
    blindLevelDuration = _blindLevelDuration;
    blindStructure = _blindStructure; // blinds in ntz
    seats.length = _seats;
    lastHandNetted = 1;
    lastNettingRequestHandId = 1;
    lastNettingRequestTime = now;
    disputeTime = _disputeTime;
  }

  function blindLevel(uint256 secsFromStart) constant returns (uint) {
    if (blindStructure.length == 1 || blindLevelDuration == 0) {
      return 0;
    }

    uint level = secsFromStart / blindLevelDuration;
    if (level > blindStructure.length - 1) {
      return blindStructure.length - 1;
    }

    return level;
  }

  function smallBlind(uint256 secsFromStart) constant returns (uint256) {
    return uint256(blindStructure[blindLevel(secsFromStart)]) * 1000000000000; // get current blind and convert it to babz
  }

  function getLineup() constant returns (uint256, address[] addresses, uint256[] amounts, uint256[] exitHands) {
    addresses = new address[](seats.length);
    amounts = new uint256[](seats.length);
    exitHands = new uint256[](seats.length);
    for (uint256 i = 0; i < seats.length; i++) {
        addresses[i] = seats[i].signerAddr;
        amounts[i] = seats[i].amount;
        exitHands[i] = seats[i].exitHand;
    }
    return (lastHandNetted, addresses, amounts, exitHands);
  }

  function getOracleAddress() constant returns(address) {
    return oracle;
  }

  function getTokenAddress() constant returns(address) {
    return tokenAddr;
  }
  
  function getLastPos() constant returns(uint) {
    return lastPos;
  }
  function getlastSignerAddr() constant returns(address) {
    return lastSignerAddr;
  }
  function getLastFrom () constant returns(address) {
    return lastFrom;
  }
  function getLastI () constant returns(uint256) {
    return lasti;
  }
  
  function getSeatlength () constant returns(uint256)  {
    return seats.length;
  }
  function getSeatSenderAddr(uint256 pos) constant returns(address) {
    return seats[pos].senderAddr;
  }
  function getSeatAccount(uint256 pos) constant returns(uint256) {
    return seats[pos].amount;
  }
  function getSeatSignerAddr(uint256 pos) constant returns(address) {
    return seats[pos].signerAddr;
  }
  function getSeatExitHand(uint256 pos) constant returns(uint256) {
    return seats[pos].exitHand;
  }

  function getHandsNetted() constant returns(uint8) {
    return hsNetted;
  }
  function getLastHandNetted() constant returns(uint32) {
    return lastHandNetted;
  }

  function getNowTime() constant returns(uint256) {
    return now;
  }
  function getLastNettingRequestTime() constant returns(uint256) {
    return lastNettingRequestTime;
  }
  function getDisputeTime() constant returns(uint256) {
    return disputeTime;
  }
  function getLNPTDT() constant returns(uint256) {
    return lastNettingRequestTime + disputeTime;
  }
  function getNetStauts() constant returns(uint256) {
    if(now >= lastNettingRequestTime + disputeTime) 
    {
      return 1;
    }
    else
    {
      return 0;
    }
  }
  


  function getIn(uint256 _handId, address _addr) constant returns (uint256) {
    return hands[_handId].ins[_addr];
  }

  function getOut(uint256 _handId, address _addr) constant returns (uint256, uint) {
    return (hands[_handId].outs[_addr], hands[_handId].claimCount);
  }

  function inLineup(address _addr) constant returns (bool) {
    for (uint256 i = 0; i < seats.length; i++) {
      if (seats[i].signerAddr == _addr || seats[i].senderAddr == _addr) {
        return true;
      }
    }
    if (_addr == oracle) {
      return true;
    }
    return false;
  }

  function toggleActive(bytes _toggleReceipt) {
    uint32 handId;
    address dest;
    bytes32 r;
    bytes32 s;
    uint8 v;

    assembly {
      handId := mload(add(_toggleReceipt, 4))
      dest := mload(add(_toggleReceipt, 24))
      r := mload(add(_toggleReceipt, 56))
      s := mload(add(_toggleReceipt, 88))
      v := mload(add(_toggleReceipt, 89))
    }
    assert(dest == address(this));
    assert(lastHandNetted == handId);
    assert(ecrecover(sha3(handId, dest), v, r, s) == oracle);

    active = !active;
  }

  // Join
  function tokenFallback(address _from, uint256 _value, bytes _data) {
    assert(msg.sender == tokenAddr);
    // check the dough
    uint256 sb = smallBlind(0);
    assert(40 * sb <= _value && _value <= 400 * sb);

    uint8 pos;
    address signerAddr;
    assembly {
      pos := mload(add(_data, 1))
      signerAddr := mload(add(_data, 21))
    }

    lastPos = pos;
    lastSignerAddr = signerAddr;
    lastFrom = _from;

    assert(signerAddr != 0x0);

    bool rebuy = false;
    // avoid player joining multiple times
    for (uint256 i = 0; i < seats.length; i++ ) {
      if (seats[i].senderAddr == _from) {
         lasti = i;
        assert(pos == i);
        rebuy = true;
      }
    }

    if (rebuy) {
      // check the dough
      assert(_value + seats[pos].amount <= sb.mul(400));
      // check exit hand
      assert(seats[pos].exitHand == 0);
      seats[pos].amount += _value;
    } else {
      if (pos >= seats.length || seats[pos].amount > 0 || seats[pos].senderAddr != 0) {
        throw;
      }
      //seat player
      seats[pos].senderAddr = _from;
      seats[pos].amount = _value;
      seats[pos].signerAddr = signerAddr;
    }
    Join(_from, _value);
  }

  function leave(bytes32 _r, bytes32 _s, bytes32 _pl) {
    uint8 v;
    uint56 dest;
    uint32 handId;
    address signer;

    assembly {
      v := calldataload(37)
      dest := calldataload(44)
      handId := calldataload(48)
      signer := calldataload(68)
    }
    assert(dest == uint56(address(this)));

    assert(ecrecover(sha3(uint8(0), dest, handId, signer), v, _r, _s) == oracle);

    uint256 pos = seats.length;
    for (uint256 i = 0; i < seats.length; i++) {
      if (seats[i].signerAddr == signer || seats[i].senderAddr == signer) {
        pos = i;
      }
    }
    assert(pos < seats.length);
    assert(seats[pos].exitHand == 0);
    seats[pos].exitHand = handId;
    // create new netting request
    if (lastHandNetted < handId) {
      if (lastNettingRequestHandId < handId) {
        NettingRequest(handId);
        lastNettingRequestHandId = handId;
        lastNettingRequestTime = now;
      }
    } else {
      _payout(0);
    }
  }

  // This function is called if all players agree to settle without dispute.
  // A list of changes to all balances is signed by all active players and submited.
  function settle(bytes _sigs, bytes32 _newBal1, bytes32 _newBal2) {
    // TODO: keeping track of who has signed,
    uint8 handsNetted = uint8(_newBal1 >> 232);
    hsNetted = handsNetted;
    assert(handsNetted > 0);

    // handId byte
    assert(uint8(_newBal1 >> 224) == uint8(lastHandNetted));
    assert(uint8(_newBal1 >> 240) == uint8(address(this)));

    for (uint256 i = 0; i < _sigs.length / 65; i++) {
      uint8 v;
      bytes32 r;
      bytes32 s;
      assembly {
        v := mload(add(_sigs, add(1, mul(i, 65))))
        r := mload(add(_sigs, add(33, mul(i, 65))))
        s := mload(add(_sigs, add(65, mul(i, 65))))
      }
      assert(inLineup(ecrecover(sha3(_newBal1, _newBal2), v, r, s)));
    }

    uint256 sumOfSeatBalances = 0;
    for (i = 0; i < seats.length; i++) {
      int48 diff;
      assembly {
        diff := calldataload(add(14, mul(i, 6)))
      }
      assert(diff == 0 || seats[i].signerAddr != 0x0);
      seats[i].amount = uint256(int256(seats[i].amount) + (int256(jozDecimals) * diff));
      sumOfSeatBalances += seats[i].amount;
    }

    lastHandNetted += handsNetted;
    Netted(lastHandNetted);
    _payout(sumOfSeatBalances);
  }

  function submit(bytes32[] _data) returns (uint writeCount) {
    uint256 next = 0;
    writeCount = 0;

    while (next + 3 <= _data.length) {
      uint8 v;
      uint24 dest;
      uint32 handId;
      uint8 t;        // type of receipt
      bytes31 rest;
      uint48 amount;
      address signer;
      assembly {
        let f := mul(add(next, 3), 32)
        v := calldataload(add(f, 5))
        dest := calldataload(add(f, 8))
        handId := calldataload(add(f, 12))
        t := calldataload(add(f, 13))
        rest := calldataload(add(f, 37))
      }
      assert(dest == uint24(address(this)));
      if (hands.length <= lastNettingRequestHandId) {
        hands.length = lastNettingRequestHandId + 1;
      }
      // the receipt is a distribution
      if (t == 21) {
        signer = ecrecover(sha3(uint8(0), rest, _data[next+3]), v, _data[next], _data[next+1]);
        assert(signer == oracle && handId < hands.length);
        assembly {
          v := mul(add(next, 3), 32)
          t := calldataload(add(v, 14))
        }
        if (t > hands[handId].claimCount || hands[handId].claimCount == 0) {
          hands[handId].claimCount = t;
          for (dest = 0; dest < 7; dest++) {
            assembly {
              t := calldataload(add(v, add(mul(dest, 7), 16)))
              amount := calldataload(add(v, add(mul(dest, 7), 22)))
            }
            if (amount == 0) {
                break;
            }
            hands[handId].outs[seats[t].signerAddr] = jozDecimals.mul(amount);
            writeCount++;
          }
        }
        next = next + 4;
      // the receipt is a bet/check/fold
      } else {
        signer = ecrecover(sha3(uint8(0), rest), v, _data[next], _data[next+1]);
        assert(inLineup(signer));
        assert(lastHandNetted < handId && handId < hands.length);
        assembly {
          amount := calldataload(add(mul(add(next, 3), 32), 19))
        }
        uint256 value = jozDecimals.mul(amount);
        if (value > hands[handId].ins[signer]) {
          hands[handId].ins[signer] = value;
          writeCount++;
        }
        next = next + 3;
      }
    }
  }


  function net() {
    assert(now >= lastNettingRequestTime + disputeTime);
    uint256 sumOfSeatBalances = 0;
    for (uint256 j = 0; j < seats.length; j++) {
      Seat storage seat = seats[j];
      for (uint256 i = lastHandNetted + 1; i <= lastNettingRequestHandId; i++ ) {
        seat.amount = seat.amount.add(hands[i].outs[seat.signerAddr]).sub(hands[i].ins[seat.signerAddr]);

      }
      sumOfSeatBalances = sumOfSeatBalances.add(seat.amount);
    }
    lastHandNetted = lastNettingRequestHandId;
    Netted(lastHandNetted);
    _payout(sumOfSeatBalances);
  }

  function _payout(uint256 _sumOfSeatBalances) internal {
    var token = ERC20Abi(tokenAddr);
    if (_sumOfSeatBalances > 0) {
      uint256 totalBal = token.balanceOf(address(this));
      token.transfer(oracle, totalBal.sub(_sumOfSeatBalances));
    }

    for (uint256 i = 0; i < seats.length; i++) {
      Seat storage seat = seats[i];
      if (seat.exitHand > 0 && lastHandNetted >= seat.exitHand) {
        if (seat.amount > 0) {
          token.transfer(seat.senderAddr, seat.amount);
        }
        Leave(seat.senderAddr);
        delete seats[i];
      }
    }
  }

}
