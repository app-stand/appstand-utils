import {readFileSync, writeFileSync, renameSync} from 'fs'
import fsExtra from 'fs-extra'
const {copySync} = fsExtra
import {getAppConfig, packagesDir, start, cicdDir} from './helpers'
import {asyncExec} from './../asyncExec'

interface ReplacementObj {
  [key: string]: string
}

const appId = process.env.APP
// PATH:
const appPath = `${packagesDir}/app`
// CICD
const templatesPath = `${cicdDir}/_templates`
const appSpecificFolder = `${cicdDir}/apps/${appId}`
const appSpecificConfigPath = `${appSpecificFolder}/appConfig`

// ******************************************************************
// ***************************** MAIN *******************************
// ******************************************************************

const elementsToMove = [
  // Enitre appConfig folder
  {
    srcPath: appSpecificConfigPath,
    destPath: `${appPath}/src/appConfig`,
  },
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
  // Favicon & Logos
  {
    srcPath: `${appSpecificFolder}/img/logo.svg`,
    destPath: `${appPath}/src/assets/img/logo.svg`,
  },
  {
    srcPath: `${appSpecificFolder}/img/favicon.png`,
    destPath: `${appPath}/public/assets/img/favicon.png`,
  },
  {
    srcPath: `${appSpecificFolder}/img/logo.svg`,
    destPath: `${appPath}/public/assets/img/logo.svg`,
  },
]

export default async function main(appId: string) {
  const appConfig = await getAppConfig(appId)

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
    capacitatorFileContent.appId = appConfig.appId
    capacitatorFileContent.appName = appConfig.appName
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
      '{{appId}}': appConfig.id,
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
      '{{appName}}': appConfig.appName,
      '{{htmlTitle}}': appConfig.htmlTitle,
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
      '{{appName}}': appConfig.appName,
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
      '{{appId}}': appConfig.id,
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
    const androidPath = appConfig.appId.replaceAll('.', '/')
    const filePaths = [
      `${appPath}/ios/App/App.xcodeproj/project.pbxproj`,
      `${appPath}/android/app/src/main/res/values/strings.xml`,
      `${appPath}/android/app/src/main/java/${androidPath}/MainActivity.java`,
      `${appPath}/android/app/src/main/AndroidManifest.xml`,
      `${appPath}/android/app/build.gradle`,
    ]
    // TODO
    const androidAppLabel = appConfig.appName.replace('Buddy', '&#8203;Buddy')
    const replacements = {
      'io.gymplify.main': appConfig.appId,
      'io.gymplify.thebar': appConfig.appId,
      TheBarApp: androidAppLabel, // strings.xml
      Gymplify: androidAppLabel, // strings.xml
    }
    for (const filePath of filePaths) {
      const parsedFile = _replaceContent(filePath, replacements)
      writeFileSync(filePath, parsedFile)
    }
  }

  function renameAndroidPackageFolder() {
    const appIdArray = appConfig.appId.split('.')
    const possibleOldAppIds = ['thebar', 'main'] // same as io.gymplify.xx ID
    const basePath = `${appPath}/android/app/src/main/java/${appIdArray[0]}/${appIdArray[1]}`

    for (const oldName of possibleOldAppIds) {
      try {
        const oldPath = `${basePath}/${oldName}`
        const newPat = `${basePath}/${appIdArray[2]}`
        renameSync(oldPath, newPat)
      } catch (e) {
        // do nothing
      }
    }
  }

  async function createIcons() {
    try {
      copySync(`${appSpecificFolder}/resources`, `${appPath}/resources`)

      await asyncExec(`cordova-res ios --skip-config --copy`, false)
      await asyncExec(`cordova-res android --skip-config --copy`, false)
      await asyncExec(`rm -rf resources`, false)
    } catch (e) {
      console.error(e)
    }
  }
}