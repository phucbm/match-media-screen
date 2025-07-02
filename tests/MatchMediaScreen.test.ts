import { MatchMediaScreen } from '../src/index'

describe('MatchMediaScreen', () => {
  // Mock matchMedia before each test
  let mockMatchMedia: jest.Mock
  let consoleSpy: jest.SpyInstance

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = ''

    // Clear all previous mocks
    jest.clearAllMocks()

    // Spy on console.log for debugging
    consoleSpy = jest.spyOn(console, 'log').mockImplementation()

    // Mock matchMedia with default false matches
    mockMatchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    })

    // Mock timers for debounce testing
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.clearAllMocks()
    consoleSpy.mockRestore()
  })

  describe('Constructor - Core Functionality', () => {
    test('should initialize with valid config', () => {
      const config = {
        object: {
          name: 'test',
          responsive: [
            { breakpoint: 768, settings: { name: 'mobile' } },
          ],
        },
      }

      const instance = new MatchMediaScreen(config)

      expect(instance).toBeInstanceOf(MatchMediaScreen)
      expect(mockMatchMedia).toHaveBeenCalled()
    })

    test('should handle missing object property', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      const config = {
        object: undefined as any,
      }

      const instance = new MatchMediaScreen(config)

      expect(consoleSpy).toHaveBeenCalledWith('Property object:{} must be provided.')
      consoleSpy.mockRestore()
    })

    test('should set default values for optional properties', () => {
      const onMatchedSpy = jest.fn()

      // First mock a breakpoint match, then change to no match
      // This simulates a breakpoint change that will trigger the callback
      let callCount = 0
      mockMatchMedia.mockImplementation((query: string) => {
        callCount++
        // First call matches, second call (resize simulation) doesn't
        return {
          matches: callCount === 1,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        }
      })

      const config = {
        object: {
          name: 'test',
          responsive: [
            { breakpoint: 768, settings: { name: 'mobile' } },
          ],
        },
        onMatched: onMatchedSpy,
      }

      const instance = new MatchMediaScreen(config)

      // Should call onMatched during initialization when breakpoint matches
      expect(onMatchedSpy).toHaveBeenCalled()
      expect(onMatchedSpy.mock.calls[0][0]).toHaveProperty('type', 'responsive')
    })
  })

  describe('No Responsive Array Handling', () => {
    test('should handle object without responsive array', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      const onMatchedSpy = jest.fn()

      const config = {
        dev: true,
        object: { name: 'test' }, // No responsive array
        onMatched: onMatchedSpy,
      }

      new MatchMediaScreen(config)

      expect(consoleSpy).toHaveBeenCalledWith('Property object must have responsive array.')
      expect(onMatchedSpy).toHaveBeenCalled()

      const callArgs = onMatchedSpy.mock.calls[0][0]
      expect(callArgs.type).toBe('no-responsive')
      expect(callArgs.breakpoint).toBe(-1)

      consoleSpy.mockRestore()
    })
  })

  describe('Breakpoint Matching', () => {
    test('should match correct breakpoint and call onMatched', () => {
      const onMatchedSpy = jest.fn()

      // Mock matchMedia to return true for our specific query
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query.includes('max-width:768px'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }))

      const config = {
        object: {
          name: 'desktop',
          responsive: [
            { breakpoint: 768, settings: { name: 'mobile' } },
            { breakpoint: 1024, settings: { name: 'tablet' } },
          ],
        },
        onMatched: onMatchedSpy,
      }

      new MatchMediaScreen(config)

      expect(onMatchedSpy).toHaveBeenCalled()

      const callArgs = onMatchedSpy.mock.calls[0][0]
      expect(callArgs.type).toBe('responsive')
      expect(callArgs.breakpoint).toBe(768)
      expect(callArgs.object.name).toBe('mobile')
    })

    test('should fall back to default when breakpoint changes from responsive to no match', () => {
      const onMatchedSpy = jest.fn()

      // Initially match a breakpoint
      mockMatchMedia.mockReturnValue({
        matches: true,
        media: '',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })

      const config = {
        object: {
          name: 'desktop',
          responsive: [
            { breakpoint: 768, settings: { name: 'mobile' } },
          ],
        },
        onMatched: onMatchedSpy,
      }

      const instance = new MatchMediaScreen(config)

      // Should be called once for initial match
      expect(onMatchedSpy).toHaveBeenCalledTimes(1)
      expect(onMatchedSpy.mock.calls[0][0].type).toBe('responsive')

      // Now change matchMedia to return false (simulating resize)
      mockMatchMedia.mockReturnValue({
        matches: false,
        media: '',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })

      // Trigger resize to simulate breakpoint change
      window.dispatchEvent(new Event('resize'))
      jest.advanceTimersByTime(100)

      // Should be called again for fallback to default
      expect(onMatchedSpy).toHaveBeenCalledTimes(2)

      const fallbackArgs = onMatchedSpy.mock.calls[1][0]
      expect(fallbackArgs.type).toBe('default')
      expect(fallbackArgs.breakpoint).toBe(-1)
      expect(fallbackArgs.object.name).toBe('desktop')
    })
  })

  describe('Resize Event Handling', () => {
    test('should handle resize events with debouncing', () => {
      const onUpdateSpy = jest.fn()

      const config = {
        object: {
          name: 'test',
          responsive: [
            { breakpoint: 768, settings: { name: 'mobile' } },
          ],
        },
        onUpdate: onUpdateSpy,
        debounce: 100,
      }

      new MatchMediaScreen(config)

      // Trigger multiple resize events
      window.dispatchEvent(new Event('resize'))
      window.dispatchEvent(new Event('resize'))
      window.dispatchEvent(new Event('resize'))

      // Should not be called yet due to debouncing
      expect(onUpdateSpy).not.toHaveBeenCalled()

      // Fast forward time
      jest.advanceTimersByTime(100)

      // Should be called once after debounce
      expect(onUpdateSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('Object Merging', () => {
    test('should merge breakpoint settings with base object', () => {
      const onMatchedSpy = jest.fn()

      // Mock to match the 768px breakpoint
      mockMatchMedia.mockImplementation((query: string) => ({
        matches: query.includes('max-width:768px'),
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }))

      const config = {
        object: {
          name: 'desktop',
          color: 'blue',
          responsive: [
            {
              breakpoint: 768,
              settings: {
                name: 'mobile',
                size: 'small',
              },
            },
          ],
        },
        onMatched: onMatchedSpy,
      }

      new MatchMediaScreen(config)

      const callArgs = onMatchedSpy.mock.calls[0][0]

      // Should merge base object with breakpoint settings
      expect(callArgs.object.name).toBe('mobile') // overridden
      expect(callArgs.object.color).toBe('blue') // inherited
      expect(callArgs.object.size).toBe('small') // from breakpoint
      expect(callArgs.object.responsive).toBeUndefined() // removed
    })
  })

  describe('Callback Safety', () => {
    test('should work without onMatched callback', () => {
      const config = {
        object: {
          name: 'test',
          responsive: [
            { breakpoint: 768, settings: { name: 'mobile' } },
          ],
        },
        // No onMatched callback
      }

      expect(() => {
        new MatchMediaScreen(config)
      }).not.toThrow()
    })

    test('should work without onUpdate callback', () => {
      const config = {
        object: {
          name: 'test',
          responsive: [
            { breakpoint: 768, settings: { name: 'mobile' } },
          ],
        },
        // No onUpdate callback
      }

      const instance = new MatchMediaScreen(config)

      expect(() => {
        window.dispatchEvent(new Event('resize'))
        jest.advanceTimersByTime(100)
      }).not.toThrow()
    })
  })
})