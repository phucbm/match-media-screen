import { debounce, getSortedArray } from './utils'

// Type definitions
interface ResponsiveBreakpoint {
  breakpoint: number;
  settings: Record<string, any>;
}

interface MatchMediaConfig {
  dev?: boolean;
  object: Record<string, any> & {
    responsive?: ResponsiveBreakpoint[];
  };
  onMatched?: (currentObject: CurrentObject) => void;
  onUpdate?: (currentObject: CurrentObject) => void;
  isInherit?: boolean;
  debounce?: number;
}

interface CurrentObject {
  type: 'responsive' | 'default' | 'no-responsive';
  lastBreakpoint: number | undefined;
  breakpoint: number;
  object: Record<string, any>;
}

/**
 * Public class
 */
export class MatchMediaScreen {
  private readonly dev: boolean
  private readonly object: MatchMediaConfig['object']
  private readonly onMatched?: (currentObject: CurrentObject) => void
  private readonly onUpdate?: (currentObject: CurrentObject) => void
  private readonly isInherit: boolean
  private readonly debounce: number
  private currentObject: CurrentObject

  constructor(config: MatchMediaConfig) {
    // options
    this.dev = config.dev === true

    /** debounce: resize debounce time (default is 100ms) **/
    this.debounce = config.debounce || 100

    /** isInherit: inherit up to the closest breakpoint **/
    // if the current object don't have this key, search from the closest breakpoint above
    this.isInherit = typeof config.isInherit === 'undefined' ? true : config.isInherit

    /** Current object bases on responsive data **/
    this.currentObject = {
      type: 'default',
      lastBreakpoint: undefined,
      breakpoint: -1,
      object: {},
    }

    this.object = config.object
    if (!this.object) {
      console.error(`Property object:{} must be provided.`)
      return
    }

    // callbacks
    this.onMatched = config.onMatched // on media screen matched
    this.onUpdate = config.onUpdate // on resize

    // callback onUpdate
    window.addEventListener('resize',
      debounce(
        () => {
          if (typeof this.onUpdate === 'function') this.onUpdate(this.currentObject)
        },
        this.debounce,
      ),
    )

    // exit if there is no responsive object
    if (!this.object.responsive) {
      // update
      this.currentObject = {
        type: 'no-responsive',
        lastBreakpoint: undefined,
        breakpoint: -1,
        object: this.mergeObject(-1, this.object),
      }

      // callback onMatched
      if (typeof this.onMatched === 'function') {
        this.onMatched(this.currentObject)
      }

      if (this.dev) console.warn(`Property object must have responsive array.`)
      return
    }

    /** Sort responsive breakpoints from big to small **/
    this.object.responsive = getSortedArray(this.object.responsive)

    /** Matching **/
    this.match()
    window.addEventListener('resize', debounce(() => this.match(), this.debounce))
  }

  private match(): void {
    let isMatched = false

    // loop through all breakpoints
    for (let i = 0; i < this.object.responsive!.length; i++) {
      const breakpointData = this.object.responsive![i]

      // match query
      isMatched = matchMedia(this.getQuery(i)).matches

      // if matched
      if (isMatched) {
        // and is a new breakpoint
        if (this.currentObject.breakpoint !== breakpointData.breakpoint) {
          // update
          this.currentObject = {
            type: 'responsive',
            lastBreakpoint: this.currentObject.breakpoint,
            breakpoint: breakpointData.breakpoint,
            object: this.mergeObject(breakpointData.breakpoint, breakpointData.settings),
          }

          // callback onMatched
          if (typeof this.onMatched === 'function') {
            this.onMatched(this.currentObject)
          }
        }

        // stop looping once matched
        break
      }
    }

    // if no matching
    if (!isMatched && this.currentObject.breakpoint !== -1) {
      // update
      this.currentObject = {
        type: 'default',
        lastBreakpoint: this.currentObject.breakpoint,
        breakpoint: -1,
        object: this.mergeObject(-1, this.object),
      }

      // callback onMatched
      if (typeof this.onMatched === 'function') {
        this.onMatched(this.currentObject)
      }
    }
  }

  // get query string from breakpoint
  private getQuery(breakpointIndex: number): string {
    const breakpoint = this.object.responsive![breakpointIndex].breakpoint

    let query = `screen and (max-width:${breakpoint}px)`

    // set the min breakpoint if any
    const nextBreakpoint = this.object.responsive![breakpointIndex + 1]
    if (nextBreakpoint) {
      query += ` and (min-width:${nextBreakpoint.breakpoint + 1}px)`
    }

    return query
  }

  private mergeObject(breakpoint: number, newObject: Record<string, any>): Record<string, any> {
    // clone new object
    let object = { ...newObject }

    // if is inherited, check for previous breakpoint
    if (this.isInherit && breakpoint !== -1) {
      const reversedBreakpoints = getSortedArray(this.object.responsive!, false)

      for (let i = 0; i < reversedBreakpoints.length; i++) {
        // only check for bigger breakpoint
        if (reversedBreakpoints[i].breakpoint > breakpoint) {
          object = { ...reversedBreakpoints[i].settings, ...object }
        }
      }
    }

    // merge with default object
    object = { ...this.object, ...object }

    // remove responsive property
    delete object.responsive

    return object
  }
}