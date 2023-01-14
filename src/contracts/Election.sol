pragma solidity ^0.8.0;

contract Election {
    struct candidate {
        string name;
        uint256 index;
        uint256 votecount;
    }

    struct voter {
        string name;
        uint256 index;
        bool voted;
    }

    mapping(uint256 => candidate) public candidates;
    mapping(address => voter) public voters;
    uint256 public candidatesCount;

    constructor() {
        addCandidate("Canndidate 1");
        addCandidate("Canndidate 2");
        addCandidate("Canndidate 3");
    }

    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates.push(
            candidate({id: candidatesCount, name: _name, voteCount: 0})
        );
    }

    function voting(address voter) public {
        require(voters[msg.sender].voted == false, "already voted");
        candidates[_index].votecount++;
        voters[msg.sender] = voter(_name, _index, true);
    }

    function result(address voter) public {
        
    }
}
