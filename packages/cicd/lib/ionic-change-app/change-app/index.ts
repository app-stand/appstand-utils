import {existsSync, readFileSync, writeFileSync, renameSync} from 'fs'
import fsExtra from 'fs-extra'
const {copySync, copy, remove} = fsExtra
import {dirname} from 'path'
import {
  getAppLocalConfig,
  start,
  cicdDir,
  appPath,
  templatesPath,
  getOldAppLocalConfig,
  getConfig,
  handleError,
} from '../_helpers/helpers'
// import {generateImages} from 'pwa-asset-generator'
import replaceStringsXml from './file-replacers/stringsXml'
import replaceAndroidSplashStylesXml from './file-replacers/replaceAndroidSplashStylesXml'
import replaceColorsXml from './file-replacers/replaceColorsXml'
import replaceIndexHtml from './file-replacers/indexHtml'
import {runPackageBin} from '../../utils/run-package-bin'
import {replaceInfoPlist} from './file-replacers/replaceInfoPlist'
import {resetAndroidStudioCaches} from './clear-cache/reset-android-caches'

interface ReplacementObj {
  old: string
  new: string
}

// ******************************************************************
// ***************************** MAIN *******************************
// ******************************************************************

export default async function main(appId: string, skipCapacitator: boolean) {
  const config = await getConfig()
  const appLocalConfig = await getAppLocalConfig(appId)
  const oldappLocalConfig = await getOldAppLocalConfig()

  if (appLocalConfig.identifier === oldappLocalConfig?.identifier) {
    console.info('ℹ️', `App doesn't need to be changed, skip.`)
    return
  }

  const appSpecificFolder = `${cicdDir}/apps/${appId}`

  // Remove Dyn Public folders first if exists
  const dynPublicFolder = `${appPath}/public/dyn`
  const dynAssetsFolder = `${appPath}/src/assets/dyn`
  await remove(dynPublicFolder).catch(() => {})
  await remove(dynAssetsFolder).catch(() => {})

  const elementsToMove = [
    // IOS Firebase File: GoogleService-Info.plist
    {
      srcPath: `${appSpecificFolder}/GoogleService-Info.plist`,
      destPath: `${appPath}/ios/App/App/GoogleService-Info.plist`,
    },
    // Android Firebase File: GoogleService-Info.plist
    {
      srcPath: `${appSpecificFolder}/google-services.json`,
      destPath: `${appPath}/android/app/google-services.json`,
    },
    // Public Folder
    {
      srcPath: `${appSpecificFolder}/public`,
      destPath: dynPublicFolder,
    },
    // Assets Folder
    {
      srcPath: `${appSpecificFolder}/assets`,
      destPath: dynAssetsFolder,
    },
  ]

  start('changeApp')

  try {
    start('changeRobots')
    changeRobots()
  } catch (e) {
    handleError('changeRobots', e)
  }

  try {
    start('copySync')
    for (const {srcPath, destPath} of elementsToMove) {
      copySync(srcPath, destPath)
    }
  } catch (e) {
    handleError('copySync', e)
  }

  if (config.changeSitemap) {
    try {
      start('changeSitemapXml')
      changeSitemapXml()
    } catch (e) {
      handleError('changeSitemapXml', e)
    }
  }

  try {
    start('replaceIndexHtml')
    replaceIndexHtml(appLocalConfig)
  } catch (e) {
    handleError('replaceIndexHtml', e)
  }

  if (skipCapacitator) {
    console.info('🔶', `Skipping capacitator asset generation...`)
  } else {
    try {
      start('replaceStringsXml')
      replaceStringsXml(appLocalConfig)
    } catch (e) {
      handleError('replaceStringsXml', e)
    }

    try {
      start('replaceAndroidSplashStylesXml')
      replaceAndroidSplashStylesXml(appLocalConfig)
    } catch (e) {
      handleError('replaceAndroidSplashStylesXml', e)
    }

    try {
      start('replaceColorsXml')
      replaceColorsXml(appLocalConfig)
    } catch (e) {
      handleError('replaceColorsXml', e)
    }

    try {
      start('changeInfoPlist')
      replaceInfoPlist(appLocalConfig)
    } catch (e) {
      handleError('changeInfoPlist', e)
    }

    try {
      start('changeInfoDevPlist')
      replaceInfoPlist(appLocalConfig, true)
    } catch (e) {
      handleError('changeInfoDevPlist', e)
    }

    try {
      start('renameAndroidPackageFolder')
      renameAndroidPackageFolder()
    } catch (e) {
      handleError('renameAndroidPackageFolder', e)
    }

    try {
      start('changeIdentifier')
      changeIdentifier()
    } catch (e) {
      handleError('changeIdentifier', e)
    }

    try {
      start('createMobileIcons')
      await createMobileIcons()
    } catch (e) {
      handleError('createMobileIcons', e)
    }
  }

  // if (skipPwa) {
  //   console.info('🔶', `Skipping pwa asset generation...`)
  // } else {
  //   try {
  //     start('createPWAIcons')
  //     await createPWAIcons()
  //   } catch (e) {
  //     handleError('createPWAIcons', e)
  //   }
  // }

  // try {
  //   start('resetAndroidStudioCaches')
  //   await resetAndroidStudioCaches()
  // } catch (e) {
  //   handleError('resetAndroidStudioCaches', e)
  // }

  console.info('✅', `Changed app to ${appId}`)

  // ******************************************************************
  // ************************** FUNCTIONS *****************************
  // ******************************************************************

  function _replaceContent(srcPath: string, replacements: ReplacementObj[]) {
    let templateFile = readFileSync(srcPath, {encoding: 'utf8'})
    for (const replacement of replacements) {
      templateFile = templateFile.replaceAll(replacement.old, replacement.new)
    }
    return templateFile
  }

  function changeRobots() {
    // packages/app/public/robots.txt
    const replacements = [
      {
        old: '{{appUrl}}',
        new: appLocalConfig.url.full ?? 'localhost',
      },
    ]
    const parsedFile = _replaceContent(
      `${templatesPath}/robots.txt`,
      replacements
    )
    const destPath = `${appPath}/public/robots.txt`
    writeFileSync(destPath, parsedFile)
  }

  function changeSitemapXml() {
    if (!appLocalConfig.url.full) {
      throw 'Cannot change sitemal, full url not provided.'
    }
    // packages/app/public/sitemap.xml
    const replacements = [
      {
        old: '{{appUrlFull}}',
        new: appLocalConfig.url.full,
      },
      {
        old: '{{lastmod}}',
        new: new Date().toISOString(),
      },
    ]
    const parsedFile = _replaceContent(
      `${templatesPath}/sitemap.xml`,
      replacements
    )
    const destPath = `${appPath}/public/sitemap.xml`
    writeFileSync(destPath, parsedFile)
  }

  function changeIdentifier() {
    if (!oldappLocalConfig)
      throw 'No oldAppConfig found, changeIdentifier not possible!'
    const androidPath = appLocalConfig.identifier.replaceAll('.', '/')
    const filePaths = [
      `${appPath}/ios/App/App.xcodeproj/project.pbxproj`,
      `${appPath}/android/app/src/main/java/${androidPath}/MainActivity.java`,
      `${appPath}/android/app/src/main/java/${androidPath}/MainActivity.kt`,
      `${appPath}/android/app/src/main/AndroidManifest.xml`,
      `${appPath}/android/app/build.gradle.kts`,
    ]

    const replacements = [
      {
        old: oldappLocalConfig.identifier,
        new: appLocalConfig.identifier,
      },
    ]
    for (const filePath of filePaths) {
      if (!existsSync(filePath)) {
        console.info('⚠️', `File not found, skipping: ${filePath}`)
        continue
      }
      const parsedFile = _replaceContent(filePath, replacements)
      writeFileSync(filePath, parsedFile)
    }
  }

  function renameAndroidPackageFolder() {
    if (!oldappLocalConfig)
      throw 'No oldAppConfig found, renameAndroidPackageFolder not possible!'
    const oldAndroidPath = oldappLocalConfig.identifier.replaceAll('.', '/')
    const newAndroidPath = appLocalConfig.identifier.replaceAll('.', '/')

    const srcPath = `${appPath}/android/app/src/main/java/${oldAndroidPath}`
    const destPath = `${appPath}/android/app/src/main/java/${newAndroidPath}`

    if (srcPath === destPath) return

    if (existsSync(srcPath)) {
      fsExtra.ensureDirSync(dirname(destPath))
      fsExtra.moveSync(srcPath, destPath, {overwrite: true})
      return
    }

    // Fallback to legacy 3-part identifier rename (kept for backwards compatibility)
    const appIdArray = appLocalConfig.identifier.split('.')
    const oldAppIdArray = oldappLocalConfig.identifier.split('.')
    const basePath = `${appPath}/android/app/src/main/java/${appIdArray[0]}/${appIdArray[1]}`
    const oldPath = `${basePath}/${oldAppIdArray[2]}`
    const newPath = `${basePath}/${appIdArray[2]}`
    if (existsSync(oldPath)) renameSync(oldPath, newPath)
  }

  async function createMobileIcons() {
    console.info('ℹ️ Creating Capacitor assets…')

    const tmpResourcesAbs = `${appPath}/resources`
    await copy(`${appSpecificFolder}/resources`, tmpResourcesAbs)

    const iconBg = appLocalConfig.pwa.icon.backgroundColor
    const splashBg = appLocalConfig.capacitor.splashscreen.backgroundColor

    const args = [
      'generate',
      '--ios',
      '--android',
      '--assetPath',
      'resources',
      '--iconBackgroundColor',
      iconBg,
      '--iconBackgroundColorDark',
      iconBg,
      '--splashBackgroundColor',
      splashBg,
      '--splashBackgroundColorDark',
      splashBg,
      // Optional (only if present; still keep relative):
      // '--iosProject', 'ios/App',
      // '--androidProject', 'android',
    ]

    try {
      await runPackageBin('@capacitor/assets', {args, cwd: appPath})
    } finally {
      await remove(tmpResourcesAbs).catch(() => {})
    }
  }

  // async function createPWAIcons() {
  //   console.info('ℹ️', `Creating pwa icons...`)

  //   const sourceIconPath = `${appSpecificFolder}/resources/icon.png`
  //   const destinationPath = `${appPath}/public/dyn/img/pwa`

  //   try {
  //     await generateImages(sourceIconPath, destinationPath, {
  //       background: appLocalConfig.pwa.icon.backgroundColor,
  //       padding: '0px',
  //       manifest: undefined,
  //       index: `${appPath}/index.html`,
  //       pathOverride: 'dyn/img/pwa',
  //     })
  //   } catch (e) {
  //     console.error(e)
  //   }
  // }
}
