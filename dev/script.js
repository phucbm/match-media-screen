// public styles
import '../public/style/fonts.css';

// private style
import './style.scss';

// source script
import {MatchMediaScreen} from "@/_index";

// import package info
const packageInfo = require('../package.json');

/**
 * Update HTML
 */
// update title
const title = `${packageInfo.prettyName} v${packageInfo.version}`;
document.title = `[DEV] ${title} - ${packageInfo.description}`;
document.querySelector('[data-title]').innerHTML = title;
document.querySelector('[data-description]').innerHTML = packageInfo.description;

/**
 * Lib usage
 */
console.group(packageInfo.prettyName);

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
    onMatched: data => {
        console.table(data)
        document.querySelector('[data-code]').innerHTML = JSON.stringify(data);
    },
    onUpdate: data => {
        console.log(data)
    }
});