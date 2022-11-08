import {uniqueId} from "./utils";


/**
 * Private class
 */
export class MatchMediaScreen{
    constructor(options){
        this.id = uniqueId();
        this.options = {
            el: undefined,
            ...options
        };

        //this.options.el.innerHTML = 'Hello!';
    }
}