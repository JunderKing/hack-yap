// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IERC20Token is IERC20 {
    function mintTo(address to, uint256 amount) external;
    function burnFrom(address from, uint256 amount) external;
}

interface IERC20Decimal is IERC20 {
    function decimals() external view returns (uint8);
}

contract HackYap is Ownable {
    using SafeERC20 for IERC20;

    uint256 public constant LOCK_RATE_VALUE = 90;
    uint256 public constant LOCK_RATE_BASE = 100;
    uint256 public constant LOCK_TIME = 86400 * 30;
    
    uint256 public constant DAO_RATE_VALUE = 100;
    uint256 public constant DAO_RATE_BASE = 1;

    address public USDR = address(0);
    address public DAO = address(0);

    // USD Token => status
    mapping(address => bool) public USDMap;
    // Lp Token => status
    mapping(address => bool) public lpMap;

    // user => USD Token => amount
    mapping(address => mapping(address => uint256)) public userDepositMap;

    struct LockInfo {
        uint256 freeLpAmount;
        uint256 freeUsdrAmount;
    }
    // user => lp Token => LockInfo
    mapping(address => mapping(address => LockInfo)) public userLockMap;

    struct LockRecord {
        uint256 lpAmount;
        uint256 usdrAmount;
        uint256 timestamp;
    }
    // user => lp Token => LockRecords
    mapping(address => mapping(address => LockRecord[])) public userLockRecords;

    event Deposit(address indexed account, address indexed USD, uint256 amount);
    event Withdraw(address indexed account, address indexed USD, uint256 amount);
    event Lock(address indexed account, address indexed lpToken, uint256 lpAmount);
    event Unlock(address indexed account, address indexed lpToken, uint256 lpAmount);

    constructor() Ownable(_msgSender()) {}

    function setUsdr(address usdrAddr) public onlyOwner {
        USDR = usdrAddr;
    }

    function setDao(address daoAddr) public onlyOwner {
        DAO = daoAddr;
    }
    
    function configUsd(address usdAddr, bool status) public onlyOwner {
        USDMap[usdAddr] = status;
    }

    function configLp(address lpAddr, bool status) public onlyOwner {
        lpMap[lpAddr] = status;
    }

    function deposit(address usdAddr_, uint256 usdAmount_) public {
        require(USDMap[usdAddr_], "Unsupported USD token");

        IERC20(usdAddr_).safeTransferFrom(_msgSender(), address(this), usdAmount_);

        uint256 usdrAmount_ = _decimalSwitch(usdAddr_, USDR, usdAmount_);
        IERC20Token(USDR).mintTo(_msgSender(), usdrAmount_);

        userDepositMap[_msgSender()][usdAddr_] += usdAmount_;

        emit Deposit(_msgSender(), usdAddr_, usdAmount_);
    }

    function withdraw(address usdAddr_, uint256 usdAmount_) public {
        require(userDepositMap[_msgSender()][usdAddr_] >= usdAmount_, "Not enough token to withdraw");

        userDepositMap[_msgSender()][usdAddr_] -= usdAmount_;

        uint256 usdrAmount_ = _decimalSwitch(usdAddr_, USDR, usdAmount_);
        IERC20Token(USDR).burnFrom(_msgSender(), usdrAmount_);
        IERC20(usdAddr_).safeTransfer(_msgSender(), usdAmount_);

        emit Withdraw(_msgSender(), usdAddr_, usdAmount_);
    }

    function lock(address lpAddr_, uint256 lpAmount_) public {
        require(lpMap[lpAddr_], "Unsupported Lp token");

        IUniswapV2Pair pair = IUniswapV2Pair(lpAddr_);
        (uint256 reserveA, uint256 reserveB, ) = pair.getReserves();
        uint256 lpSupply = pair.totalSupply();
        uint256 amountA = reserveA * lpAmount_ / lpSupply;
        uint256 amountB = reserveB * lpAmount_ / lpSupply;
        uint256 usdrAmountA = _decimalSwitch(pair.token0(), USDR, amountA);
        uint256 usdrAmountB = _decimalSwitch(pair.token1(), USDR, amountB);
        uint256 usdrAmount = (usdrAmountA + usdrAmountB) * LOCK_RATE_VALUE / LOCK_RATE_BASE;
        uint256 daoAmount = usdrAmount * DAO_RATE_VALUE / DAO_RATE_BASE;

        IERC20(lpAddr_).safeTransferFrom(_msgSender(), address(this), lpAmount_);
        IERC20Token(USDR).mintTo(_msgSender(), usdrAmount);
        IERC20Token(DAO).mintTo(_msgSender(), daoAmount);

        LockRecord[] storage records_ = userLockRecords[_msgSender()][lpAddr_];
        records_.push(LockRecord({
            lpAmount: lpAmount_,
            usdrAmount: usdrAmount,
            timestamp: block.timestamp
        }));
    }

    function unlock(address lpAddr_, uint256 usdrAmount_) public {
        _updateRecords(_msgSender(), lpAddr_);
        LockInfo storage lockInfo = userLockMap[_msgSender()][lpAddr_];
        require(lockInfo.freeUsdrAmount >= usdrAmount_, "Not enough free lp");
        uint256 lpAmount = usdrAmount_ * lockInfo.freeLpAmount / lockInfo.freeUsdrAmount;

        lockInfo.freeLpAmount -= lpAmount;
        lockInfo.freeUsdrAmount -= usdrAmount_;

        IERC20Token(USDR).burnFrom(_msgSender(), usdrAmount_);
        IERC20(lpAddr_).safeTransfer(_msgSender(), lpAmount);
    }

    function unlockAmount(address account_, address lpAddr_) public view returns (uint256, uint256) {
        LockRecord[] memory records_ = userLockRecords[account_][lpAddr_];
        uint256 expireLpAmount = 0;
        uint256 expireUsdrAmount = 0;
        for (uint256 i; i < records_.length; i++) {
            if (records_[i].timestamp <= block.timestamp - LOCK_TIME) {
                expireLpAmount += records_[i].lpAmount;
                expireUsdrAmount += records_[i].usdrAmount;
            }
        }
        uint256 freeLpAmount = expireLpAmount + userLockMap[account_][lpAddr_].freeLpAmount;
        uint256 freeUsdrAmount = expireUsdrAmount + userLockMap[account_][lpAddr_].freeUsdrAmount;

        return (freeLpAmount, freeUsdrAmount);
    }

    function _updateRecords(address account_, address lpAddr_) internal {
        LockRecord[] storage records_ = userLockRecords[account_][lpAddr_];
        uint256 _curIndex = 0;
        uint256 _popCount = 0;
        for (uint256 i; i < records_.length; i++) {
            if (records_[i].timestamp > block.timestamp - LOCK_TIME) {
                if (_curIndex != i) {
                    records_[_curIndex] = records_[i];
                }
            } else {
                userLockMap[account_][lpAddr_].freeLpAmount += records_[i].lpAmount;
                userLockMap[account_][lpAddr_].freeUsdrAmount += records_[i].usdrAmount;
                _popCount++;
            }
        }
        for (uint256 i; i<_popCount; i++) {
            records_.pop();
        }
    }

    function _decimalSwitch(address srcAddr, address dstAddr, uint256 amount) internal view returns(uint256) {
        uint8 decimalSrc = IERC20Decimal(srcAddr).decimals();
        uint8 decimalDst = IERC20Decimal(dstAddr).decimals();
        uint256 amountDst = 0;
        if (decimalSrc > decimalDst) {
            amountDst = amount / 10 ** (decimalSrc - decimalDst);
        }
        if (decimalSrc == decimalDst) {
            amountDst = amount;
        }
        if (decimalSrc < decimalDst) {
            amountDst = amount * 10 ** (decimalDst - decimalSrc);
        }
        return amountDst;
    }
}

interface IUniswapV2Pair is IERC20 {
    function token0() external view returns (address);
    function token1() external view returns (address);
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
}