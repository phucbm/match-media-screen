// Import the MatchMediaScreen library
import { MatchMediaScreen } from '../src/index'

// DOM elements
const screenWidth = document.getElementById('screen-width')!
const currentType = document.getElementById('current-type')!
const currentBreakpoint = document.getElementById('current-breakpoint')!
const lastChange = document.getElementById('last-change')!
const breakpointIndicator = document.getElementById('breakpoint-indicator')!

const basicOutput = document.getElementById('basic-output')!
const inheritanceOutput = document.getElementById('inheritance-output')!
const complexOutput = document.getElementById('complex-output')!
const eventsOutput = document.getElementById('events-output')!

// Event log for the events output
let eventLog: string[] = []

// Helper function to update screen width
function updateScreenWidth() {
  screenWidth.textContent = `${window.innerWidth}px`
}

// Helper function to format timestamp
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// Helper function to add event to log
function addEvent(message: string) {
  eventLog.unshift(`${formatTime(new Date())}: ${message}`)
  if (eventLog.length > 5) eventLog.pop() // Keep only last 5 events
  eventsOutput.textContent = eventLog.join('\n')
}

// Update status panel
function updateStatus(data: any, source: string = '') {
  currentType.textContent = data.type || 'unknown'
  currentBreakpoint.textContent = data.breakpoint === -1 ? 'default' : `${data.breakpoint}px`
  lastChange.textContent = formatTime(new Date())

  // Update breakpoint indicator
  const value = data.object?.value || 'unknown'
  breakpointIndicator.textContent = value.toUpperCase()
  breakpointIndicator.className = `breakpoint-indicator ${value.toLowerCase()}`

  // Add event
  addEvent(`${source}: ${value} (${data.type})`)
}

// Initialize screen width display
updateScreenWidth()
window.addEventListener('resize', updateScreenWidth)

// Example 1: Basic Usage
const basic = new MatchMediaScreen({
  object: {
    value: 'desktop',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          value: 'tablet',
        },
      },
      {
        breakpoint: 480,
        settings: {
          value: 'mobile',
        },
      },
    ],
  },
  onMatched: (data) => {
    basicOutput.textContent = JSON.stringify(data, null, 2)
    updateStatus(data, 'Basic')
  },
  onUpdate: (data) => {
    basicOutput.textContent = JSON.stringify(data, null, 2)
    updateStatus(data, 'Basic (resize)')
  },
})

// Example 2: With Inheritance
const withInheritance = new MatchMediaScreen({
  object: {
    columns: 4,
    spacing: '2rem',
    fontSize: '16px',
    color: '#fff',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          columns: 2,
          spacing: '1.5rem',
          // fontSize and color will be inherited
        },
      },
      {
        breakpoint: 480,
        settings: {
          columns: 1,
          fontSize: '14px',
          // spacing and color will be inherited from 1024 and base
        },
      },
    ],
  },
  isInherit: true,
  onMatched: (data) => {
    inheritanceOutput.textContent = JSON.stringify(data, null, 2)
  },
})

// Example 3: Complex Configuration
const complex = new MatchMediaScreen({
  object: {
    layout: 'grid',
    navigation: 'horizontal',
    sidebar: true,
    animations: true,
    theme: 'dark',
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          layout: 'flexbox',
          sidebar: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          navigation: 'vertical',
          animations: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          layout: 'stack',
          theme: 'light',
        },
      },
    ],
  },
  isInherit: true,
  debounce: 100,
  dev: true,
  onMatched: (data) => {
    complexOutput.textContent = JSON.stringify(data, null, 2)
  },
})

// Example 4: Events Demo (no responsive, just for callbacks)
const eventsDemo = new MatchMediaScreen({
  object: {
    message: 'Hello World!',
  },
  onMatched: (data) => {
    addEvent(`onMatched called`)
  },
  onUpdate: (data) => {
    addEvent(`onUpdate called`)
  },
})

// Development helpers
// @ts-ignore
if (import.meta.hot) {
  // @ts-ignore
  import.meta.hot.accept('../src/index', () => {
    console.log('🔄 MatchMediaScreen library reloaded!')
    addEvent('HMR: Library reloaded')

    // You could reinitialize here if needed
    // Note: In a real scenario, you might want to clean up existing instances
  })
}

// Add some helpful console logs
console.group('🖥️ MatchMediaScreen Demo')
console.log('📱 Resize the window to see different breakpoints')
console.log('🔍 Check the examples above to see the data structure')
console.log('⚙️ Open DevTools to see live updates')
console.groupEnd()

// Welcome message
addEvent('Demo initialized')
addEvent('Resize window to test')

// Show initial screen size info
console.log(`Initial screen width: ${window.innerWidth}px`)