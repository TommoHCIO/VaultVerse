// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./PredictionMarket.sol";
import "./TokenManager.sol";
import "./OracleIntegration.sol";

/**
 * @title EmergencyPause
 * @dev Circuit breaker system for critical platform emergencies
 * @author VaultorVerse Team
 */
contract EmergencyPause is AccessControl, Pausable, ReentrancyGuard {
    // Role definitions
    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");
    bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN_ROLE");
    bytes32 public constant RECOVERY_ROLE = keccak256("RECOVERY_ROLE");

    // Emergency types
    enum EmergencyType {
        CRITICAL_BUG,
        ORACLE_FAILURE,
        MARKET_MANIPULATION,
        LIQUIDITY_CRISIS,
        SECURITY_BREACH,
        REGULATORY_ISSUE,
        TECHNICAL_FAILURE,
        GOVERNANCE_ATTACK
    }

    // Emergency levels
    enum EmergencyLevel {
        LOW,        // Non-critical issue, monitoring only
        MEDIUM,     // Pause specific functions
        HIGH,       // Pause major operations
        CRITICAL    // Full system shutdown
    }

    // Emergency state
    struct EmergencyState {
        bool isActive;
        EmergencyType emergencyType;
        EmergencyLevel level;
        uint256 timestamp;
        address initiator;
        string description;
        uint256 estimatedRecoveryTime;
        bool resolved;
    }

    // Component interfaces
    PredictionMarket public immutable predictionMarket;
    TokenManager public immutable tokenManager;
    OracleIntegration public immutable oracleIntegration;

    // State variables
    EmergencyState public currentEmergency;
    mapping(address => bool) public emergencyGuardians;
    mapping(EmergencyType => EmergencyLevel) public emergencyLevels;
    mapping(address => bool) public frozenAccounts;
    
    uint256 public guardianCount;
    uint256 public constant MIN_GUARDIANS_FOR_EMERGENCY = 2;
    uint256 public constant MAX_EMERGENCY_DURATION = 7 days;
    uint256 public emergencyNonce;

    // Emergency action tracking
    mapping(uint256 => mapping(address => bool)) public guardianVotes;
    mapping(uint256 => uint256) public emergencyVoteCount;

    // Events
    event EmergencyDeclared(
        EmergencyType indexed emergencyType,
        EmergencyLevel level,
        address indexed initiator,
        string description
    );
    event EmergencyResolved(
        EmergencyType indexed emergencyType,
        address indexed resolver,
        uint256 duration
    );
    event GuardianAdded(address indexed guardian);
    event GuardianRemoved(address indexed guardian);
    event AccountFrozen(address indexed account, string reason);
    event AccountUnfrozen(address indexed account);
    event EmergencyLevelChanged(EmergencyType emergencyType, EmergencyLevel newLevel);

    modifier onlyGuardian() {
        require(emergencyGuardians[msg.sender], "EmergencyPause: Not authorized guardian");
        _;
    }

    modifier onlyDuringEmergency() {
        require(currentEmergency.isActive, "EmergencyPause: No active emergency");
        _;
    }

    modifier onlyIfNotFrozen(address account) {
        require(!frozenAccounts[account], "EmergencyPause: Account frozen");
        _;
    }

    constructor(
        address _predictionMarket,
        address _tokenManager,
        address _oracleIntegration,
        address[] memory _initialGuardians
    ) {
        predictionMarket = PredictionMarket(_predictionMarket);
        tokenManager = TokenManager(_tokenManager);
        oracleIntegration = OracleIntegration(_oracleIntegration);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(EMERGENCY_ROLE, msg.sender);
        _grantRole(RECOVERY_ROLE, msg.sender);

        // Initialize emergency guardians
        for (uint256 i = 0; i < _initialGuardians.length; i++) {
            _addGuardian(_initialGuardians[i]);
        }

        _initializeEmergencyLevels();
    }

    /**
     * @dev Initialize default emergency levels for each type
     */
    function _initializeEmergencyLevels() private {
        emergencyLevels[EmergencyType.CRITICAL_BUG] = EmergencyLevel.CRITICAL;
        emergencyLevels[EmergencyType.ORACLE_FAILURE] = EmergencyLevel.HIGH;
        emergencyLevels[EmergencyType.MARKET_MANIPULATION] = EmergencyLevel.HIGH;
        emergencyLevels[EmergencyType.LIQUIDITY_CRISIS] = EmergencyLevel.MEDIUM;
        emergencyLevels[EmergencyType.SECURITY_BREACH] = EmergencyLevel.CRITICAL;
        emergencyLevels[EmergencyType.REGULATORY_ISSUE] = EmergencyLevel.MEDIUM;
        emergencyLevels[EmergencyType.TECHNICAL_FAILURE] = EmergencyLevel.HIGH;
        emergencyLevels[EmergencyType.GOVERNANCE_ATTACK] = EmergencyLevel.CRITICAL;
    }

    /**
     * @dev Declare emergency and trigger appropriate response
     * @param emergencyType Type of emergency
     * @param description Description of the issue
     * @param estimatedRecoveryTime Estimated time to resolve (seconds)
     */
    function declareEmergency(
        EmergencyType emergencyType,
        string calldata description,
        uint256 estimatedRecoveryTime
    ) external onlyGuardian nonReentrant {
        require(!currentEmergency.isActive, "EmergencyPause: Emergency already active");
        require(estimatedRecoveryTime <= MAX_EMERGENCY_DURATION, 
                "EmergencyPause: Recovery time too long");

        emergencyNonce++;
        EmergencyLevel level = emergencyLevels[emergencyType];

        // Record guardian vote
        guardianVotes[emergencyNonce][msg.sender] = true;
        emergencyVoteCount[emergencyNonce] = 1;

        // For critical emergencies, require multiple guardian approval
        if (level == EmergencyLevel.CRITICAL) {
            if (emergencyVoteCount[emergencyNonce] < MIN_GUARDIANS_FOR_EMERGENCY) {
                // Wait for more guardian votes
                return;
            }
        }

        // Activate emergency state
        currentEmergency = EmergencyState({
            isActive: true,
            emergencyType: emergencyType,
            level: level,
            timestamp: block.timestamp,
            initiator: msg.sender,
            description: description,
            estimatedRecoveryTime: estimatedRecoveryTime,
            resolved: false
        });

        // Execute emergency response based on level
        _executeEmergencyResponse(level);

        emit EmergencyDeclared(emergencyType, level, msg.sender, description);
    }

    /**
     * @dev Vote for emergency declaration (for critical emergencies)
     * @param nonce Emergency nonce to vote on
     */
    function voteForEmergency(uint256 nonce) external onlyGuardian {
        require(!guardianVotes[nonce][msg.sender], "EmergencyPause: Already voted");
        require(nonce == emergencyNonce, "EmergencyPause: Invalid nonce");
        require(!currentEmergency.isActive, "EmergencyPause: Emergency already active");

        guardianVotes[nonce][msg.sender] = true;
        emergencyVoteCount[nonce]++;

        // Check if enough votes for critical emergency
        if (emergencyVoteCount[nonce] >= MIN_GUARDIANS_FOR_EMERGENCY) {
            // Emergency can now be activated by any guardian
        }
    }

    /**
     * @dev Execute emergency response based on level
     * @param level Emergency level
     */
    function _executeEmergencyResponse(EmergencyLevel level) private {
        if (level == EmergencyLevel.MEDIUM) {
            // Pause non-critical functions
            _pause();
        } else if (level == EmergencyLevel.HIGH) {
            // Pause major operations
            _pause();
            predictionMarket.pause();
        } else if (level == EmergencyLevel.CRITICAL) {
            // Full system shutdown
            _pause();
            predictionMarket.pause();
            tokenManager.pause();
            oracleIntegration.pause();
        }
    }

    /**
     * @dev Resolve emergency and restore normal operations
     * @param description Resolution description
     */
    function resolveEmergency(
        string calldata description
    ) external onlyRole(RECOVERY_ROLE) onlyDuringEmergency nonReentrant {
        require(!currentEmergency.resolved, "EmergencyPause: Already resolved");

        uint256 duration = block.timestamp - currentEmergency.timestamp;
        EmergencyLevel level = currentEmergency.level;
        EmergencyType emergencyType = currentEmergency.emergencyType;

        // Mark emergency as resolved
        currentEmergency.resolved = true;
        currentEmergency.isActive = false;

        // Restore system operations based on previous level
        _restoreOperations(level);

        emit EmergencyResolved(emergencyType, msg.sender, duration);
    }

    /**
     * @dev Restore operations after emergency resolution
     * @param level Previous emergency level
     */
    function _restoreOperations(EmergencyLevel level) private {
        if (level >= EmergencyLevel.MEDIUM) {
            _unpause();
        }
        if (level >= EmergencyLevel.HIGH) {
            predictionMarket.unpause();
        }
        if (level == EmergencyLevel.CRITICAL) {
            tokenManager.unpause();
            oracleIntegration.unpause();
        }
    }

    /**
     * @dev Freeze account during emergency
     * @param account Account to freeze
     * @param reason Reason for freezing
     */
    function freezeAccount(
        address account, 
        string calldata reason
    ) external onlyRole(EMERGENCY_ROLE) onlyDuringEmergency {
        require(account != address(0), "EmergencyPause: Invalid account");
        
        frozenAccounts[account] = true;
        emit AccountFrozen(account, reason);
    }

    /**
     * @dev Unfreeze account after emergency resolution
     * @param account Account to unfreeze
     */
    function unfreezeAccount(address account) external onlyRole(RECOVERY_ROLE) {
        require(frozenAccounts[account], "EmergencyPause: Account not frozen");
        
        frozenAccounts[account] = false;
        emit AccountUnfrozen(account);
    }

    /**
     * @dev Add emergency guardian
     * @param guardian New guardian address
     */
    function addGuardian(address guardian) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _addGuardian(guardian);
    }

    /**
     * @dev Internal function to add guardian
     * @param guardian Guardian address
     */
    function _addGuardian(address guardian) private {
        require(guardian != address(0), "EmergencyPause: Invalid guardian");
        require(!emergencyGuardians[guardian], "EmergencyPause: Already guardian");

        emergencyGuardians[guardian] = true;
        guardianCount++;
        _grantRole(GUARDIAN_ROLE, guardian);

        emit GuardianAdded(guardian);
    }

    /**
     * @dev Remove emergency guardian
     * @param guardian Guardian to remove
     */
    function removeGuardian(address guardian) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(emergencyGuardians[guardian], "EmergencyPause: Not a guardian");
        require(guardianCount > MIN_GUARDIANS_FOR_EMERGENCY, 
                "EmergencyPause: Cannot reduce below minimum");

        emergencyGuardians[guardian] = false;
        guardianCount--;
        _revokeRole(GUARDIAN_ROLE, guardian);

        emit GuardianRemoved(guardian);
    }

    /**
     * @dev Update emergency level for a type
     * @param emergencyType Emergency type to update
     * @param newLevel New emergency level
     */
    function updateEmergencyLevel(
        EmergencyType emergencyType,
        EmergencyLevel newLevel
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        emergencyLevels[emergencyType] = newLevel;
        emit EmergencyLevelChanged(emergencyType, newLevel);
    }

    /**
     * @dev Check if account is frozen
     * @param account Account to check
     * @return frozen Account freeze status
     */
    function isAccountFrozen(address account) external view returns (bool) {
        return frozenAccounts[account];
    }

    /**
     * @dev Get current emergency status
     * @return state Current emergency state
     */
    function getEmergencyState() external view returns (EmergencyState memory) {
        return currentEmergency;
    }

    /**
     * @dev Check if address is emergency guardian
     * @param account Address to check
     * @return isGuardian Guardian status
     */
    function isGuardian(address account) external view returns (bool) {
        return emergencyGuardians[account];
    }

    /**
     * @dev Get emergency level for type
     * @param emergencyType Emergency type
     * @return level Emergency level
     */
    function getEmergencyLevel(EmergencyType emergencyType) 
        external 
        view 
        returns (EmergencyLevel) 
    {
        return emergencyLevels[emergencyType];
    }

    /**
     * @dev Emergency function to extend emergency duration
     * @param additionalTime Additional time in seconds
     */
    function extendEmergency(
        uint256 additionalTime
    ) external onlyRole(DEFAULT_ADMIN_ROLE) onlyDuringEmergency {
        require(additionalTime <= MAX_EMERGENCY_DURATION, 
                "EmergencyPause: Extension too long");
        
        currentEmergency.estimatedRecoveryTime += additionalTime;
    }

    /**
     * @dev Force resolve emergency in extreme cases
     */
    function forceResolveEmergency() external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(currentEmergency.isActive, "EmergencyPause: No active emergency");
        require(block.timestamp >= currentEmergency.timestamp + MAX_EMERGENCY_DURATION,
                "EmergencyPause: Emergency period not expired");

        currentEmergency.resolved = true;
        currentEmergency.isActive = false;

        // Force restore all operations
        _restoreOperations(EmergencyLevel.CRITICAL);
    }

    /**
     * @dev Modifier to check system health before operations
     */
    modifier systemHealthCheck() {
        require(!currentEmergency.isActive || currentEmergency.level == EmergencyLevel.LOW,
                "EmergencyPause: System emergency active");
        _;
    }

    /**
     * @dev Get system health status
     * @return healthy System health status
     * @return level Current emergency level (0 if no emergency)
     */
    function getSystemHealth() external view returns (bool healthy, uint8 level) {
        if (!currentEmergency.isActive) {
            return (true, 0);
        }
        return (false, uint8(currentEmergency.level));
    }
}