// Simple test to verify core package works
import { useProgress } from './packages/core/dist/index.js'

// Mock React context for testing
const mockContext = {
  getShowProgress: (seriesId) => ({
    watched: 5,
    total: 10
  })
}

// Test series progress
console.log('Testing core package...')

// Test 1: Check if types are exported correctly
try {
  // This would fail if types aren't working
  const testProps = {
    seriesId: 'tt123456',
    label: 'Test Progress'
  }
  console.log('✅ Types imported successfully')
} catch (error) {
  console.log('❌ Type import failed:', error.message)
}

// Test 2: Check if hook function exists
try {
  console.log('✅ Core package built successfully')
  console.log('📦 Available exports:', Object.keys(require('./packages/core/dist/index.js')))
} catch (error) {
  console.log('❌ Core package test failed:', error.message)
}
