### Prerequisites

You need to have a monorepo structured like this:

```yml
- packages
  - app # (<-- Ionic v6 app)
  - cicd
    - apps
      - {appId}
        - assets # Gets copied to /assets/dyn folder.
          - appLocalConfig.json
        - public # Gets copied to /public/dyn folder.
          - img
          - ...
        - resources # Used to create Icon & Splash Screen
        - google-services.json
        - GoogleService-Info.plist
```

Add the following to GitIgnore:

```
# APPSTAND: Due to Multitenancy
**/app/src/appLocalConfig/**
**/ios/App/App/capacitor.config.json
**/android/app/src/main/assets/capacitor.config.json
**/ios/App/App/GoogleService-Info.plist
**/ios/App/App/Info.plist
**/android/app/google-services.json
**/app/public/robots.txt
**/app/public/sitemap.xml
**/app/public/index.html
**/app/public/dyn
**/app/src/assets/dyn
```

### Usage

Run the following command in your CICD folder:

```sh
npx i -d @appstand/cicd
```

#### ENV Variables:

| Var            | Possbible Values                                 |
| -------------- | ------------------------------------------------ |
| APP            | AppId as in the {appId} folders                  |
| MODE           | BUILD, SERVE                                     |
| SEMANTIC_INDEX | Either 0,1,2. For Auto-Versioning like so: 0.1.2 |
