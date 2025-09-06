// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./PredictionMarket.sol";

/**
 * @title OracleIntegration
 * @dev Handles market resolution through Chainlink oracles and manual resolution
 * @author VaultorVerse Team
 */
contract OracleIntegration is AccessControl, ReentrancyGuard, Pausable {
    // Role definitions
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant RESOLVER_ROLE = keccak256("RESOLVER_ROLE");
    bytes32 public constant FEED_MANAGER_ROLE = keccak256("FEED_MANAGER_ROLE");

    // Oracle types
    enum OracleType {
        CHAINLINK_PRICE,
        CHAINLINK_CUSTOM,
        MANUAL,
        API_FEED,
        CONSENSUS
    }

    // Oracle data structure
    struct OracleConfig {
        OracleType oracleType;
        address feedAddress;        // Chainlink feed address
        string apiEndpoint;         // External API endpoint
        uint256 threshold;          // Resolution threshold value
        uint256 decimals;          // Price feed decimals
        bool isActive;             // Oracle availability
        uint256 lastUpdate;        // Last resolution timestamp
    }

    // Market resolution structure
    struct Resolution {
        bytes32 marketId;
        uint8 winningOutcome;
        uint256 resolvedValue;      // Actual resolved value
        uint256 timestamp;
        address resolver;
        bool disputed;
        uint256 disputeDeadline;
    }

    // Consensus voting structure
    struct ConsensusVote {
        address oracle;
        uint8 outcome;
        uint256 value;
        uint256 timestamp;
        bool counted;
    }

    // State variables
    PredictionMarket public immutable predictionMarket;
    
    mapping(bytes32 => OracleConfig) public oracleConfigs;
    mapping(bytes32 => Resolution) public resolutions;
    mapping(bytes32 => mapping(address => ConsensusVote)) public consensusVotes;
    mapping(bytes32 => uint256) public voteCounts;
    mapping(address => bool) public authorizedOracles;
    mapping(string => bytes32) public categoryOracles; // Category to oracle mapping
    
    uint256 public constant DISPUTE_PERIOD = 24 hours;
    uint256 public constant CONSENSUS_THRESHOLD = 3; // Minimum votes for consensus
    uint256 public oracleCount;

    // Events
    event MarketResolved(
        bytes32 indexed marketId, 
        uint8 winningOutcome, 
        uint256 value,
        OracleType oracleType
    );
    event OracleConfigured(
        bytes32 indexed oracleId, 
        OracleType oracleType, 
        address feedAddress
    );
    event ConsensusVoteSubmitted(
        bytes32 indexed marketId,
        address indexed oracle,
        uint8 outcome,
        uint256 value
    );
    event ResolutionDisputed(bytes32 indexed marketId, address indexed disputer);
    event DisputeResolved(bytes32 indexed marketId, bool upheld);

    constructor(address _predictionMarket) {
        predictionMarket = PredictionMarket(_predictionMarket);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, msg.sender);
        _grantRole(RESOLVER_ROLE, msg.sender);
        _grantRole(FEED_MANAGER_ROLE, msg.sender);
    }

    /**
     * @dev Configure oracle for market category
     * @param oracleId Unique identifier for oracle configuration
     * @param config Oracle configuration details
     * @param category Market category this oracle handles
     */
    function configureOracle(
        bytes32 oracleId,
        OracleConfig calldata config,
        string calldata category
    ) external onlyRole(FEED_MANAGER_ROLE) {
        require(config.feedAddress != address(0) || config.oracleType == OracleType.MANUAL, 
                "OracleIntegration: Invalid feed address");
        
        oracleConfigs[oracleId] = config;
        categoryOracles[category] = oracleId;
        oracleCount++;
        
        emit OracleConfigured(oracleId, config.oracleType, config.feedAddress);
    }

    /**
     * @dev Resolve market using Chainlink price feed
     * @param marketId Market to resolve
     * @param oracleId Oracle configuration to use
     */
    function resolveWithChainlinkPrice(
        bytes32 marketId, 
        bytes32 oracleId
    ) external onlyRole(RESOLVER_ROLE) nonReentrant whenNotPaused {
        OracleConfig storage config = oracleConfigs[oracleId];
        require(config.isActive, "OracleIntegration: Oracle not active");
        require(config.oracleType == OracleType.CHAINLINK_PRICE, 
                "OracleIntegration: Wrong oracle type");
        require(config.feedAddress != address(0), 
                "OracleIntegration: No feed address");

        // Get latest price from Chainlink
        AggregatorV3Interface priceFeed = AggregatorV3Interface(config.feedAddress);
        (, int256 price, , uint256 updatedAt, ) = priceFeed.latestRoundData();
        
        require(price > 0, "OracleIntegration: Invalid price data");
        require(block.timestamp - updatedAt <= 1 hours, 
                "OracleIntegration: Stale price data");

        uint256 resolvedValue = uint256(price);
        
        // Determine winning outcome based on threshold
        uint8 winningOutcome = resolvedValue >= config.threshold ? 1 : 0;
        
        _resolveMarket(marketId, winningOutcome, resolvedValue, OracleType.CHAINLINK_PRICE);
        config.lastUpdate = block.timestamp;
    }

    /**
     * @dev Resolve market manually by authorized resolver
     * @param marketId Market to resolve
     * @param winningOutcome The winning outcome
     * @param resolvedValue Actual resolved value
     */
    function resolveManually(
        bytes32 marketId,
        uint8 winningOutcome,
        uint256 resolvedValue
    ) external onlyRole(RESOLVER_ROLE) nonReentrant whenNotPaused {
        _resolveMarket(marketId, winningOutcome, resolvedValue, OracleType.MANUAL);
    }

    /**
     * @dev Submit consensus vote for market resolution
     * @param marketId Market to vote on
     * @param outcome Voted outcome
     * @param value Voted value
     */
    function submitConsensusVote(
        bytes32 marketId,
        uint8 outcome,
        uint256 value
    ) external onlyRole(ORACLE_ROLE) nonReentrant whenNotPaused {
        require(authorizedOracles[msg.sender], "OracleIntegration: Unauthorized oracle");
        require(!consensusVotes[marketId][msg.sender].counted, 
                "OracleIntegration: Already voted");

        // Record vote
        consensusVotes[marketId][msg.sender] = ConsensusVote({
            oracle: msg.sender,
            outcome: outcome,
            value: value,
            timestamp: block.timestamp,
            counted: true
        });

        voteCounts[marketId]++;

        emit ConsensusVoteSubmitted(marketId, msg.sender, outcome, value);

        // Check if consensus reached
        if (voteCounts[marketId] >= CONSENSUS_THRESHOLD) {
            _processConsensus(marketId);
        }
    }

    /**
     * @dev Process consensus votes and resolve market
     * @param marketId Market to process consensus for
     */
    function _processConsensus(bytes32 marketId) private {
        uint256 totalVotes = voteCounts[marketId];
        require(totalVotes >= CONSENSUS_THRESHOLD, "OracleIntegration: Insufficient votes");

        // Simple majority consensus (can be enhanced with weighted voting)
        mapping(uint8 => uint256) storage outcomeCounts;
        uint256 totalValue = 0;
        uint8 consensusOutcome = 0;
        uint256 maxVotes = 0;

        // Count votes for each outcome (simplified - in production use more sophisticated method)
        for (uint8 i = 0; i < 10; i++) { // Assuming max 10 outcomes
            uint256 count = 0;
            for (uint256 j = 0; j < oracleCount && count < totalVotes; j++) {
                // This is simplified - in production, iterate through actual voters
                count++;
            }
            if (count > maxVotes) {
                maxVotes = count;
                consensusOutcome = i;
            }
        }

        // Calculate average value
        uint256 avgValue = totalValue / totalVotes;

        _resolveMarket(marketId, consensusOutcome, avgValue, OracleType.CONSENSUS);
    }

    /**
     * @dev Internal function to resolve market
     * @param marketId Market to resolve
     * @param winningOutcome Winning outcome
     * @param resolvedValue Resolved value
     * @param oracleType Type of oracle used
     */
    function _resolveMarket(
        bytes32 marketId,
        uint8 winningOutcome,
        uint256 resolvedValue,
        OracleType oracleType
    ) private {
        require(resolutions[marketId].timestamp == 0, 
                "OracleIntegration: Market already resolved");

        // Record resolution
        resolutions[marketId] = Resolution({
            marketId: marketId,
            winningOutcome: winningOutcome,
            resolvedValue: resolvedValue,
            timestamp: block.timestamp,
            resolver: msg.sender,
            disputed: false,
            disputeDeadline: block.timestamp + DISPUTE_PERIOD
        });

        // Resolve market in main contract
        predictionMarket.resolveMarket(marketId, winningOutcome);

        emit MarketResolved(marketId, winningOutcome, resolvedValue, oracleType);
    }

    /**
     * @dev Dispute a market resolution
     * @param marketId Market to dispute
     * @param reason Dispute reason
     */
    function disputeResolution(
        bytes32 marketId,
        string calldata reason
    ) external nonReentrant whenNotPaused {
        Resolution storage resolution = resolutions[marketId];
        require(resolution.timestamp > 0, "OracleIntegration: Market not resolved");
        require(block.timestamp <= resolution.disputeDeadline, 
                "OracleIntegration: Dispute period expired");
        require(!resolution.disputed, "OracleIntegration: Already disputed");

        resolution.disputed = true;
        
        emit ResolutionDisputed(marketId, msg.sender);
    }

    /**
     * @dev Resolve dispute (Admin only)
     * @param marketId Market with dispute
     * @param upholdDispute Whether to uphold the dispute
     * @param newOutcome New outcome if dispute upheld
     * @param newValue New value if dispute upheld
     */
    function resolveDispute(
        bytes32 marketId,
        bool upholdDispute,
        uint8 newOutcome,
        uint256 newValue
    ) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        Resolution storage resolution = resolutions[marketId];
        require(resolution.disputed, "OracleIntegration: No active dispute");

        if (upholdDispute) {
            // Update resolution
            resolution.winningOutcome = newOutcome;
            resolution.resolvedValue = newValue;
            resolution.timestamp = block.timestamp;
            
            // Re-resolve market with new outcome
            predictionMarket.resolveMarket(marketId, newOutcome);
        }

        resolution.disputed = false;
        emit DisputeResolved(marketId, upholdDispute);
    }

    /**
     * @dev Add authorized oracle for consensus voting
     * @param oracle Oracle address to authorize
     */
    function addAuthorizedOracle(address oracle) 
        external 
        onlyRole(ORACLE_ROLE) 
    {
        require(oracle != address(0), "OracleIntegration: Invalid oracle address");
        authorizedOracles[oracle] = true;
        _grantRole(ORACLE_ROLE, oracle);
    }

    /**
     * @dev Remove authorized oracle
     * @param oracle Oracle address to remove
     */
    function removeAuthorizedOracle(address oracle) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        authorizedOracles[oracle] = false;
        _revokeRole(ORACLE_ROLE, oracle);
    }

    /**
     * @dev Get oracle configuration for category
     * @param category Market category
     * @return config Oracle configuration
     */
    function getOracleForCategory(string calldata category) 
        external 
        view 
        returns (OracleConfig memory config) 
    {
        bytes32 oracleId = categoryOracles[category];
        config = oracleConfigs[oracleId];
    }

    /**
     * @dev Get market resolution details
     * @param marketId Market ID
     * @return resolution Resolution details
     */
    function getResolution(bytes32 marketId) 
        external 
        view 
        returns (Resolution memory resolution) 
    {
        resolution = resolutions[marketId];
    }

    /**
     * @dev Check if oracle is active
     * @param oracleId Oracle ID
     * @return isActive Oracle status
     */
    function isOracleActive(bytes32 oracleId) external view returns (bool) {
        return oracleConfigs[oracleId].isActive;
    }

    /**
     * @dev Toggle oracle active status
     * @param oracleId Oracle to toggle
     * @param active New active status
     */
    function toggleOracle(
        bytes32 oracleId, 
        bool active
    ) external onlyRole(FEED_MANAGER_ROLE) {
        oracleConfigs[oracleId].isActive = active;
    }

    /**
     * @dev Pause oracle operations
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause oracle operations
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @dev Emergency function to force resolve market
     * @param marketId Market to force resolve
     * @param outcome Emergency outcome
     */
    function emergencyResolve(
        bytes32 marketId,
        uint8 outcome
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _resolveMarket(marketId, outcome, 0, OracleType.MANUAL);
    }
}