# LUDUMDARE 43

## About

### Plot

 You are the leader of a small village in this very hostile world you need to decide if you will pay tribute to the gods or stand on your own against plagues that visit this world every year. Manage your villagers assign them to work so they can gather resources for sacrifices or village development. Or leave them idle so they can multiply and sacrifice them to permanently weaken creatures disturbing this world.

## Installation

```
npm i
```

## Running 

```
npm run game:build:prod
npm run game:start
```

## Developing

This project uses `InversifyJS` for dependency injection `React` to provide web interface, and `Phaser` as sound and asset management. I treat it as proof of concept that all those technologies can be connected via dependency injection.

Everything is builded via `Webpack` with some default setup provided from `xes-webpack-core`. This project helps me to figure out what default configuration should be provided by `xes-webpack-core`.

Potentially reusable parts are places under `src` folder. Game specific files are placed under `game` folder. As this is work in progress files and their location will change drastically.

### Serving

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

### Developing service workers

Links:

* easy way to add service worker caching with [workbox](https://developers.google.com/web/tools/workbox/) actually used in this project
* article about [service worker](https://css-tricks.com/serviceworker-for-offline/) on CSS Tricks
* for generating ssl certificates research [mkcert](https://github.com/FiloSottile/mkcert)


### Game development

* [MDN web docs - game development](https://developer.mozilla.org/en-US/docs/Games)

### TODO:

* [Large-Allocation header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Large-Allocation)
