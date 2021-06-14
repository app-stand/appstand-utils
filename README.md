# vue3-appstore-badges

> Only works when using Vue compiler.

## Setup AppStore Repo

1. Copy+Paste the .npmrc file from this repo
2. Set the ENV Variable `NPM_TOKEN` to the read-repo auth token
   ```
   export NPM_TOKEN="XXX"
   ```
   or login for good:
   ```
   npm config set //npm.pkg.github.com/:_authToken=XXX
   ```
   or in CICD:
   ```
   npm config set '//npm.pkg.github.com/:_authToken' "${NPM_TOKEN}"
   ```

## Install

```sh
yarn add @app-stand/vue3-appstore-badges
```

## Example usage

```html
<AppStoreBadge
  website="www.test.com"
  android="/playstorelink"
  ios="/appstorelink"
/>
```
