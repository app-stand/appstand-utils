import {readFileSync, writeFileSync, renameSync} from 'fs'
import fsExtra from 'fs-extra'
import {asyncExec} from './../../async-exec'
const {copySync} = fsExtra
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
// import pwaAssetGenerator from 'pwa-asset-generator'
import replaceStringsXml from './file-replacers/stringsXml'
import replaceIndexHtml from './file-replacers/indexHtml'

interface ReplacementObj {
  old: string
  new: string
}

// ******************************************************************
// ***************************** MAIN *******************************
// ******************************************************************

export default async function main(
  appId: string,
  skipCapacitator: boolean,
  skipPwa: boolean
) {
  const config = await getConfig()
  const appLocalConfig = await getAppLocalConfig(appId)
  const oldappLocalConfig = await getOldAppLocalConfig()

  if (
    oldappLocalConfig &&
    appLocalConfig.identifier === oldappLocalConfig.identifier
  ) {
    console.info('ℹ️', `App doesn't need to be changed, skipped.`)
    return
  }

  const appSpecificFolder = `${cicdDir}/apps/${appId}`

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
      destPath: `${appPath}/public/dyn`,
    },
    // Assets Folder
    {
      srcPath: `${appSpecificFolder}/assets`,
      destPath: `${appPath}/src/assets/dyn`,
    },
  ]

  start('changeApp')

  try {
    start('changeRobots')
    changeRobots()
  } catch (e) {
    handleError('changeApp', e)
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
    console.info('ℹ️', `Skipping capacitator asset generation...`)
  } else {
    try {
      start('replaceStringsXml')
      replaceStringsXml(appLocalConfig)
    } catch (e) {
      handleError('replaceStringsXml', e)
    }

    try {
      start('changeInfoPlist')
      changeInfoPlist()
    } catch (e) {
      handleError('changeInfoPlist', e)
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

  if (skipPwa) {
    console.info('ℹ️', `Skipping pwa asset generation...`)
  } else {
    try {
      start('createPWAIcons')
      await createPWAIcons()
    } catch (e) {
      handleError('createPWAIcons', e)
    }
  }

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

  function changeInfoPlist() {
    if (!oldappLocalConfig) return
    // packages/app/ios/App/App/Info.plist
    const filePath = `${appPath}/ios/App/App/Info.plist`

    const replacements = [
      {
        old: oldappLocalConfig.ios.infoPlist.cfBundleDisplayName,
        new: appLocalConfig.ios.infoPlist.cfBundleDisplayName,
      },
    ]
    const parsedFile = _replaceContent(filePath, replacements)

    writeFileSync(filePath, parsedFile)
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
      `${appPath}/android/app/src/main/AndroidManifest.xml`,
      `${appPath}/android/app/build.gradle`,
    ]

    const replacements = [
      {
        old: oldappLocalConfig.identifier,
        new: appLocalConfig.identifier,
      },
    ]
    for (const filePath of filePaths) {
      const parsedFile = _replaceContent(filePath, replacements)
      writeFileSync(filePath, parsedFile)
    }
  }

  function renameAndroidPackageFolder() {
    if (!oldappLocalConfig)
      throw 'No oldAppConfig found, renameAndroidPackageFolder not possible!'
    const appIdArray = appLocalConfig.identifier.split('.')
    const oldAppIdArray = oldappLocalConfig.identifier.split('.')

    const basePath = `${appPath}/android/app/src/main/java/${appIdArray[0]}/${appIdArray[1]}`

    const oldPath = `${basePath}/${oldAppIdArray[2]}`
    const newPat = `${basePath}/${appIdArray[2]}`
    renameSync(oldPath, newPat)
  }

  async function createMobileIcons() {
    console.info('ℹ️', `Creating cordova-res icons...`)
    try {
      copySync(`${appSpecificFolder}/resources`, `${appPath}/resources`)

      await asyncExec(
        `cd ${appPath} && cordova-res ios --skip-config --copy`,
        false
      )
      await asyncExec(
        `cd ${appPath} && cordova-res android --skip-config --copy`,
        false
      )
      await asyncExec(`rm -rf ${appPath}/resources`, false)
    } catch (e) {
      console.error(e)
    }
  }

  async function createPWAIcons() {
    console.info('ℹ️', `Creating pwa icons...`)

    const sourceIconPath = `${appSpecificFolder}/resources/icon.png`
    const destinationPath = `${appPath}/public/dyn/img/pwa`

    // -i ${htmlIndexPath} -m ${manifestPath}
    //const htmlIndexPath = `${appPath}/index.html`
    //const manifestPath = `${appPath}/public/manifest.json`

    try {
      await asyncExec(
        `npx pwa-asset-generator -b "${appLocalConfig.pwa.icon.backgroundColor}" --padding "0px" ${sourceIconPath} ${destinationPath}`,
        false
      )
      // TODO: Try to use the imported module instead of npx
      // await pwaAssetGenerator.generateImages(sourceIconPath, destinationPath, {
      //   background: appLocalConfig.backgroundColor,
      // })
    } catch (e) {
      console.error(e)
    }
  }
}
