import { test, expect, Page } from '@playwright/test'

test.describe('Staking System', () => {
  let page: Page

  test.beforeEach(async ({ browser }) => {
    const context = await browser.newContext({
      storageState: 'tests/fixtures/auth-state.json'
    })
    page = await context.newPage()
    await page.goto('/staking')
  })

  test.describe('Staking Dashboard', () => {
    test('should display staking dashboard', async () => {
      await expect(page.locator('h1')).toContainText('Token Staking')
      await expect(page.locator('[data-testid="version-status-card"]')).toBeVisible()
      await expect(page.locator('[data-testid="staking-stats"]')).toBeVisible()
    })

    test('should show current token version', async () => {
      const versionCard = page.locator('[data-testid="version-status-card"]')
      await expect(versionCard).toContainText('V') // Should show V1, V2, V3, V4, or V5
      await expect(versionCard).toContainText('VLTR')
    })

    test('should display version progression', async () => {
      const progressBar = page.locator('[data-testid="version-progress"]')
      
      if (await progressBar.isVisible()) {
        await expect(progressBar).toBeVisible()
        await expect(page.locator('[data-testid="progress-text"]')).toContainText('%')
      }
    })

    test('should show staking statistics', async () => {
      // Available tokens
      await expect(page.locator('[data-testid="available-tokens"]')).toContainText('VLTR')
      
      // Staked tokens
      await expect(page.locator('[data-testid="staked-tokens"]')).toContainText('VLTR')
      
      // Earned rewards
      await expect(page.locator('[data-testid="earned-rewards"]')).toContainText('VLTR')
      
      // Current APY
      await expect(page.locator('[data-testid="current-apy"]')).toContainText('%')
    })
  })

  test.describe('Token Staking', () => {
    test('should stake tokens', async () => {
      // Navigate to stake tab
      await page.click('[data-testid="tab-stake"]')
      
      // Enter stake amount
      await page.fill('[data-testid="stake-amount-input"]', '1000')
      
      // Adjust duration
      const durationSlider = page.locator('[data-testid="duration-slider"]')
      await durationSlider.click()
      
      // Verify calculated rewards
      await expect(page.locator('[data-testid="estimated-rewards"]')).toContainText('VLTR')
      
      // Stake tokens
      await page.click('button:has-text("Stake Tokens")')
      
      // Verify staking process
      await expect(page.locator('text=Staking...') || page.locator('text=successfully')).toBeVisible()
    })

    test('should validate stake amount', async () => {
      await page.click('[data-testid="tab-stake"]')
      
      // Try staking more than available
      await page.fill('[data-testid="stake-amount-input"]', '999999')
      
      // Verify validation
      await expect(page.locator('button:has-text("Stake Tokens")')).toBeDisabled()
    })

    test('should use quick amount buttons', async () => {
      await page.click('[data-testid="tab-stake"]')
      
      // Click 25% button
      await page.click('button:has-text("25%")')
      
      // Verify amount is filled
      const input = page.locator('[data-testid="stake-amount-input"]')
      const value = await input.inputValue()
      expect(parseFloat(value)).toBeGreaterThan(0)
    })

    test('should calculate rewards based on version', async () => {
      await page.click('[data-testid="tab-stake"]')
      await page.fill('[data-testid="stake-amount-input"]', '5000')
      
      // Verify APY is shown based on current version
      const apyDisplay = page.locator('[data-testid="estimated-apy"]')
      await expect(apyDisplay).toContainText('%')
      
      // Verify estimated yearly rewards
      const estimatedRewards = page.locator('[data-testid="estimated-rewards"]')
      await expect(estimatedRewards).toContainText('VLTR')
    })
  })

  test.describe('Stake Management', () => {
    test('should display active stakes', async () => {
      await page.click('[data-testid="tab-unstake"]')
      
      // Check if stakes exist
      const stakeCards = page.locator('[data-testid="stake-card"]')
      const emptyState = page.locator('text=No active stakes')
      
      await expect(stakeCards.or(emptyState)).toBeVisible()
    })

    test('should claim rewards from stakes', async () => {
      await page.click('[data-testid="tab-unstake"]')
      
      const claimButton = page.locator('[data-testid="stake-card"]:first-child button:has-text("Claim")')
      
      if (await claimButton.isVisible()) {
        await claimButton.click()
        
        // Verify claim process
        await expect(page.locator('text=Rewards claimed') || page.locator('text=successfully')).toBeVisible()
      }
    })

    test('should unstake tokens after lock period', async () => {
      await page.click('[data-testid="tab-unstake"]')
      
      const unstakeButton = page.locator('[data-testid="stake-card"] button:has-text("Unstake")')
      
      if (await unstakeButton.isVisible() && !await unstakeButton.isDisabled()) {
        await unstakeButton.click()
        
        // Verify unstaking process
        await expect(page.locator('text=unstaked') || page.locator('text=successfully')).toBeVisible()
      }
    })

    test('should prevent unstaking during lock period', async () => {
      await page.click('[data-testid="tab-unstake"]')
      
      // Look for locked stakes
      const lockedStake = page.locator('[data-testid="stake-card"]:has-text("days left")')
      
      if (await lockedStake.isVisible()) {
        const unstakeButton = lockedStake.locator('button:has-text("Unstake")')
        
        if (await unstakeButton.isVisible()) {
          await expect(unstakeButton).toBeDisabled()
        }
      }
    })

    test('should show stake progress and unlock time', async () => {
      await page.click('[data-testid="tab-unstake"]')
      
      const stakeCard = page.locator('[data-testid="stake-card"]:first-child')
      
      if (await stakeCard.isVisible()) {
        // Should show progress bar
        await expect(stakeCard.locator('[data-testid="stake-progress"]')).toBeVisible()
        
        // Should show unlock date
        await expect(stakeCard).toContainText('Unlocks:')
        await expect(stakeCard).toContainText('days left')
      }
    })
  })

  test.describe('Version Benefits', () => {
    test('should display current version benefits', async () => {
      const benefitsCard = page.locator('[data-testid="version-benefits"]')
      await expect(benefitsCard).toBeVisible()
      
      // Check individual benefits
      await expect(benefitsCard).toContainText('Staking APY')
      await expect(benefitsCard).toContainText('Shield Discount')
      await expect(benefitsCard).toContainText('Governance Weight')
      await expect(benefitsCard).toContainText('Early Access')
      await expect(benefitsCard).toContainText('Revenue Sharing')
    })

    test('should show version roadmap', async () => {
      const roadmapCard = page.locator('[data-testid="version-roadmap"]')
      await expect(roadmapCard).toBeVisible()
      
      // Should show all version levels
      for (let i = 1; i <= 5; i++) {
        await expect(roadmapCard).toContainText(`V${i}`)
      }
      
      // Should highlight current version
      await expect(roadmapCard.locator('[data-testid="current-version"]')).toBeVisible()
    })

    test('should calculate version upgrades', async () => {
      const statusCard = page.locator('[data-testid="version-status-card"]')
      
      // Should show total balance
      await expect(statusCard).toContainText('VLTR')
      
      // Should show next version if not max level
      const nextVersionInfo = page.locator('[data-testid="next-version-info"]')
      if (await nextVersionInfo.isVisible()) {
        await expect(nextVersionInfo).toContainText('Progress to V')
      }
    })
  })

  test.describe('Token Utilities', () => {
    test('should show shield discount based on version', async () => {
      const benefitsCard = page.locator('[data-testid="version-benefits"]')
      const shieldDiscount = benefitsCard.locator('[data-testid="shield-discount"]')
      
      await expect(shieldDiscount).toContainText('%')
    })

    test('should display governance weight', async () => {
      const benefitsCard = page.locator('[data-testid="version-benefits"]')
      const governanceWeight = benefitsCard.locator('[data-testid="governance-weight"]')
      
      await expect(governanceWeight).toContainText('x')
    })

    test('should show early access status', async () => {
      const benefitsCard = page.locator('[data-testid="version-benefits"]')
      const earlyAccess = benefitsCard.locator('[data-testid="early-access"]')
      
      await expect(earlyAccess).toContainText('Yes' || 'No')
    })

    test('should display revenue sharing eligibility', async () => {
      const benefitsCard = page.locator('[data-testid="version-benefits"]')
      const revenueSharing = benefitsCard.locator('[data-testid="revenue-sharing"]')
      
      await expect(revenueSharing).toContainText('Yes' || 'No')
    })
  })

  test.describe('Responsive Design', () => {
    test('should work on mobile', async () => {
      await page.setViewportSize({ width: 375, height: 667 })
      
      // Verify mobile layout
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('[data-testid="staking-stats"]')).toBeVisible()
      
      // Test mobile staking flow
      await page.click('[data-testid="tab-stake"]')
      await expect(page.locator('[data-testid="stake-amount-input"]')).toBeVisible()
    })

    test('should work on tablet', async () => {
      await page.setViewportSize({ width: 768, height: 1024 })
      
      // Verify tablet layout
      await expect(page.locator('[data-testid="version-status-card"]')).toBeVisible()
      await expect(page.locator('[data-testid="version-benefits"]')).toBeVisible()
    })
  })

  test.describe('Error Handling', () => {
    test('should handle staking failures', async () => {
      // Mock staking failure
      await page.route('**/api/staking/stake**', route => route.abort())
      
      await page.click('[data-testid="tab-stake"]')
      await page.fill('[data-testid="stake-amount-input"]', '1000')
      await page.click('button:has-text("Stake Tokens")')
      
      // Verify error handling
      await expect(page.locator('text=Failed') || page.locator('text=Error')).toBeVisible()
    })

    test('should handle contract interaction errors', async () => {
      // Test with invalid stake amount
      await page.click('[data-testid="tab-stake"]')
      await page.fill('[data-testid="stake-amount-input"]', '0')
      
      // Verify validation prevents invalid operations
      await expect(page.locator('button:has-text("Stake Tokens")')).toBeDisabled()
    })
  })

  test.describe('Performance', () => {
    test('should load staking data quickly', async () => {
      const startTime = Date.now()
      await page.reload()
      await page.waitForSelector('[data-testid="staking-stats"]')
      const loadTime = Date.now() - startTime
      
      expect(loadTime).toBeLessThan(3000) // 3 seconds
    })

    test('should update calculations in real-time', async () => {
      await page.click('[data-testid="tab-stake"]')
      
      // Enter amount and verify immediate calculation
      await page.fill('[data-testid="stake-amount-input"]', '2000')
      
      // Should see updated rewards calculation without delay
      await expect(page.locator('[data-testid="estimated-rewards"]')).toContainText('VLTR')
    })
  })

  test.afterEach(async () => {
    await page.close()
  })
})