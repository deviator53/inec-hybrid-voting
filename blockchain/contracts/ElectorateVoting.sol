// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ElectorateVoting
 * @notice Immutable blockchain voting contract for INEC electoral system
 * @dev Academic thesis implementation - NOT FOR PRODUCTION USE
 */
contract ElectorateVoting {
    // Candidate structure
    struct Candidate {
        uint256 id;
        string name;
        string party;
        uint256 voteCount;
    }

    // Election metadata
    string public electionName;
    string public electionDate;
    address public electionCommission;
    bool public electionActive;
    
    // Voting state
    mapping(uint256 => Candidate) public candidates;
    mapping(bytes32 => bool) private hasVoted; // Anonymized voter hash
    uint256 public candidateCount;
    uint256 public totalVotes;
    
    // Events
    event VoteCast(
        uint256 indexed candidateId,
        string party,
        bytes32 voterHash,
        uint256 timestamp,
        uint256 blockNumber
    );
    
    event ElectionInitialized(
        string electionName,
        uint256 candidateCount,
        uint256 timestamp
    );
    
    modifier onlyCommission() {
        require(msg.sender == electionCommission, "Only commission can execute");
        _;
    }
    
    modifier electionIsActive() {
        require(electionActive, "Election is not active");
        _;
    }
    
    constructor(string memory _electionName, string memory _electionDate) {
        electionCommission = msg.sender;
        electionName = _electionName;
        electionDate = _electionDate;
        electionActive = false;
        
        emit ElectionInitialized(_electionName, candidateCount, block.timestamp);
    }
    
    /**
     * @notice Add a new candidate (only before election starts)
     * @param _name Candidate's full name
     * @param _party Political party abbreviation
     */
    function addCandidate(string memory _name, string memory _party) external onlyCommission {
        require(!electionActive, "Cannot add candidates after election starts");
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, _name, _party, 0);
    }
    
    function activateElection() external onlyCommission {
        electionActive = true;
    }
    
    function deactivateElection() external onlyCommission {
        electionActive = false;
    }
    
    /**
     * @notice Cast a vote with anonymized voter identity
     * @param _candidateId The candidate receiving the vote
     * @param _voterHash HMAC-SHA256 hash of voter identity
     */
    function castVote(uint256 _candidateId, bytes32 _voterHash) 
        external 
        electionIsActive 
    {
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate");
        require(!hasVoted[_voterHash], "Duplicate vote detected");
        
        // Mark as voted
        hasVoted[_voterHash] = true;
        
        // Increment vote count
        candidates[_candidateId].voteCount++;
        totalVotes++;
        
        // Emit event for real-time tracking
        emit VoteCast(
            _candidateId,
            candidates[_candidateId].party,
            _voterHash,
            block.timestamp,
            block.number
        );
    }
    
    /**
     * @notice Check if voter hash has already voted
     * @param _voterHash Anonymized voter identifier
     */
    function hasAlreadyVoted(bytes32 _voterHash) external view returns (bool) {
        return hasVoted[_voterHash];
    }
    
    /**
     * @notice Get candidate details
     */
    function getCandidate(uint256 _candidateId) 
        external 
        view 
        returns (
            uint256 id,
            string memory name,
            string memory party,
            uint256 voteCount
        ) 
    {
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate");
        Candidate memory c = candidates[_candidateId];
        return (c.id, c.name, c.party, c.voteCount);
    }
    
    /**
     * @notice Get all results
     */
    function getResults() 
        external 
        view 
        returns (
            string[] memory names,
            string[] memory parties,
            uint256[] memory votes
        ) 
    {
        names = new string[](candidateCount);
        parties = new string[](candidateCount);
        votes = new uint256[](candidateCount);
        
        for (uint256 i = 1; i <= candidateCount; i++) {
            names[i-1] = candidates[i].name;
            parties[i-1] = candidates[i].party;
            votes[i-1] = candidates[i].voteCount;
        }
        
        return (names, parties, votes);
    }
}
