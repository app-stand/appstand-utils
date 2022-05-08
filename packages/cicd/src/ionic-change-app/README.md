### Prerequisites

You need to have a monorepo structured like this:

```
- packages
  - app # (<-- Ionic v6 app)
  - cicd
    - apps
      - {appId}
        - appConfig
        - img
        - resources
        - google-services.json
        - GoogleService-Info.plist
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
