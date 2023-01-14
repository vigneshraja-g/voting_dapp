pragma solidity ^0.8.0;

contract Election {
    struct candidate {
        uint256 index;
        string name;
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
    }

    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = candidate({index:candidatesCount, name:_name, votecount:0});
    }

    function voting(string memory _name, uint256 _index) public returns(bool) {
        require(voters[msg.sender].voted == false, "Already voted");
        candidates[_index].votecount++;
        voters[msg.sender] = voter(_name, _index, true);
        return true;
    }

    function getwinner() public view returns (uint256) {
        uint256 x = candidates[1].votecount;
        uint256 y = candidates[2].votecount;

        if (x > y) {
            return candidates[1].index;
        } else if (y > x) {
            return candidates[2].index;
        } else {
            return 0;
        }
    }
}
