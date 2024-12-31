import '@testing-library/jest-dom'

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn()
}

global.localStorage = localStorageMock