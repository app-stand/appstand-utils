import {readFileSync, writeFileSync, renameSync} from 'fs'
import fsExtra from 'fs-extra'
import {asyncExec} from '..'
const {copySync} = fsExtra
import {
  getAppLocalConfig,
  start,
  cicdDir,
  appPath,
  templatesPath,
  getOldAppLocalConfig,
} from './helpers'

interface ReplacementObj {
  [key: string]: string
}

// ******************************************************************
// ***************************** MAIN *******************************
// ******************************************************************

export default async function main(appId: string) {
  const appLocalConfig = await getAppLocalConfig(appId)
  const oldappLocalConfig = await getOldAppLocalConfig()

  if (oldappLocalConfig && appLocalConfig.id === oldappLocalConfig.id) {
    console.info('ℹ️', `App doesn't need to be changed, skipped.`)
    return
  }

  if (!oldappLocalConfig) {
    console.info(
      'ℹ️',
      `No old app config found, not changing any existing files.`
    )
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
    changeCapacitorConfig()
    for (const {srcPath, destPath} of elementsToMove) {
      copySync(srcPath, destPath)
    }
    changeRobots()
    changeSitemapXml()
    changeIndexHtml()
    changeInfoPlist()
    renameAndroidPackageFolder()
    changeIdentifier()
    await createIcons()
  } catch (e) {
    console.error('❌', e)
    return
  }
  console.info('✅', `Successfully changed app to ${appId}`)

  // ******************************************************************
  // ************************** FUNCTIONS *****************************
  // ******************************************************************

  function changeCapacitorConfig() {
    // capacitor.config.json
    const srcPath = `${templatesPath}/capacitor.config.json`
    const destPath = `${appPath}/capacitor.config.json`
    const capacitatorFile = readFileSync(srcPath)
    let capacitatorFileContent = JSON.parse(capacitatorFile.toString())
    capacitatorFileContent.appId = appLocalConfig.appId
    capacitatorFileContent.appName = appLocalConfig.appName
    writeFileSync(destPath, JSON.stringify(capacitatorFileContent))
  }

  function _replaceContent(srcPath: string, replacements: ReplacementObj) {
    let templateFile = readFileSync(srcPath, {encoding: 'utf8'})
    for (const [key, value] of Object.entries(replacements)) {
      templateFile = templateFile.replaceAll(key, value)
    }
    return templateFile
  }

  function changeRobots() {
    // packages/app/public/robots.txt
    const replacements = {
      '{{appId}}': appLocalConfig.id,
    }
    const parsedFile = _replaceContent(
      `${templatesPath}/robots.txt`,
      replacements
    )
    const destPath = `${appPath}/public/robots.txt`
    writeFileSync(destPath, parsedFile)
  }

  function changeIndexHtml() {
    //packages/app/index.html
    const replacements = {
      '{{appName}}': appLocalConfig.appName,
      '{{htmlTitle}}': appLocalConfig.htmlTitle,
    }
    const parsedFile = _replaceContent(
      `${templatesPath}/index.html`,
      replacements
    )
    const destPath = `${appPath}/index.html`
    writeFileSync(destPath, parsedFile)
  }

  function changeInfoPlist() {
    // packages/app/ios/App/App/Info.plist
    const replacements = {
      '{{appName}}': appLocalConfig.appName,
    }
    const parsedFile = _replaceContent(
      `${templatesPath}/Info.plist`,
      replacements
    )
    const destPath = `${appPath}/ios/App/App/Info.plist`
    writeFileSync(destPath, parsedFile)
  }

  function changeSitemapXml() {
    // packages/app/public/sitemap.xml
    const replacements = {
      '{{appId}}': appLocalConfig.id,
      '{{lastmod}}': new Date().toISOString(),
    }
    const parsedFile = _replaceContent(
      `${templatesPath}/sitemap.xml`,
      replacements
    )
    const destPath = `${appPath}/public/sitemap.xml`
    writeFileSync(destPath, parsedFile)
  }

  function changeIdentifier() {
    if (!oldappLocalConfig) return
    const androidPath = appLocalConfig.appId.replaceAll('.', '/')
    const filePaths = [
      `${appPath}/ios/App/App.xcodeproj/project.pbxproj`,
      `${appPath}/android/app/src/main/res/values/strings.xml`,
      `${appPath}/android/app/src/main/java/${androidPath}/MainActivity.java`,
      `${appPath}/android/app/src/main/AndroidManifest.xml`,
      `${appPath}/android/app/build.gradle`,
    ]

    const androidAppLabel = appLocalConfig.appName.replace(
      'Buddy',
      '&#8203;Buddy'
    )
    const replacements = {
      [oldappLocalConfig.appId]: appLocalConfig.appId,
      [oldappLocalConfig.appName]: androidAppLabel, // strings.xml
    }
    for (const filePath of filePaths) {
      const parsedFile = _replaceContent(filePath, replacements)
      writeFileSync(filePath, parsedFile)
    }
  }

  function renameAndroidPackageFolder() {
    if (!oldappLocalConfig) return
    const appIdArray = appLocalConfig.appId.split('.')
    const oldAppIdArray = oldappLocalConfig.appId.split('.')

    const basePath = `${appPath}/android/app/src/main/java/${appIdArray[0]}/${appIdArray[1]}`

    const oldPath = `${basePath}/${oldAppIdArray[2]}`
    const newPat = `${basePath}/${appIdArray[2]}`
    renameSync(oldPath, newPat)
  }

  async function createIcons() {
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
}
