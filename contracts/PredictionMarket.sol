// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title VaultorVerse Prediction Market
 * @dev Advanced prediction market contract with Shield utility system
 * @author VaultorVerse Team
 */
contract PredictionMarket is ReentrancyGuard, AccessControl, Pausable {
    using Counters for Counters.Counter;
    
    // Roles
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant MARKET_CREATOR_ROLE = keccak256("MARKET_CREATOR_ROLE");
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");
    
    // Counters
    Counters.Counter private _marketIdCounter;
    
    // Market Structure
    struct Market {
        bytes32 id;
        string question;
        string description;
        uint256 endTime;
        uint8 outcomeCount;
        bool resolved;
        uint8 winningOutcome;
        uint256 totalVolume;
        mapping(uint8 => uint256) outcomeLiquidity;
        mapping(address => mapping(uint8 => Position)) positions;
        MarketCategory category;
        address creator;
        uint256 createdAt;
        bool shieldEnabled;
    }
    
    // Position Structure
    struct Position {
        uint256 amount;
        bool shieldEnabled;
        uint8 shieldPercentage;
        uint256 timestamp;
        bool claimed;
    }
    
    // Shield Configuration
    struct ShieldConfig {
        uint8 percentage;
        uint256 cost; // in basis points (1 basis point = 0.01%)
        bool available;
    }
    
    // Market Categories
    enum MarketCategory {
        CRYPTO,
        POLITICS,
        SPORTS,
        ENTERTAINMENT,
        TECHNOLOGY,
        ECONOMICS
    }
    
    // Events
    event MarketCreated(
        bytes32 indexed marketId,
        string question,
        uint256 endTime,
        uint8 outcomeCount,
        MarketCategory category,
        address indexed creator
    );
    
    event BetPlaced(
        bytes32 indexed marketId,
        address indexed user,
        uint8 outcome,
        uint256 amount,
        bool shieldEnabled,
        uint8 shieldPercentage
    );
    
    event MarketResolved(
        bytes32 indexed marketId,
        uint8 winningOutcome,
        uint256 totalVolume
    );
    
    event WinningsClaimed(
        bytes32 indexed marketId,
        address indexed user,
        uint256 amount,
        uint256 shieldCompensation
    );
    
    event ShieldActivated(
        bytes32 indexed marketId,
        address indexed user,
        uint256 compensation
    );
    
    // Storage
    mapping(bytes32 => Market) public markets;
    mapping(uint8 => ShieldConfig) public shieldConfigs;
    mapping(address => uint256) public userStats;
    
    // Shield pool for compensations
    uint256 public shieldPool;
    
    // Constants
    uint256 public constant MIN_BET_AMOUNT = 0.001 ether;
    uint256 public constant MAX_BET_AMOUNT = 100 ether;
    uint256 public constant BASIS_POINTS = 10000;
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, msg.sender);
        _grantRole(MARKET_CREATOR_ROLE, msg.sender);
        _grantRole(EMERGENCY_ROLE, msg.sender);
        
        // Initialize shield configurations
        _initializeShieldConfigs();
    }
    
    /**
     * @dev Initialize default shield configurations
     */
    function _initializeShieldConfigs() private {
        shieldConfigs[10] = ShieldConfig(10, 50, true);   // 10% protection, 0.5% cost
        shieldConfigs[20] = ShieldConfig(20, 150, true);  // 20% protection, 1.5% cost
        shieldConfigs[30] = ShieldConfig(30, 300, true);  // 30% protection, 3% cost
    }
    
    /**
     * @dev Create a new prediction market
     */
    function createMarket(
        string memory _question,
        string memory _description,
        uint256 _endTime,
        uint8 _outcomeCount,
        MarketCategory _category,
        bool _shieldEnabled
    ) external onlyRole(MARKET_CREATOR_ROLE) returns (bytes32) {
        require(_endTime > block.timestamp, "End time must be in the future");
        require(_outcomeCount >= 2 && _outcomeCount <= 10, "Invalid outcome count");
        require(bytes(_question).length > 0, "Question cannot be empty");
        
        _marketIdCounter.increment();
        bytes32 marketId = keccak256(abi.encodePacked(block.timestamp, _marketIdCounter.current(), _question));
        
        Market storage market = markets[marketId];
        market.id = marketId;
        market.question = _question;
        market.description = _description;
        market.endTime = _endTime;
        market.outcomeCount = _outcomeCount;
        market.resolved = false;
        market.totalVolume = 0;
        market.category = _category;
        market.creator = msg.sender;
        market.createdAt = block.timestamp;
        market.shieldEnabled = _shieldEnabled;
        
        emit MarketCreated(marketId, _question, _endTime, _outcomeCount, _category, msg.sender);
        
        return marketId;
    }
    
    /**
     * @dev Place a bet on a market outcome
     */
    function placeBet(
        bytes32 _marketId,
        uint8 _outcome,
        bool _enableShield,
        uint8 _shieldPercentage
    ) external payable nonReentrant whenNotPaused {
        Market storage market = markets[_marketId];
        require(market.endTime > block.timestamp, "Market has ended");
        require(!market.resolved, "Market is resolved");
        require(_outcome < market.outcomeCount, "Invalid outcome");
        require(msg.value >= MIN_BET_AMOUNT && msg.value <= MAX_BET_AMOUNT, "Invalid bet amount");
        
        uint256 betAmount = msg.value;
        uint256 shieldCost = 0;
        
        // Handle shield if enabled
        if (_enableShield && market.shieldEnabled) {
            require(shieldConfigs[_shieldPercentage].available, "Shield configuration not available");
            shieldCost = (betAmount * shieldConfigs[_shieldPercentage].cost) / BASIS_POINTS;
            betAmount -= shieldCost;
            shieldPool += shieldCost;
        }
        
        // Update position
        Position storage position = market.positions[msg.sender][_outcome];
        position.amount += betAmount;
        position.shieldEnabled = _enableShield;
        position.shieldPercentage = _shieldPercentage;
        position.timestamp = block.timestamp;
        
        // Update market liquidity
        market.outcomeLiquidity[_outcome] += betAmount;
        market.totalVolume += betAmount;
        
        emit BetPlaced(_marketId, msg.sender, _outcome, betAmount, _enableShield, _shieldPercentage);
    }
    
    /**
     * @dev Resolve a market with the winning outcome
     */
    function resolveMarket(bytes32 _marketId, uint8 _winningOutcome) external onlyRole(ORACLE_ROLE) {
        Market storage market = markets[_marketId];
        require(block.timestamp >= market.endTime, "Market has not ended yet");
        require(!market.resolved, "Market already resolved");
        require(_winningOutcome < market.outcomeCount, "Invalid winning outcome");
        
        market.resolved = true;
        market.winningOutcome = _winningOutcome;
        
        emit MarketResolved(_marketId, _winningOutcome, market.totalVolume);
    }
    
    /**
     * @dev Claim winnings from a resolved market
     */
    function claimWinnings(bytes32 _marketId, uint8 _outcome) external nonReentrant {
        Market storage market = markets[_marketId];
        require(market.resolved, "Market not resolved");
        
        Position storage position = market.positions[msg.sender][_outcome];
        require(position.amount > 0, "No position to claim");
        require(!position.claimed, "Already claimed");
        
        uint256 payout = 0;
        uint256 shieldCompensation = 0;
        
        if (_outcome == market.winningOutcome) {
            // Calculate winning payout
            uint256 totalWinningLiquidity = market.outcomeLiquidity[market.winningOutcome];
            if (totalWinningLiquidity > 0) {
                payout = (position.amount * market.totalVolume) / totalWinningLiquidity;
            }
        } else if (position.shieldEnabled) {
            // Calculate shield compensation for losing positions
            shieldCompensation = (position.amount * position.shieldPercentage) / 100;
            require(shieldPool >= shieldCompensation, "Insufficient shield pool");
            shieldPool -= shieldCompensation;
        }
        
        position.claimed = true;
        
        uint256 totalClaim = payout + shieldCompensation;
        if (totalClaim > 0) {
            (bool success, ) = payable(msg.sender).call{value: totalClaim}("");
            require(success, "Transfer failed");
        }
        
        emit WinningsClaimed(_marketId, msg.sender, payout, shieldCompensation);
        
        if (shieldCompensation > 0) {
            emit ShieldActivated(_marketId, msg.sender, shieldCompensation);
        }
    }
    
    /**
     * @dev Get market information
     */
    function getMarket(bytes32 _marketId) external view returns (
        string memory question,
        string memory description,
        uint256 endTime,
        uint8 outcomeCount,
        bool resolved,
        uint8 winningOutcome,
        uint256 totalVolume,
        MarketCategory category,
        bool shieldEnabled
    ) {
        Market storage market = markets[_marketId];
        return (
            market.question,
            market.description,
            market.endTime,
            market.outcomeCount,
            market.resolved,
            market.winningOutcome,
            market.totalVolume,
            market.category,
            market.shieldEnabled
        );
    }
    
    /**
     * @dev Get outcome liquidity for a market
     */
    function getOutcomeLiquidity(bytes32 _marketId, uint8 _outcome) external view returns (uint256) {
        return markets[_marketId].outcomeLiquidity[_outcome];
    }
    
    /**
     * @dev Get user position in a market
     */
    function getUserPosition(bytes32 _marketId, address _user, uint8 _outcome) external view returns (
        uint256 amount,
        bool shieldEnabled,
        uint8 shieldPercentage,
        uint256 timestamp,
        bool claimed
    ) {
        Position storage position = markets[_marketId].positions[_user][_outcome];
        return (
            position.amount,
            position.shieldEnabled,
            position.shieldPercentage,
            position.timestamp,
            position.claimed
        );
    }
    
    /**
     * @dev Calculate current odds for an outcome
     */
    function calculateOdds(bytes32 _marketId, uint8 _outcome) external view returns (uint256) {
        Market storage market = markets[_marketId];
        if (market.totalVolume == 0) return 0;
        return (market.outcomeLiquidity[_outcome] * BASIS_POINTS) / market.totalVolume;
    }
    
    /**
     * @dev Emergency pause function
     */
    function pause() external onlyRole(EMERGENCY_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause function
     */
    function unpause() external onlyRole(EMERGENCY_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Update shield configuration
     */
    function updateShieldConfig(
        uint8 _percentage,
        uint256 _cost,
        bool _available
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        shieldConfigs[_percentage] = ShieldConfig(_percentage, _cost, _available);
    }
    
    /**
     * @dev Withdraw excess funds (only admin)
     */
    function withdrawExcess(uint256 _amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_amount <= address(this).balance - shieldPool, "Cannot withdraw shield pool");
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "Transfer failed");
    }
    
    /**
     * @dev Fund the shield pool
     */
    function fundShieldPool() external payable {
        shieldPool += msg.value;
    }
    
    receive() external payable {
        fundShieldPool();
    }
}