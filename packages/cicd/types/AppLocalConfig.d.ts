export interface AppLocalConfig {
  name: string // Name of the app, e.g. "MyApp" (short)
  identifier: string // Should be completely unique ID
  firestoreId: string // Unique per abb, but smae for different envs (used for firestore etc.)
  url: {
    small: string | null // without http/www
    full: string | null // with https & www, used e.g. for sitemap, robots
  }
  storeLinks: {
    android: string
    ios: string
  }
  colors: {
    primary: string
  }
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
      facebookAppId?: string
      fbLoginProtocolScheme?: string
      facebookClientToken?: string
    }
    valuesV31Xml: {
      windowSplashScreenBackground: string
    }
  }
  pwa: {
    manifest: {
      name: string
      short_name: string
      description: string
      theme_color: string
      background_color: string
    }
    icon: {
      backgroundColor: string
    }
  }
  capacitor: {
    appId: string
    appName: string
    splashscreen: {
      backgroundColor: string
    }
  }
  firebase: {
    apiKey: string
    authDomain: string
    databaseURL?: string
    projectId: string
    storageBucket: string
    messagingSenderId: string
    appId: string
    measurementId: string
  }
  stripe?: {
    publishableKey: string
  }
  googleMaps?: {
    clientApiKey: string
  }
  settings: {
    isProductive: boolean
    allowMultipleApps: boolean
  }
}
