// Type definition for breakpoint objects
interface BreakpointItem {
  breakpoint: number;
  settings: Record<string, any>;
}

/**
 * Sort array
 * @param array - Array of breakpoint objects to sort
 * @param isASC - Whether to sort in ascending order (default: true)
 * @returns Sorted array of breakpoint objects
 */
export function getSortedArray(array: BreakpointItem[], isASC: boolean = true): BreakpointItem[] {
  const newArray = [...array]

  if (isASC) {
    newArray.sort((a, b) => a.breakpoint < b.breakpoint ? 1 : -1)
  } else {
    newArray.sort((a, b) => a.breakpoint > b.breakpoint ? 1 : -1)
  }

  return newArray
}

/**
 * Debounce (ignore all, run the last)
 * https://www.freecodecamp.org/news/javascript-debounce-example/
 * @param func - Function to debounce
 * @param timeout - Timeout in milliseconds (default: 150)
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  timeout: number = 150,
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      // @ts-ignore
      func.apply(this, args)
    }, timeout)
  }
}