import { execSync } from 'child_process'
import { existsSync } from 'fs'

interface TestSuite {
  name: string
  file: string
  description: string
  critical: boolean
}

const testSuites: TestSuite[] = [
  {
    name: 'Prediction Arena',
    file: 'prediction-arena.spec.ts',
    description: 'Core prediction market functionality',
    critical: true
  },
  {
    name: 'Vaultor Events',
    file: 'vaultor-events.spec.ts', 
    description: 'Live event system and real-time features',
    critical: true
  },
  {
    name: 'Staking System',
    file: 'staking-system.spec.ts',
    description: 'Token staking and version utilities',
    critical: true
  }
]

async function runTestSuite(suite: TestSuite): Promise<{ success: boolean; output: string }> {
  console.log(`🧪 Running ${suite.name} tests...`)
  console.log(`   ${suite.description}`)
  
  try {
    const output = execSync(`npx playwright test tests/${suite.file}`, {
      encoding: 'utf-8',
      timeout: 300000 // 5 minutes timeout
    })
    
    console.log(`✅ ${suite.name} tests passed`)
    return { success: true, output }
  } catch (error: any) {
    console.log(`❌ ${suite.name} tests failed`)
    console.log(error.stdout || error.message)
    return { success: false, output: error.stdout || error.message }
  }
}

async function runAllTests() {
  console.log('🚀 Starting VaultorVerse E2E Test Suite')
  console.log('=========================================\n')
  
  // Check if Playwright is installed
  try {
    execSync('npx playwright --version', { stdio: 'ignore' })
  } catch (error) {
    console.log('❌ Playwright not installed. Installing...')
    execSync('npx playwright install', { stdio: 'inherit' })
  }
  
  const results: Array<{ suite: TestSuite; success: boolean; output: string }> = []
  
  // Run each test suite
  for (const suite of testSuites) {
    if (!existsSync(`tests/${suite.file}`)) {
      console.log(`⚠️  Skipping ${suite.name} - test file not found`)
      continue
    }
    
    const result = await runTestSuite(suite)
    results.push({ suite, ...result })
    
    // Add delay between test suites
    if (testSuites.indexOf(suite) < testSuites.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  
  // Generate summary report
  console.log('\n📊 Test Results Summary')
  console.log('========================')
  
  let passedCount = 0
  let failedCount = 0
  let criticalFailures = 0
  
  results.forEach(({ suite, success }) => {
    const status = success ? '✅ PASSED' : '❌ FAILED'
    const critical = suite.critical ? ' (CRITICAL)' : ''
    
    console.log(`${status} ${suite.name}${critical}`)
    
    if (success) {
      passedCount++
    } else {
      failedCount++
      if (suite.critical) {
        criticalFailures++
      }
    }
  })
  
  console.log(`\nTotal: ${results.length} suites`)
  console.log(`Passed: ${passedCount}`)
  console.log(`Failed: ${failedCount}`)
  
  if (criticalFailures > 0) {
    console.log(`❌ ${criticalFailures} critical test suite(s) failed`)
    process.exit(1)
  } else if (failedCount > 0) {
    console.log(`⚠️  ${failedCount} non-critical test suite(s) failed`)
    process.exit(1)
  } else {
    console.log(`🎉 All tests passed successfully!`)
    process.exit(0)
  }
}

// Run if called directly
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('❌ Test runner failed:', error)
    process.exit(1)
  })
}

export { runAllTests, runTestSuite, testSuites }