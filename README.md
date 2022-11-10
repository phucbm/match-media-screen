# Match Media Screen

[![release](https://badgen.net/github/release/phucbm/match-media-screen/)](https://github.com/phucbm/match-media-screen/releases/latest)
[![minified](https://badgen.net/badge/minified/3KB/cyan)](https://www.jsdelivr.com/package/gh/phucbm/match-media-screen)
[![jsdelivr](https://data.jsdelivr.com/v1/package/gh/phucbm/match-media-screen/badge?style=rounded)](https://www.jsdelivr.com/package/gh/phucbm/match-media-screen)
[![license](https://badgen.net/github/license/phucbm/match-media-screen/)](https://github.com/phucbm/match-media-screen/blob/main/LICENSE)
[![Netlify Status](https://api.netlify.com/api/v1/badges/1cc036c8-c6d1-4404-adbd-52182abbdd78/deploy-status)](https://app.netlify.com/sites/match-media-screen/deploys)

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