// public styles
import '../public/style/fonts.css';

// private style
import './style.scss';

// source script
import {MatchMediaScreen} from "../src/_index";

/**
 * Lib usage
 */
new MatchMediaScreen({
    object: {
        value: 'desktop',
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    value: 'tablet',
                }
            },
            {
                breakpoint: 480,
                settings: {
                    value: 'mobile',
                }
            }
        ],
    },
    onMatched: (data: any) => {
        console.table(data);
        (document.querySelector('[data-code]') as HTMLElement).innerHTML = JSON.stringify(data);
    },
    onUpdate: (data: any) => {
        console.log('onUpdate', data);
    }
});
