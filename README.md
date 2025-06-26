# Match Media Screen

[![npm version](https://badgen.net/npm/v/match-media-screen?icon=npm)](https://www.npmjs.com/package/match-media-screen)
[![npm downloads](https://badgen.net/npm/dm/match-media-screen?icon=npm)](https://www.npmjs.com/package/match-media-screen)
[![npm dependents](https://badgen.net/npm/dependents/match-media-screen?icon=npm)](https://www.npmjs.com/package/match-media-screen)
[![github stars](https://badgen.net/github/stars/phucbm/match-media-screen?icon=github)](https://github.com/phucbm/match-media-screen/)
[![jsdelivr hits](https://badgen.net/jsdelivr/hits/gh/phucbm/match-media-screen?icon=jsdelivr)](https://www.jsdelivr.com/package/gh/phucbm/match-media-screen)
[![jsdelivr npm rank](https://badgen.net/jsdelivr/rank/npm/match-media-screen?icon=npm)](https://www.npmjs.com/package/match-media-screen)
[![github license](https://badgen.net/github/license/phucbm/match-media-screen?icon=github)](https://github.com/phucbm/match-media-screen/blob/main/LICENSE)
[![Made in Vietnam](https://raw.githubusercontent.com/webuild-community/badge/master/svg/made.svg)](https://webuild.community)

> Observe window.resize and fire corresponding events with given object data.

## Installation

### NPM Package

Install NPM package

```shell
npm i match-media-screen
```

Import

```js
import {MatchMediaScreen} from "match-media-screen";
```

### Download

👉 Self hosted - [Download the latest release](https://github.com/phucbm/match-media-screen/releases/latest)

```html

<script src="./match-media-screen.min.js"></script>
```

👉 CDN Hosted - [jsDelivr](https://www.jsdelivr.com/package/gh/phucbm/match-media-screen)

```html

<script src="https://cdn.jsdelivr.net/gh/phucbm/match-media-screen/dist/match-media-screen.min.js"></script>
```

## Usage

Demo: https://match-media-screen.netlify.app

```js
new MatchMediaScreen({
    object: {
        value: 'desktop',
        responsive: [
            {
                breakpoint: 1024, // same as `@media only screen and (max-width:1024px)`
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
    debounce: 100, // [ms] debounce time on resize event
    // fire everytime a matched breakpoint is found
    onMatched: data => {
        console.table(data)
        document.querySelector('[data-code]').innerHTML = JSON.stringify(data);
    },
    // fire on every resize event with debouce time of 100ms
    onUpdate: data => {
        console.log(data)
    }
});
```

## Deployment

### Dev server

Run dev server

```shell
npm run dev
```

### Generate production files

Generate UMD and module version

```shell
npm run prod
```

### Build sites

Build production site

```shell
npm run build
```

## License

[MIT License](https://github.com/phucbm/match-media-screen/blob/main/LICENSE)

Copyright (c) 2022 Phuc Bui
