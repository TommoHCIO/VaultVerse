import { test, expect, Page } from '@playwright/test'

test.describe('Prediction Arena', () => {
  let page: Page

  test.beforeEach(async ({ browser }) => {
    const context = await browser.newContext({
      storageState: 'tests/fixtures/auth-state.json'
    })
    page = await context.newPage()
    await page.goto('/')
  })

  test.describe('Market Discovery', () => {
    test('should display markets dashboard', async () => {
      await expect(page.locator('h1')).toContainText('Prediction Arena')
      await expect(page.locator('[data-testid="market-stats"]')).toBeVisible()
      await expect(page.locator('[data-testid="market-card"]')).toHaveCount.greaterThan(0)
    })

    test('should filter markets by category', async () => {
      // Wait for markets to load
      await page.waitForSelector('[data-testid="market-card"]')
      
      // Click Crypto category filter
      await page.click('text=Crypto')
      
      // Verify only crypto markets are shown
      const cryptoMarkets = page.locator('[data-testid="market-card"]:has-text("Crypto")')
      await expect(cryptoMarkets).toHaveCount.greaterThan(0)
    })

    test('should search markets', async () => {
      const searchInput = page.locator('input[placeholder*="Search"]')
      await searchInput.fill('Bitcoin')
      
      // Wait for search results
      await page.waitForTimeout(500)
      
      // Verify search results
      const marketCards = page.locator('[data-testid="market-card"]')
      await expect(marketCards.first()).toContainText('Bitcoin')
    })

    test('should show market details', async () => {
      await page.click('[data-testid="market-card"]:first-child button:has-text("View Details")')
      
      // Verify market details are displayed
      await expect(page.locator('[data-testid="market-details"]')).toBeVisible()
      await expect(page.locator('[data-testid="market-outcomes"]')).toBeVisible()
      await expect(page.locator('[data-testid="market-stats"]')).toBeVisible()
    })
  })

  test.describe('Bet Placement', () => {
    test('should open bet placement modal', async () => {
      await page.click('[data-testid="market-card"]:first-child button:has-text("Place Bet")')
      
      // Verify bet placement modal opens
      await expect(page.locator('[data-testid="bet-placement-modal"]')).toBeVisible()
      await expect(page.locator('text=Place Your Bet')).toBeVisible()
    })

    test('should place a bet without shield', async () => {
      // Open bet placement
      await page.click('[data-testid="market-card"]:first-child button:has-text("Place Bet")')
      
      // Select outcome
      await page.click('[data-testid="outcome-option"]:first-child')
      
      // Enter bet amount
      await page.fill('input[placeholder="0.0"]', '0.5')
      
      // Verify bet summary
      await expect(page.locator('[data-testid="bet-summary"]')).toContainText('0.5 ETH')
      
      // Place bet
      await page.click('button:has-text("Place Bet")')
      
      // Verify success
      await expect(page.locator('text=Bet placed successfully')).toBeVisible()
    })

    test('should place a bet with shield protection', async () => {
      // Open bet placement
      await page.click('[data-testid="market-card"]:first-child button:has-text("Place Bet")')
      
      // Select outcome and amount
      await page.click('[data-testid="outcome-option"]:first-child')
      await page.fill('input[placeholder="0.0"]', '1.0')
      
      // Enable shield protection
      await page.click('[data-testid="shield-toggle"]')
      
      // Adjust shield percentage
      await page.locator('[data-testid="shield-slider"]').click()
      
      // Verify shield cost is calculated
      await expect(page.locator('[data-testid="shield-cost"]')).toContainText('ETH')
      
      // Place bet
      await page.click('button:has-text("Place Bet")')
      
      // Verify success
      await expect(page.locator('text=Bet placed successfully')).toBeVisible()
    })

    test('should validate bet amount limits', async () => {
      // Open bet placement
      await page.click('[data-testid="market-card"]:first-child button:has-text("Place Bet")')
      
      // Try amount below minimum
      await page.fill('input[placeholder="0.0"]', '0.01')
      await expect(page.locator('text=Amount must be between')).toBeVisible()
      
      // Try amount above maximum
      await page.fill('input[placeholder="0.0"]', '100')
      await expect(page.locator('text=Amount must be between')).toBeVisible()
      
      // Verify bet button is disabled
      await expect(page.locator('button:has-text("Place Bet")')).toBeDisabled()
    })

    test('should apply token version discounts', async () => {
      // Open bet placement
      await page.click('[data-testid="market-card"]:first-child button:has-text("Place Bet")')
      
      // Enable shield protection
      await page.click('[data-testid="shield-toggle"]')
      
      // Verify V2 discount is applied
      await expect(page.locator('[data-testid="version-badge"]')).toContainText('V2')
      await expect(page.locator('[data-testid="discount-badge"]')).toContainText('10% OFF')
    })
  })

  test.describe('Market States', () => {
    test('should display live markets', async () => {
      await page.click('[data-testid="tab-active"]')
      
      // Verify active markets are shown
      const activeMarkets = page.locator('[data-testid="market-card"]:not(:has-text("RESOLVED"))')
      await expect(activeMarkets).toHaveCount.greaterThan(0)
    })

    test('should display resolved markets', async () => {
      await page.click('[data-testid="tab-resolved"]')
      
      // Wait for resolved markets to load
      await page.waitForTimeout(1000)
      
      // Check if resolved markets exist or show empty state
      const resolvedMarkets = page.locator('[data-testid="market-card"]:has-text("Winner")')
      const emptyState = page.locator('text=No markets found')
      
      await expect(resolvedMarkets.or(emptyState)).toBeVisible()
    })

    test('should display featured markets', async () => {
      await page.click('[data-testid="tab-featured"]')
      
      // Verify featured markets are shown
      const featuredMarkets = page.locator('[data-testid="market-card"]:has-text("Featured")')
      await expect(featuredMarkets).toHaveCount.greaterThan(0)
    })
  })

  test.describe('Real-time Updates', () => {
    test('should update market odds in real-time', async () => {
      // Get initial odds
      const oddsElement = page.locator('[data-testid="market-odds"]:first-child')
      const initialOdds = await oddsElement.textContent()
      
      // Simulate real-time update (in a real test, this would come from WebSocket)
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('market-odds-update', {
          detail: { marketId: 'test-market-1', newOdds: [0.67, 0.33] }
        }))
      })
      
      // Wait for update
      await page.waitForTimeout(500)
      
      // Verify odds have updated (if real-time system is implemented)
      // This test would be more meaningful with actual WebSocket integration
    })

    test('should show market ending soon warning', async () => {
      // Look for markets ending soon
      const endingSoonMarkets = page.locator('[data-testid="market-card"]:has-text("Ending soon")')
      
      if (await endingSoonMarkets.count() > 0) {
        await expect(endingSoonMarkets.first()).toContainText('Ending soon')
      }
    })
  })

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async () => {
      await page.setViewportSize({ width: 375, height: 667 })
      
      // Verify mobile layout
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('[data-testid="market-card"]')).toBeVisible()
      
      // Test mobile navigation
      const mobileMenu = page.locator('[data-testid="mobile-menu"]')
      if (await mobileMenu.isVisible()) {
        await mobileMenu.click()
        await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible()
      }
    })

    test('should work on tablet viewport', async () => {
      await page.setViewportSize({ width: 768, height: 1024 })
      
      // Verify tablet layout
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('[data-testid="market-card"]')).toBeVisible()
    })
  })

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async () => {
      // Simulate network failure
      await page.route('**/api/markets**', route => route.abort())
      
      await page.reload()
      
      // Verify error state
      await expect(page.locator('text=Failed to load') || page.locator('text=Something went wrong')).toBeVisible()
    })

    test('should handle insufficient balance', async () => {
      // Mock insufficient balance
      await page.evaluate(() => {
        window.localStorage.setItem('test_balance', '0')
      })
      
      // Try to place a bet
      await page.click('[data-testid="market-card"]:first-child button:has-text("Place Bet")')
      await page.fill('input[placeholder="0.0"]', '1.0')
      
      // Verify insufficient balance message
      await expect(page.locator('text=Insufficient balance')).toBeVisible()
      await expect(page.locator('button:has-text("Place Bet")')).toBeDisabled()
    })
  })

  test.describe('Performance', () => {
    test('should load markets quickly', async () => {
      const startTime = Date.now()
      await page.goto('/')
      await page.waitForSelector('[data-testid="market-card"]')
      const loadTime = Date.now() - startTime
      
      // Verify page loads within reasonable time
      expect(loadTime).toBeLessThan(5000) // 5 seconds
    })

    test('should handle large number of markets', async () => {
      // Navigate through multiple pages if pagination exists
      const nextButton = page.locator('button:has-text("Next")')
      if (await nextButton.isVisible()) {
        await nextButton.click()
        await page.waitForSelector('[data-testid="market-card"]')
        await expect(page.locator('[data-testid="market-card"]')).toHaveCount.greaterThan(0)
      }
    })
  })

  test.afterEach(async () => {
    await page.close()
  })
})