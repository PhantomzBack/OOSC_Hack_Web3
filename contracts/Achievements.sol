// SPDX-License-Identifier: MIT
// pragma solidity ^0.8.19;
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;


contract AchievementManagement {
    address public owner;

    struct Achievement {
        string id;
        string title;
        string description;
        string dateAwarded;
        bool isVisible; // Visibility control by the recipient
    }

    mapping(bytes32 => Achievement) private achievements;
    mapping(bytes32 => address) private achievementOwners; // Track ownership of achievements

    event AchievementAdded(bytes32 indexed achievementId);
    event VisibilityChanged(bytes32 indexed achievementId, bool isVisible);

    constructor() public{
        owner = msg.sender;
    }

    function addAchievement(
        string memory _id,
        string memory _title,
        string memory _description,
        string memory _dateAwarded,
        address _recipient
    ) public {
        require(msg.sender == owner, "Only the contract owner can add achievements");
        bytes32 byte_id = stringToBytes32(_id);
        require(bytes(achievements[byte_id].dateAwarded).length == 0, "Achievement already exists");

        Achievement memory newAchievement = Achievement({
            id: _id,
            title: _title,
            description: _description,
            dateAwarded: _dateAwarded,
            isVisible: true // Default visibility is true
        });

        achievements[byte_id] = newAchievement;
        achievementOwners[byte_id] = _recipient; // Assign the recipient as the owner

        emit AchievementAdded(byte_id);
    }

    function setVisibility(bytes32 _id, bool _isVisible) public {
        require(msg.sender == achievementOwners[_id], "Unauthorized: Not the achievement owner");
        achievements[_id].isVisible = _isVisible;
        emit VisibilityChanged(_id, _isVisible);
    }

    function getAchievement(bytes32 _id) public view returns (Achievement memory) {
        require(achievements[_id].isVisible || msg.sender == achievementOwners[_id], "Achievement is private");
        return achievements[_id];
    }

    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
        assembly {
            result := mload(add(source, 32))
        }
    }
}