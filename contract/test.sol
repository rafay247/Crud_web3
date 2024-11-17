// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;


contract Ownable {
    address public owner;
    
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Action can only be performed by owner");
        _;
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0));
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}


contract Contract is Ownable {
    
    /* STRUCTS */
    struct User {
        string name;
        string country;
        string email;
        string gender;
        bool isActive;
    }
    
    
    /* COLLECTIONS */
    mapping( address => User ) public mapUsers;
    
    
    /* EVENTS */
    event UserRegistered (address user, string name, string country, string email, string gender);
    event UserUpdated (address user, string name, string country, string email, string gender);
    event UserDeleted (address user);
    
    /* FUNCTIONS */
    
    function registerUser (string memory name, string memory country, string memory email, string memory gender)
    public {
        require(!mapUsers[msg.sender].isActive, "User exist");
        
        User memory _user = User(name, country, email, gender, true);
        
        mapUsers[msg.sender] = _user;
        
        emit UserRegistered(msg.sender, name, country, email, gender);
    }
    
    
    function updateUser (string memory name, string memory country, string memory email, string memory gender)
    public {
        require(mapUsers[msg.sender].isActive, "User doesn't exist");
        
        User memory _user = User(name, country, email, gender, true);
        
        mapUsers[msg.sender] = _user;
        
        emit UserUpdated(msg.sender, name, country, email, gender);
    }
    
    
    function deleteUser (address userAddr)
    onlyOwner
    public {
        require(mapUsers[userAddr].isActive, "User doesn't exist");
        
        mapUsers[userAddr].isActive = false;
        
        emit UserDeleted(userAddr);
    }
    
    
}