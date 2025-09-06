// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title TokenManager
 * @dev Multi-version token system (V1-V5) with staking and utility features
 * @author VaultorVerse Team
 */
contract TokenManager is ERC20, ERC20Burnable, ERC20Pausable, AccessControl, ReentrancyGuard {
    using SafeMath for uint256;

    // Token Version Levels
    enum TokenVersion { V1, V2, V3, V4, V5 }
    
    // Role definitions
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant STAKING_MANAGER_ROLE = keccak256("STAKING_MANAGER_ROLE");
    bytes32 public constant VERSION_MANAGER_ROLE = keccak256("VERSION_MANAGER_ROLE");

    // Token version configuration
    struct TokenConfig {
        uint256 requiredBalance;      // Minimum tokens required for this version
        uint256 stakingMultiplier;    // Staking reward multiplier (basis points)
        uint256 shieldDiscount;       // Shield discount percentage (basis points)
        uint256 governanceWeight;     // Voting power multiplier
        bool hasEarlyAccess;          // Early market access privilege
        bool hasRevenueSharing;       // Revenue sharing eligibility
        bool isActive;                // Version availability status
    }

    // Staking information
    struct StakeInfo {
        uint256 amount;               // Staked token amount
        uint256 timestamp;            // Stake start time
        TokenVersion version;         // Staked version level
        uint256 pendingRewards;       // Accumulated rewards
        uint256 lockEndTime;          // Stake lock expiration
    }

    // User version tracking
    struct UserVersion {
        TokenVersion currentVersion;   // User's current version
        uint256 lastUpgrade;          // Last version upgrade timestamp
        bool[] unlockedVersions;      // Available version unlocks
    }

    // State variables
    mapping(TokenVersion => TokenConfig) public versionConfigs;
    mapping(address => StakeInfo) public userStakes;
    mapping(address => UserVersion) public userVersions;
    mapping(address => uint256) public revenueShares;
    
    uint256 public totalStaked;
    uint256 public rewardsPool;
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant SECONDS_PER_YEAR = 365 * 24 * 3600;
    
    // Events
    event VersionUpgraded(address indexed user, TokenVersion newVersion);
    event TokensStaked(address indexed user, uint256 amount, TokenVersion version);
    event TokensUnstaked(address indexed user, uint256 amount, uint256 rewards);
    event RewardsDistributed(address indexed user, uint256 amount);
    event RevenueSharePaid(address indexed user, uint256 amount);
    event VersionConfigUpdated(TokenVersion version, TokenConfig config);

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(STAKING_MANAGER_ROLE, msg.sender);
        _grantRole(VERSION_MANAGER_ROLE, msg.sender);
        
        _mint(msg.sender, initialSupply);
        _initializeVersionConfigs();
    }

    /**
     * @dev Initialize default version configurations
     */
    function _initializeVersionConfigs() private {
        // V1 Configuration - Foundation
        versionConfigs[TokenVersion.V1] = TokenConfig({
            requiredBalance: 1000 * 10**decimals(),
            stakingMultiplier: 100,  // 1% base APY
            shieldDiscount: 500,     // 5% shield discount
            governanceWeight: 1,
            hasEarlyAccess: false,
            hasRevenueSharing: false,
            isActive: true
        });

        // V2 Configuration - Enhanced
        versionConfigs[TokenVersion.V2] = TokenConfig({
            requiredBalance: 5000 * 10**decimals(),
            stakingMultiplier: 200,  // 2% APY
            shieldDiscount: 1000,    // 10% shield discount
            governanceWeight: 2,
            hasEarlyAccess: true,
            hasRevenueSharing: false,
            isActive: true
        });

        // V3 Configuration - Premium
        versionConfigs[TokenVersion.V3] = TokenConfig({
            requiredBalance: 25000 * 10**decimals(),
            stakingMultiplier: 300,  // 3% APY
            shieldDiscount: 1500,    // 15% shield discount
            governanceWeight: 5,
            hasEarlyAccess: true,
            hasRevenueSharing: false,
            isActive: true
        });

        // V4 Configuration - Elite
        versionConfigs[TokenVersion.V4] = TokenConfig({
            requiredBalance: 100000 * 10**decimals(),
            stakingMultiplier: 500,  // 5% APY
            shieldDiscount: 2000,    // 20% shield discount
            governanceWeight: 10,
            hasEarlyAccess: true,
            hasRevenueSharing: true,
            isActive: true
        });

        // V5 Configuration - Legendary
        versionConfigs[TokenVersion.V5] = TokenConfig({
            requiredBalance: 500000 * 10**decimals(),
            stakingMultiplier: 1000, // 10% APY
            shieldDiscount: 2500,    // 25% shield discount
            governanceWeight: 25,
            hasEarlyAccess: true,
            hasRevenueSharing: true,
            isActive: true
        });
    }

    /**
     * @dev Stake tokens for enhanced utilities
     * @param amount Amount of tokens to stake
     * @param lockDuration Duration to lock tokens (in seconds)
     */
    function stakeTokens(uint256 amount, uint256 lockDuration) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        require(amount > 0, "TokenManager: Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "TokenManager: Insufficient balance");
        require(lockDuration >= 30 days, "TokenManager: Minimum lock period is 30 days");
        require(lockDuration <= 365 days, "TokenManager: Maximum lock period is 365 days");

        // Claim any pending rewards first
        if (userStakes[msg.sender].amount > 0) {
            _claimStakingRewards(msg.sender);
        }

        // Transfer tokens to contract
        _transfer(msg.sender, address(this), amount);

        // Determine user's version based on total balance + stake
        TokenVersion userVersion = _calculateUserVersion(
            balanceOf(msg.sender).add(amount)
        );

        // Update stake info
        userStakes[msg.sender] = StakeInfo({
            amount: userStakes[msg.sender].amount.add(amount),
            timestamp: block.timestamp,
            version: userVersion,
            pendingRewards: 0,
            lockEndTime: block.timestamp.add(lockDuration)
        });

        totalStaked = totalStaked.add(amount);

        // Update user version if eligible
        _updateUserVersion(msg.sender, userVersion);

        emit TokensStaked(msg.sender, amount, userVersion);
    }

    /**
     * @dev Unstake tokens and claim rewards
     * @param amount Amount of tokens to unstake
     */
    function unstakeTokens(uint256 amount) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        StakeInfo storage stake = userStakes[msg.sender];
        require(stake.amount >= amount, "TokenManager: Insufficient staked amount");
        require(block.timestamp >= stake.lockEndTime, "TokenManager: Tokens still locked");

        // Calculate and claim rewards
        uint256 rewards = _calculateStakingRewards(msg.sender);
        _claimStakingRewards(msg.sender);

        // Update stake
        stake.amount = stake.amount.sub(amount);
        totalStaked = totalStaked.sub(amount);

        // Transfer tokens back
        _transfer(address(this), msg.sender, amount);

        // Recalculate user version
        TokenVersion newVersion = _calculateUserVersion(balanceOf(msg.sender));
        _updateUserVersion(msg.sender, newVersion);

        emit TokensUnstaked(msg.sender, amount, rewards);
    }

    /**
     * @dev Claim accumulated staking rewards
     */
    function claimRewards() external nonReentrant whenNotPaused {
        uint256 rewards = _claimStakingRewards(msg.sender);
        require(rewards > 0, "TokenManager: No rewards available");
    }

    /**
     * @dev Calculate staking rewards for a user
     * @param user User address
     * @return rewards Calculated reward amount
     */
    function _calculateStakingRewards(address user) private view returns (uint256) {
        StakeInfo storage stake = userStakes[user];
        if (stake.amount == 0) return 0;

        TokenConfig memory config = versionConfigs[stake.version];
        uint256 stakingDuration = block.timestamp.sub(stake.timestamp);
        
        uint256 annualReward = stake.amount.mul(config.stakingMultiplier).div(BASIS_POINTS);
        uint256 rewards = annualReward.mul(stakingDuration).div(SECONDS_PER_YEAR);
        
        return rewards.add(stake.pendingRewards);
    }

    /**
     * @dev Claim staking rewards for a user
     * @param user User address
     * @return rewards Claimed reward amount
     */
    function _claimStakingRewards(address user) private returns (uint256) {
        uint256 rewards = _calculateStakingRewards(user);
        if (rewards > 0 && rewardsPool >= rewards) {
            userStakes[user].pendingRewards = 0;
            userStakes[user].timestamp = block.timestamp;
            rewardsPool = rewardsPool.sub(rewards);
            
            _mint(user, rewards);
            emit RewardsDistributed(user, rewards);
        }
        return rewards;
    }

    /**
     * @dev Calculate user's version based on token balance
     * @param balance User's total token balance
     * @return version Calculated token version
     */
    function _calculateUserVersion(uint256 balance) private view returns (TokenVersion) {
        if (balance >= versionConfigs[TokenVersion.V5].requiredBalance) {
            return TokenVersion.V5;
        } else if (balance >= versionConfigs[TokenVersion.V4].requiredBalance) {
            return TokenVersion.V4;
        } else if (balance >= versionConfigs[TokenVersion.V3].requiredBalance) {
            return TokenVersion.V3;
        } else if (balance >= versionConfigs[TokenVersion.V2].requiredBalance) {
            return TokenVersion.V2;
        } else {
            return TokenVersion.V1;
        }
    }

    /**
     * @dev Update user's version status
     * @param user User address
     * @param newVersion New token version
     */
    function _updateUserVersion(address user, TokenVersion newVersion) private {
        UserVersion storage userVer = userVersions[user];
        
        if (uint8(newVersion) > uint8(userVer.currentVersion)) {
            userVer.currentVersion = newVersion;
            userVer.lastUpgrade = block.timestamp;
            
            // Initialize unlocked versions array if needed
            if (userVer.unlockedVersions.length == 0) {
                userVer.unlockedVersions = new bool[](5);
            }
            
            // Unlock current and lower versions
            for (uint8 i = 0; i <= uint8(newVersion); i++) {
                userVer.unlockedVersions[i] = true;
            }
            
            emit VersionUpgraded(user, newVersion);
        }
    }

    /**
     * @dev Distribute revenue sharing to eligible users
     * @param recipients List of recipient addresses
     * @param amounts List of corresponding amounts
     */
    function distributeRevenueSharing(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external onlyRole(STAKING_MANAGER_ROLE) {
        require(recipients.length == amounts.length, "TokenManager: Arrays length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            address recipient = recipients[i];
            uint256 amount = amounts[i];
            
            UserVersion storage userVer = userVersions[recipient];
            TokenConfig memory config = versionConfigs[userVer.currentVersion];
            
            if (config.hasRevenueSharing && amount > 0) {
                revenueShares[recipient] = revenueShares[recipient].add(amount);
                emit RevenueSharePaid(recipient, amount);
            }
        }
    }

    /**
     * @dev Claim accumulated revenue sharing
     */
    function claimRevenueShare() external nonReentrant {
        uint256 amount = revenueShares[msg.sender];
        require(amount > 0, "TokenManager: No revenue share available");
        
        revenueShares[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    /**
     * @dev Get user's current version and utilities
     * @param user User address
     * @return version Current token version
     * @return config Version configuration
     */
    function getUserVersion(address user) 
        external 
        view 
        returns (TokenVersion version, TokenConfig memory config) 
    {
        version = userVersions[user].currentVersion;
        config = versionConfigs[version];
    }

    /**
     * @dev Get user's shield discount percentage
     * @param user User address
     * @return discount Shield discount in basis points
     */
    function getShieldDiscount(address user) external view returns (uint256) {
        TokenVersion version = userVersions[user].currentVersion;
        return versionConfigs[version].shieldDiscount;
    }

    /**
     * @dev Check if user has early market access
     * @param user User address
     * @return hasAccess Boolean indicating early access privilege
     */
    function hasEarlyMarketAccess(address user) external view returns (bool) {
        TokenVersion version = userVersions[user].currentVersion;
        return versionConfigs[version].hasEarlyAccess;
    }

    /**
     * @dev Get user's governance voting weight
     * @param user User address
     * @return weight Voting weight multiplier
     */
    function getGovernanceWeight(address user) external view returns (uint256) {
        TokenVersion version = userVersions[user].currentVersion;
        return versionConfigs[version].governanceWeight;
    }

    /**
     * @dev Update version configuration (Admin only)
     * @param version Token version to update
     * @param config New configuration
     */
    function updateVersionConfig(
        TokenVersion version, 
        TokenConfig calldata config
    ) external onlyRole(VERSION_MANAGER_ROLE) {
        versionConfigs[version] = config;
        emit VersionConfigUpdated(version, config);
    }

    /**
     * @dev Add rewards to the staking pool
     * @param amount Amount to add to rewards pool
     */
    function addRewards(uint256 amount) external onlyRole(STAKING_MANAGER_ROLE) {
        require(balanceOf(msg.sender) >= amount, "TokenManager: Insufficient balance");
        _transfer(msg.sender, address(this), amount);
        rewardsPool = rewardsPool.add(amount);
    }

    /**
     * @dev Mint new tokens (Admin only)
     * @param to Recipient address
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    /**
     * @dev Pause token transfers (Admin only)
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @dev Unpause token transfers (Admin only)
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // Required overrides
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Pausable) {
        super._beforeTokenTransfer(from, to, amount);
        
        // Update recipient's version after transfer
        if (to != address(0) && to != address(this)) {
            TokenVersion newVersion = _calculateUserVersion(balanceOf(to).add(amount));
            _updateUserVersion(to, newVersion);
        }
    }

    /**
     * @dev Emergency withdrawal for contract upgrade
     */
    function emergencyWithdraw() external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 balance = address(this).balance;
        if (balance > 0) {
            payable(msg.sender).transfer(balance);
        }
    }

    // Allow contract to receive ETH for revenue sharing
    receive() external payable {}
}