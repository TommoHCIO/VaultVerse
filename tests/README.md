# VaultorVerse E2E Test Suite

Comprehensive end-to-end testing suite for the VaultorVerse prediction market platform using Playwright.

## 🧪 Test Coverage

### Core Features Tested
- **Prediction Arena** - Market discovery, betting, shield protection, real-time updates
- **Vaultor Events** - Live events, real-time participation, leaderboards, results
- **Staking System** - Token staking, version utilities, rewards management

### Test Categories
- ✅ **Functional Tests** - Core feature functionality
- ✅ **Integration Tests** - Component interactions
- ✅ **UI/UX Tests** - User interface and experience
- ✅ **Real-time Tests** - WebSocket and live features
- ✅ **Responsive Tests** - Mobile and tablet compatibility
- ✅ **Error Handling** - Graceful failure scenarios
- ✅ **Performance Tests** - Load times and responsiveness

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- VaultorVerse development server running
- PostgreSQL database setup (for integration tests)

### Installation
```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run playwright:install

# Install system dependencies (Linux/WSL only)
npm run playwright:install-deps
```

### Environment Setup
Create a `.env.test` file with test-specific configurations:
```bash
# Test Database (separate from development)
DATABASE_URL_TEST="postgresql://username:password@localhost:5432/vaultorverse_test"

# Test Environment
NODE_ENV="test"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Mock Web3 Settings
MOCK_WALLET_ADDRESS="0x742d35cc6675c05c4c16502d1b2a4b7b8f8f8b8f"
MOCK_USER_TOKEN="test_jwt_token"
```

## 🏃‍♂️ Running Tests

### Quick Commands
```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run with debugging
npm run test:e2e:debug

# View test results
npm run test:e2e:report
```

### Individual Test Suites
```bash
# Prediction Arena tests
npm run test:arena

# Vaultor Events tests
npm run test:events

# Staking System tests
npm run test:staking

# Custom test runner (with reporting)
npm run test:suite
```

### Browser Testing
Tests run on multiple browsers by default:
- ✅ Chromium (Desktop)
- ✅ Firefox (Desktop) 
- ✅ WebKit (Desktop Safari)
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

## 📁 Test Structure

```
tests/
├── fixtures/
│   ├── auth-state.json           # Authenticated user state
│   └── test-data.json           # Mock test data
├── global-setup.ts              # Database setup & teardown
├── global-teardown.ts           # Cleanup after tests
├── test-runner.ts               # Custom test orchestrator
├── prediction-arena.spec.ts     # Prediction market tests
├── vaultor-events.spec.ts       # Live events tests
├── staking-system.spec.ts       # Token staking tests
└── README.md                    # This file
```

## 🧩 Test Implementation

### Authentication Setup
Tests use a pre-configured authenticated state with:
- Mock wallet connection (0x742d35cc6675c05c4c16502d1b2a4b7b8f8f8b8f)
- Test user with V2 token version
- 15,000 VLTR token balance
- Active staking positions

### Database Management
- **Global Setup**: Creates clean test database with seed data
- **Test Isolation**: Each test runs with consistent state
- **Global Teardown**: Cleanup after all tests complete

### Mock Data
Tests include comprehensive mock data:
- Test markets with various states (active, resolved, featured)
- Live events with different statuses
- User positions and staking data
- Achievement and notification systems

## 🔧 Test Configuration

### Playwright Config (`playwright.config.ts`)
- **Parallel Execution**: Tests run in parallel for speed
- **Retry Logic**: 2 retries on CI, 0 locally
- **Reporters**: HTML, JSON, and JUnit reports
- **Screenshots**: On failure only
- **Videos**: Retained on failure
- **Traces**: On first retry

### Timeouts
- **Global Timeout**: 60 seconds per test
- **Action Timeout**: 30 seconds per action
- **Navigation Timeout**: 30 seconds per page load
- **Expect Timeout**: 10 seconds per assertion

## 📊 Test Scenarios

### Prediction Arena Tests
- Market discovery and filtering
- Search functionality
- Bet placement with/without Shield
- Amount validation and limits
- Token version discounts
- Real-time odds updates
- Market state transitions
- Responsive design
- Error handling

### Vaultor Events Tests
- Events dashboard navigation
- Event participation flow
- Live event interface
- Real-time answer submission
- Leaderboard updates
- Results viewing
- Socket connection handling
- Mobile experience

### Staking System Tests
- Token staking workflow
- Stake management
- Reward calculations
- Version benefit displays
- Version progression
- Unstaking restrictions
- Error scenarios
- Performance validation

## 🚨 Troubleshooting

### Common Issues

**Tests failing on CI**
- Ensure database is properly configured
- Check environment variables
- Verify Playwright browsers are installed

**Timeout errors**
- Increase timeout values for slow environments
- Check network connectivity
- Ensure development server is running

**Authentication failures**
- Verify auth-state.json is generated
- Check mock user data is created
- Ensure JWT tokens are valid

**Database connection issues**
- Confirm PostgreSQL is running
- Verify test database exists
- Check connection string format

### Debug Mode
Run tests in debug mode to step through execution:
```bash
npm run test:e2e:debug
```

### UI Mode
Use Playwright's UI mode for interactive testing:
```bash
npm run test:e2e:ui
```

## 📈 CI/CD Integration

### GitHub Actions Example
```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          DATABASE_URL_TEST: postgresql://postgres:postgres@localhost:5432/test
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 🎯 Best Practices

### Writing New Tests
1. **Use Page Object Model** - Organize selectors and actions
2. **Add Data Attributes** - Use `data-testid` for reliable selectors
3. **Test User Journeys** - Focus on complete workflows
4. **Handle Async Operations** - Properly wait for elements
5. **Clean Test Data** - Ensure tests don't interfere with each other

### Test Data Management
- Use realistic test data that mirrors production
- Keep test data minimal but comprehensive
- Clean up after tests to prevent interference
- Use factories for consistent data generation

### Performance Considerations
- Run tests in parallel when possible
- Use selective test runs during development
- Optimize wait strategies and timeouts
- Monitor test execution times

## 🔄 Maintenance

### Regular Tasks
- Update test data to match schema changes
- Review and update selectors for UI changes
- Monitor test execution times
- Update browser versions and dependencies

### Test Health Monitoring
- Track test success rates
- Identify flaky tests
- Monitor execution performance
- Review coverage reports

---

## 📞 Support

For questions about the test suite:
1. Check this README for common solutions
2. Review test logs and screenshots in `test-results/`
3. Run tests in debug mode for detailed analysis
4. Open issues for bugs or improvements

---

**Status**: ✅ Production Ready
**Coverage**: 🎯 Core Features Complete  
**Browsers**: 🌐 Multi-Browser Support
**CI/CD**: 🚀 GitHub Actions Ready