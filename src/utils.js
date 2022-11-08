/**
 * Sort array
 * @param array
 * @param isASC
 * @returns {*[]}
 */
export function getSortedArray(array, isASC = true){
    const newArray = [...array];

    if(isASC){
        newArray.sort((a, b) => a.breakpoint < b.breakpoint && 1 || -1);
    }else{
        newArray.sort((a, b) => a.breakpoint > b.breakpoint && 1 || -1);
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
export function debounce(func, timeout = 150){
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}