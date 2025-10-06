import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@solidjs/testing-library'
import { afterEach, expect } from 'vitest'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})
