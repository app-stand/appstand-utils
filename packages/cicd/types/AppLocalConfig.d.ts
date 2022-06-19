export interface AppLocalConfig {
  id: string
  fbAppId: string
  appId: string
  appName: string
  appNameShort: string
  appUrl: string | null
  storeLinks: {
    android: string
    ios: string
  }

  firebase: {
    apiKey: string
    authDomain: string
    databaseURL?: string
    projectId: string
    storageBucket: string
    messagingSenderId: string
    appId: string
    measurementId?: string
  }
  colors: {
    pwaIconBackground: string
    pwaBackground: string
  }
  cicd: {
    indexHtml: {
      title: string
    }
    ios: {
      infoPlist: {
        cfBundleDisplayName: string
      }
    }
    android: {
      stringsXml: {
        appName: string
        titleActivityMain: string
        packageName: string
        customUrlSheme: string
      }
    }
  }
  appSpecific?: any
}
