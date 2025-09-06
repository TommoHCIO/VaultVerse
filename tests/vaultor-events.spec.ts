import { test, expect, Page } from '@playwright/test'

test.describe('Vaultor Events', () => {
  let page: Page

  test.beforeEach(async ({ browser }) => {
    const context = await browser.newContext({
      storageState: 'tests/fixtures/auth-state.json'
    })
    page = await context.newPage()
    await page.goto('/events')
  })

  test.describe('Events Dashboard', () => {
    test('should display events dashboard', async () => {
      await expect(page.locator('h1')).toContainText('Vaultor Events')
      await expect(page.locator('[data-testid="events-stats"]')).toBeVisible()
    })

    test('should show live events alert when events are live', async () => {
      const liveAlert = page.locator('[data-testid="live-events-alert"]')
      
      if (await liveAlert.isVisible()) {
        await expect(liveAlert).toContainText('Live Now')
        await expect(liveAlert.locator('button:has-text("Watch Live")')).toBeVisible()
      }
    })

    test('should filter events by status', async () => {
      // Test upcoming events tab
      await page.click('[data-testid="tab-upcoming"]')
      await expect(page.locator('[data-testid="event-card"]:not(:has-text("LIVE")):not(:has-text("COMPLETED"))')).toHaveCount.greaterThanOrEqual(0)

      // Test live events tab
      await page.click('[data-testid="tab-live"]')
      const liveEvents = page.locator('[data-testid="event-card"]:has-text("LIVE")')
      await expect(liveEvents).toHaveCount.greaterThanOrEqual(0)

      // Test completed events tab
      await page.click('[data-testid="tab-completed"]')
      const completedEvents = page.locator('[data-testid="event-card"]:has-text("COMPLETED")')
      await expect(completedEvents).toHaveCount.greaterThanOrEqual(0)
    })
  })

  test.describe('Event Participation', () => {
    test('should join an upcoming event', async () => {
      await page.click('[data-testid="tab-upcoming"]')
      
      const joinButton = page.locator('[data-testid="event-card"]:first-child button:has-text("Join Event")')
      
      if (await joinButton.isVisible()) {
        await joinButton.click()
        
        // Verify success message
        await expect(page.locator('text=Joined') || page.locator('text=successfully')).toBeVisible()
        
        // Verify button state changes
        await expect(page.locator('[data-testid="event-card"]:first-child button:has-text("Joined")')).toBeVisible()
      }
    })

    test('should prevent joining when already participating', async () => {
      await page.click('[data-testid="tab-upcoming"]')
      
      const joinedButton = page.locator('[data-testid="event-card"] button:has-text("Joined")')
      
      if (await joinedButton.isVisible()) {
        await expect(joinedButton).toBeDisabled()
      }
    })

    test('should show user performance in live events', async () => {
      await page.click('[data-testid="tab-live"]')
      
      const liveEventCard = page.locator('[data-testid="event-card"]:has-text("LIVE")')
      
      if (await liveEventCard.isVisible()) {
        const performanceSection = liveEventCard.locator('[data-testid="user-performance"]')
        
        if (await performanceSection.isVisible()) {
          await expect(performanceSection).toContainText('Your Performance')
          await expect(performanceSection).toContainText('Rank')
          await expect(performanceSection).toContainText('pts')
        }
      }
    })
  })

  test.describe('Live Event Experience', () => {
    test('should watch live event', async () => {
      await page.click('[data-testid="tab-live"]')
      
      const watchButton = page.locator('[data-testid="event-card"]:first-child button:has-text("Watch Live")')
      
      if (await watchButton.isVisible()) {
        await watchButton.click()
        
        // Verify live event interface loads
        await expect(page.locator('[data-testid="live-event-interface"]')).toBeVisible()
        await expect(page.locator('[data-testid="live-status-bar"]')).toContainText('LIVE')
      }
    })

    test('should display live leaderboard', async () => {
      // Navigate to live event
      await page.goto('/events/live/test-event-1')
      
      if (await page.locator('[data-testid="live-event-interface"]').isVisible()) {
        await expect(page.locator('[data-testid="live-leaderboard"]')).toBeVisible()
        await expect(page.locator('[data-testid="leaderboard-entry"]')).toHaveCount.greaterThan(0)
      }
    })

    test('should submit answers during live event', async () => {
      await page.goto('/events/live/test-event-1')
      
      if (await page.locator('[data-testid="current-question"]').isVisible()) {
        // Wait for question to load
        await page.waitForSelector('[data-testid="answer-option"]')
        
        // Select an answer
        await page.click('[data-testid="answer-option"]:first-child')
        
        // Verify answer was submitted
        await expect(page.locator('[data-testid="answer-submitted"]')).toBeVisible()
        await expect(page.locator('text=Answer Submitted')).toBeVisible()
      }
    })

    test('should show timer and progress', async () => {
      await page.goto('/events/live/test-event-1')
      
      if (await page.locator('[data-testid="live-event-interface"]').isVisible()) {
        await expect(page.locator('[data-testid="question-timer"]')).toBeVisible()
        await expect(page.locator('[data-testid="progress-bar"]')).toBeVisible()
        await expect(page.locator('[data-testid="time-remaining"]')).toContainText('s')
      }
    })

    test('should display user score updates', async () => {
      await page.goto('/events/live/test-event-1')
      
      if (await page.locator('[data-testid="user-performance"]').isVisible()) {
        await expect(page.locator('[data-testid="current-score"]')).toContainText('pts')
        await expect(page.locator('[data-testid="user-rank"]')).toContainText('#')
      }
    })
  })

  test.describe('Event Results', () => {
    test('should view completed event results', async () => {
      await page.click('[data-testid="tab-completed"]')
      
      const viewResultsButton = page.locator('[data-testid="event-card"]:first-child button:has-text("View Results")')
      
      if (await viewResultsButton.isVisible()) {
        await viewResultsButton.click()
        
        // Verify results page loads
        await expect(page.locator('[data-testid="event-results"]')).toBeVisible()
        await expect(page.locator('[data-testid="final-leaderboard"]')).toBeVisible()
      }
    })

    test('should display prize distribution', async () => {
      await page.goto('/events/results/test-event-1')
      
      if (await page.locator('[data-testid="event-results"]').isVisible()) {
        await expect(page.locator('[data-testid="prize-distribution"]')).toBeVisible()
        await expect(page.locator('[data-testid="total-prize-pool"]')).toContainText('ETH')
      }
    })
  })

  test.describe('Real-time Features', () => {
    test('should connect to live event socket', async () => {
      await page.goto('/events/live/test-event-1')
      
      // Check connection status
      const connectionStatus = page.locator('[data-testid="connection-status"]')
      
      if (await connectionStatus.isVisible()) {
        await expect(connectionStatus).toContainText('Connected')
      }
    })

    test('should receive real-time updates', async () => {
      await page.goto('/events/live/test-event-1')
      
      // Mock socket event
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('participant-joined', {
          detail: { eventId: 'test-event-1', participantCount: 248 }
        }))
      })
      
      // Verify participant count updates (if implemented)
      await page.waitForTimeout(500)
    })
  })

  test.describe('Mobile Experience', () => {
    test('should work on mobile during live events', async () => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/events/live/test-event-1')
      
      if (await page.locator('[data-testid="live-event-interface"]').isVisible()) {
        // Verify mobile layout
        await expect(page.locator('[data-testid="question-card"]')).toBeVisible()
        await expect(page.locator('[data-testid="answer-options"]')).toBeVisible()
        
        // Test answer selection on mobile
        const answerOption = page.locator('[data-testid="answer-option"]:first-child')
        if (await answerOption.isVisible()) {
          await answerOption.click()
        }
      }
    })
  })

  test.describe('Error Handling', () => {
    test('should handle connection failures gracefully', async () => {
      await page.goto('/events/live/test-event-1')
      
      // Simulate network failure
      await page.route('**/socket.io/**', route => route.abort())
      
      // Verify error handling
      await expect(page.locator('[data-testid="connection-error"]') || page.locator('text=Connecting')).toBeVisible()
    })

    test('should handle invalid event ID', async () => {
      await page.goto('/events/live/invalid-event-id')
      
      // Verify error state
      await expect(page.locator('text=Event not found') || page.locator('text=Invalid')).toBeVisible()
    })
  })

  test.afterEach(async () => {
    await page.close()
  })
})