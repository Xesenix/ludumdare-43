# LUDUMDARE 43

[![The greatest sacrifice - ludumdare 43](./static/game_00.png)](http://ld43.xesenix.pl)

## 1. About

### 1.1 Game Plot

 You are the leader of a small village in this very hostile world you need to decide if you will pay tribute to the gods or stand on your own against plagues that visit this world every year. Manage your villagers assign them to work so they can gather resources for sacrifices or village development. Or leave them idle so they can multiply and sacrifice them to permanently weaken creatures disturbing this world.

### 1.2 Examples

You can check this project here: [The greatest sacrifice - ludumdare 43](http://ld43.xesenix.pl)

You can also check [benchmarking subproject](http://ld43.xesenix.pl/benchmarks) where I check efficiency of different approaches to solving encountered optimization problems.

## 2. Project

### 2.1 Installation

```
npm i
```

### 2.2 Running 

```
npm run game:build:prod
npm run game:start
```

### 2.3 Developing

This project uses `InversifyJS` for dependency injection `React` to provide web interface, and `Phaser` as sound and asset management. I treat it as proof of concept that all those technologies can be connected via dependency injection.

Everything is builded via `Webpack` with some default setup provided from `xes-webpack-core`. This project helps me to figure out what default configuration should be provided by `xes-webpack-core`.

Potentially reusable parts are places under `src` folder. Game specific files are placed under `game` folder. As this is work in progress files and their location will change drastically.

#### 2.3.1 Serving

```
npm run game:serve
```
or
```
npm run game:serve:https
```

### 2.4 Translations I18N

#### 2.4.1 Extracting

For extracting translation string into `pot` files run:
```
npm run game:xi18n
```
Then under `game/locales/messages.pot` you can fin newly extracted segments you can use them to update already translated segments in `game/locales/messages.#lang#.po` or add new translations.

#### 2.4.2 Adding new translations

__TODO: create single source of true for language configuration__

`src/lib/interfaces.ts` add new locale string to `LanguageType`.
Then update locale selection components.


### 2.5 Developing benchmarks

[![Project benchmarking](./static/benchmarks_00.png)](http://ld43.xesenix.pl/benchmarks)

You can check benchmarks code in `benchmarks` folder.
To run in development mode:
```
npm run benchmarks:serve
```
To build for production:
```
npm run benchmarks:build:prod
npm run benchmarks:start
```

## 3. Useful Tips

### 3.1 Usefull links

* [react typescript cheetsheet](https://www.saltycrane.com/typescript-react-cheat-sheet/latest/)

* [analyze module code duplication](https://formidable.com/blog/2018/finding-webpack-duplicates-with-inspectpack-plugin/)

### 3.2 Game development

* [MDN web docs - game development](https://developer.mozilla.org/en-US/docs/Games)

### 3.3 Webpack
If we need to handle some vendors libraries that do not work well with standard webpack module exports and imports we have few options to choose from:
* if you want to export some variable from vendor library with webpack use inlined `export-loader`
* if you want to import some dependency into vendor library with webpack use inlined `import-loader`
* if you want to expose to global scope some variable in vendor library with webpack use inlined `expose-loader`

### 3.4 Developing service workers

Links:

* easy way to add service worker caching with [workbox](https://developers.google.com/web/tools/workbox/) actually used in this project
* article about [service worker](https://css-tricks.com/serviceworker-for-offline/) on CSS Tricks
* for generating ssl certificates research [mkcert](https://github.com/FiloSottile/mkcert)

### 3.5 Handling download progress

To be able to visualize progress of downloading modules splitted by weback I needed to use `ChunkProgressWebpackPlugin` it converts request for lazy loaded modules into XHR request. Unfortunately it didn't handle correctly progress of downloading gziped content. In general in chrome when downloading gziped content we get `lengthComputable === false` so we need to send additional header info with uncompressed data size [as suggested in stackoverflow](https://stackoverflow.com/questions/15097712/how-can-i-use-deflated-gzipped-content-with-an-xhr-onprogress-function/32799706#32799706).

This solution requires to create own server that can add those additional data or not show precentage progress of downloading if this additional data is not available.

### 3.6 Playfab



### 3.7 Caveats

* Why I don't use `Function.bind` and instead use instance functions when it supposed to be more optimized? [`this` in Typescript](https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript#functionbind)

## 4. TODO:

- [x] Data Storage Redux
- [x] Dependency Injection Modules with InversifyJS
- [x] Theming - ability to choose layout styles from some predefined set of themes
- [x] Audio manager - module for handling playing music and sounds
- [x] Preloader - reduce initial download size to what is only needed to display loader
- [x] I18n - add ability to translate application UI extracting translation segments to be translated with Poedit and switch language dynamically by application user
- [x] Fullscreen - handle switching to full screen view
- [x] ServiceWorker - cache application for running offline
- [x] Configuration view component handling configuration of audio and theming
- [ ] [Large-Allocation header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Large-Allocation)
- [ ] connect react router history to redux store
- [x] separate audio from phaser or init phaser in compact mode
- [ ] add about view
- [ ] work on phaser states
- [ ] analytics with [gtag](https://developers.google.com/analytics/devguides/collection/gtagjs/migration) vs [google tag manager](https://support.google.com/tagmanager/answer/6107124)
- [ ] research [open id](https://openid.net/connect/)
- [ ] connect playfab
- [x] use immer
- [ ] [web monetization](https://webmonetization.org/)
