import {readFileSync, writeFileSync} from 'fs'
import {packagesDir, start} from './helpers'

const ionicDir = `${packagesDir}/app`
const buildGradlePath = `${ionicDir}/android/app/build.gradle`
const pbxprojPath = `${ionicDir}/ios/App/App.xcodeproj/project.pbxproj`
const packageJsonPath = `${ionicDir}/package.json`

// ******************************************************************
// ***************************** MAIN *******************************
// ******************************************************************

function main(semanticIndex: SemanticIndex) {
  start('setVersion')
  const gradleFile = readFileSync(buildGradlePath, 'utf8')
  const nextBuild = getNextBuild(gradleFile)
  const nextVersion = getNextVersion(gradleFile, semanticIndex)
  writeNewVersionToBuildGradle(gradleFile, nextVersion, nextBuild) // Android
  writeNewVersionToPbxprojPath(nextVersion, nextBuild) // iOS
  writeNewVersionToPackageJsons(nextVersion) // iOS
  console.info('✅', `Successfully set version to ${nextVersion}.`)
}

// ******************************************************************
// ************************** FUNCTIONS *****************************
// ******************************************************************
function getNextBuild(gradleFile: string) {
  // Get Current Build
  const i = gradleFile.indexOf('versionCode') + 12
  const currentBuild = gradleFile.substring(i, i + 5).replace(/\s/g, '')
  return parseInt(currentBuild) + 1
}

function getNextVersion(gradleFile: string, semanticIndex: SemanticIndex) {
  // Get Current Build
  const i = gradleFile.indexOf('versionName') + 12
  const currentVersion = gradleFile
    .substring(i, i + 14)
    .replace(/\s/g, '')
    .replaceAll('"', '')
  const currentVersionArray = currentVersion.split('.')

  if (currentVersionArray.length === 2) {
    currentVersionArray.push('0')
  }
  if (currentVersionArray.length === 1) {
    currentVersionArray.push('0', '0')
  }

  switch (semanticIndex) {
    case 2:
      break
    case 1:
      currentVersionArray[2] = '0'
      break
    case 0:
      currentVersionArray[2] = '0'
      currentVersionArray[1] = '0'
      break
    default:
      throw 'Semantic Index needs to be between 0-2!'
  }
  currentVersionArray[semanticIndex] = `${
    parseInt(currentVersionArray[semanticIndex]) + 1
  }`

  return currentVersionArray.join('.')
}

function writeNewVersionToBuildGradle(
  gradleFile: string,
  version: string,
  build: number
) {
  const regex = /versionCode[\s\S]*?testInstrumentationRunner/

  const newText = `versionCode ${build}
        versionName "${version}"
        testInstrumentationRunner`

  const gradleFileNew = gradleFile.replace(regex, newText)
  writeFileSync(buildGradlePath, gradleFileNew)
}

function writeNewVersionToPbxprojPath(version: string, build: number) {
  let pbxprojFile = readFileSync(pbxprojPath, 'utf8')
  const regex1 = /CURRENT_PROJECT_VERSION[\s\S]*?;/g
  const regex2 = /MARKETING_VERSION[\s\S]*?;/g

  const newText1 = `CURRENT_PROJECT_VERSION = ${build};`
  pbxprojFile = pbxprojFile.replaceAll(regex1, newText1)
  const newText2 = `MARKETING_VERSION = ${version};`
  pbxprojFile = pbxprojFile.replaceAll(regex2, newText2)

  writeFileSync(pbxprojPath, pbxprojFile)
}

function writeNewVersionToPackageJsons(version: string) {
  let packageJsonFile = readFileSync(packageJsonPath, 'utf8')
  const packageJson = JSON.parse(packageJsonFile)
  packageJson.version = version
  writeFileSync(packageJsonPath, JSON.stringify(packageJson))
}

export {main as setVersion}
