# LUDUMDARE 43

![](./static/game_00.png)

## About

### Plot

 You are the leader of a small village in this very hostile world you need to decide if you will pay tribute to the gods or stand on your own against plagues that visit this world every year. Manage your villagers assign them to work so they can gather resources for sacrifices or village development. Or leave them idle so they can multiply and sacrifice them to permanently weaken creatures disturbing this world.

### Examples

You can check this project here: [The greatest sacrifice - ludumdare 43](http://ld43.xesenix.pl)

You can also check [benchmarking subproject](http://ld43.xesenix.pl/benchmarks) where I check efficiency of different approaches to solving encountered optimization problems.

## Project 

### Installation

```
npm i
```

### Running 

```
npm run game:build:prod
npm run game:start
```

### Developing

This project uses `InversifyJS` for dependency injection `React` to provide web interface, and `Phaser` as sound and asset management. I treat it as proof of concept that all those technologies can be connected via dependency injection.

Everything is builded via `Webpack` with some default setup provided from `xes-webpack-core`. This project helps me to figure out what default configuration should be provided by `xes-webpack-core`.

Potentially reusable parts are places under `src` folder. Game specific files are placed under `game` folder. As this is work in progress files and their location will change drastically.

#### Serving

```
npm run game:serve
```
or
```
npm run game:serve:https
```

### Translations I18N

#### Extracting

For extracting translation string into `pot` files run:
```
npm run game:xi18n
```
Then under `game/locales/messages.pot` you can fin newly extracted segments you can use them to update already translated segments in `game/locales/messages.#lang#.po` or add new translations.

#### Adding new translations

__TODO: create single source of true for language configuration__

`src/lib/interfaces.ts` add new locale string to `LanguageType`.
Then update locale selection components.

### Developing benchmarks

![](./static/benchmarks_00.png)

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

### Developing service workers

Links:

* easy way to add service worker caching with [workbox](https://developers.google.com/web/tools/workbox/) actually used in this project
* article about [service worker](https://css-tricks.com/serviceworker-for-offline/) on CSS Tricks
* for generating ssl certificates research [mkcert](https://github.com/FiloSottile/mkcert)

### Usefull links

* [react typescript cheetsheet](https://www.saltycrane.com/typescript-react-cheat-sheet/latest/)

* [analyze module code duplication](https://formidable.com/blog/2018/finding-webpack-duplicates-with-inspectpack-plugin/)

### Game development

* [MDN web docs - game development](https://developer.mozilla.org/en-US/docs/Games)

### Caveats

* Why I don't use `Function.bind` and instead use instance functions when it supposed to be more optimized? [`this` in Typescript](https://github.com/Microsoft/TypeScript/wiki/'this'-in-TypeScript)

### TODO:

* [Large-Allocation header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Large-Allocation)
* connect react router history to redux store
* separate audio from phaser or init phaser in compact mode
* add about view
* work on phaser states
* analytics with [gtag](https://developers.google.com/analytics/devguides/collection/gtagjs/migration) vs [google tag manager](https://support.google.com/tagmanager/answer/6107124)
* research [open id](https://openid.net/connect/)

# Material-ui
Cant update to v4.2.0 it is breaking after clicking some buttons or switching theme
