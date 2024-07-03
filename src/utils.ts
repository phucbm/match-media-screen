/**
 * Sort array
 * @param array
 * @param isASC
 * @returns T[]
 */
export function getSortedArray<T extends { breakpoint: number }>(array: T[], isASC: boolean = true): T[] {
    const newArray = [...array];

    if (isASC) {
        newArray.sort((a, b) => (a.breakpoint < b.breakpoint ? 1 : -1));
    } else {
        newArray.sort((a, b) => (a.breakpoint > b.breakpoint ? 1 : -1));
    }

    return newArray;
}

/**
 * Debounce (ignore all, run the last)
 * https://www.freecodecamp.org/news/javascript-debounce-example/
 * @param func
 * @param timeout
 * @returns {(function(...[*]): void)|*}
 */
export function debounce<T extends (...args: any[]) => any>(func: T, timeout: number = 150): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>): void => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            // @ts-ignore
            func.apply(this, args);
        }, timeout);
    };
}
