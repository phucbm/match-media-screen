import {debounce, getSortedArray} from "./utils";
import {MatchMediaScreenConfig} from "./types/MatchMediaScreenConfig";
import {CurrentObject} from "./types/CurrentObject";
import {ResponsiveSetting} from "./types/ResponsiveSetting";


/**
 * Public class
 */
export class MatchMediaScreen {
    private readonly dev: boolean;
    private readonly object: MatchMediaScreenConfig["object"];
    private readonly onMatched?: (currentObject: CurrentObject) => void;
    private readonly onUpdate?: (currentObject: CurrentObject | undefined) => void;
    private readonly isInherit: boolean | undefined;
    private readonly debounce: number | undefined;
    private currentObject: CurrentObject | undefined;

    constructor(config: MatchMediaScreenConfig) {
        this.dev = config.dev === true;

        this.object = config.object || undefined;
        if (!this.object) {
            console.error(`Property object:{} must be provided.`);
            return;
        }

        // callbacks
        this.onMatched = config.onMatched;
        this.onUpdate = config.onUpdate;

        // callback onUpdate
        window.addEventListener('resize',
            debounce(
                () => {
                    if (typeof this.onUpdate === 'function') this.onUpdate(this.currentObject);
                },
                this.debounce
            )
        );

        // exit if there is no responsive object
        if (!this.object.responsive) {
            // update
            this.currentObject = {
                type: 'no-responsive',
                lastBreakpoint: undefined,
                breakpoint: -1,
                object: this.mergeObject(-1, this.object)
            };

            // callback onMatched
            if (typeof this.onMatched === 'function') {
                this.onMatched(this.currentObject);
            }

            if (this.dev) console.warn(`Property object must have responsive array.`);
            return;
        }

        // isInherit: inherit up to the closest breakpoint
        this.isInherit = typeof config.isInherit === 'undefined' ? true : config.isInherit;

        // debounce: resize debounce time (default is 100ms)
        this.debounce = config.debounce || 100;

        // Current object bases on responsive data
        this.currentObject = {type: "", breakpoint: undefined, object: {}};

        // Sort responsive breakpoints from big to small
        this.object.responsive = getSortedArray(this.object.responsive);

        // Matching
        this.match();
        window.addEventListener('resize', debounce(() => this.match(), this.debounce));
    }

    match() {
        if (!this.currentObject) return;
        let isMatched = false;

        // loop through all breakpoints
        if (this.object.responsive) {
            for (let i = 0; i < this.object.responsive.length; i++) {
                const breakpointData = this.object.responsive[i];

                // match query
                isMatched = matchMedia(<string>this.getQuery(i)).matches;

                // if matched
                if (isMatched) {
                    // and is a new breakpoint
                    if (this.currentObject.breakpoint !== breakpointData.breakpoint) {
                        // update
                        this.currentObject = {
                            type: 'responsive',
                            lastBreakpoint: this.currentObject.breakpoint,
                            breakpoint: breakpointData.breakpoint,
                            object: this.mergeObject(breakpointData.breakpoint, breakpointData.settings)
                        };

                        // callback onMatched
                        if (typeof this.onMatched === 'function') {
                            this.onMatched(this.currentObject);
                        }
                    }

                    // stop looping once matched
                    break;
                }
            }
        }

        // if no matching
        if (!isMatched && this.currentObject && this.currentObject.breakpoint !== -1) {
            // update
            this.currentObject = {
                type: 'default',
                lastBreakpoint: this.currentObject.breakpoint,
                breakpoint: -1,
                object: this.mergeObject(-1, this.object)
            };

            // callback onMatched
            if (typeof this.onMatched === 'function') {
                this.onMatched(this.currentObject);
            }
        }
    }

    // get query string from breakpoint
    getQuery(breakpointIndex: number): string | undefined {
        if (!this.object || !this.object.responsive) return;

        const breakpoint = this.object.responsive[breakpointIndex].breakpoint;

        let query = `screen and (max-width:${breakpoint}px)`;

        // set the min breakpoint if any
        const nextBreakpoint = this.object.responsive[breakpointIndex + 1];
        if (nextBreakpoint) {
            query += ` and (min-width:${nextBreakpoint.breakpoint + 1}px)`
        }

        return query;
    }

    mergeObject(breakpoint: number, newObject: Record<string, any>): Record<string, any> {
        // clone new object
        let object = {...newObject};

        // if is inherited, check for previous breakpoint
        if (this.isInherit && breakpoint !== -1) {
            const reversedBreakpoints = getSortedArray(this.object.responsive as ResponsiveSetting[], false);

            for (let i = 0; i < reversedBreakpoints.length; i++) {
                // only check for bigger breakpoint
                if (reversedBreakpoints[i].breakpoint > breakpoint) {
                    object = {...reversedBreakpoints[i].settings, ...object};
                }
            }
        }

        // merge with default object
        object = {...this.object, ...object};

        // remove responsive property
        delete object.responsive;

        return object;
    }
}
