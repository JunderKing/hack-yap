// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract USDR is ERC20, ERC20Permit {
  address public ADMIN;

  constructor(address admin) ERC20("USDR", "USDR") ERC20Permit("USDR") {
    ADMIN = admin;
  }

  modifier onlyAdmin() {
    require(_msgSender() != address(0), "Only admin can call");
    _;
  }

  function mintTo(address to, uint256 amount) public onlyAdmin {
    _mint(to, amount);
  }

  function burnFrom(address from, uint256 amount) public onlyAdmin {
    _spendAllowance(from, _msgSender(), amount);
    _burn(from, amount);
  }
}
