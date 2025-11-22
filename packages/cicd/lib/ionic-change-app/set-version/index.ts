import {readFileSync, writeFileSync} from 'fs'
import {SemanticIndex} from 'types'
import {packagesDir, start} from '../_helpers/helpers'

const ionicDir = `${packagesDir}/app`
const buildGradlePath = `${ionicDir}/android/app/build.gradle.kts`
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
  writeNewVersionToPackageJsons(nextVersion, nextBuild) // iOS
  console.info(
    '✅',
    `Successfully set version to ${nextVersion} (Build: ${nextBuild}).`
  )
}

// ******************************************************************
// ************************** FUNCTIONS *****************************
// ******************************************************************
function getNextBuild(gradleFile: string) {
  // Get Current Build using regex
  const versionCodeMatch = gradleFile.match(/versionCode\s*=\s*(\d+)/)
  if (!versionCodeMatch) {
    throw new Error('Could not find versionCode in gradle file')
  }
  const currentBuild = parseInt(versionCodeMatch[1])
  return currentBuild + 1
}

function getNextVersion(gradleFile: string, semanticIndex: SemanticIndex) {
  // Get Current Version using regex
  const versionNameMatch = gradleFile.match(/versionName\s*=\s*"([^"]+)"/)
  if (!versionNameMatch) {
    throw new Error('Could not find versionName in gradle file')
  }
  const currentVersion = versionNameMatch[1]

  if (semanticIndex === '99') {
    return currentVersion
  }

  const currentVersionArray = currentVersion.split('.')

  if (currentVersionArray.length === 2) {
    currentVersionArray.push('0')
  }
  if (currentVersionArray.length === 1) {
    currentVersionArray.push('0', '0')
  }

  switch (semanticIndex) {
    case '2':
      break
    case '1':
      currentVersionArray[2] = '0'
      break
    case '0':
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

  const newText = `versionCode = ${build}
        versionName = "${version}"
        testInstrumentationRunner`

  const gradleFileNew = gradleFile.replace(regex, newText)
  writeFileSync(buildGradlePath, gradleFileNew)
}

function writeNewVersionToPbxprojPath(version: string, build: number) {
  let pbxprojFile = readFileSync(pbxprojPath, 'utf8')
  const regex1 = /CURRENT_PROJECT_VERSION[\s\S]*?;/g
  const regex2 = /MARKETING_VERSION[\s\S]*?;/g

  const newText1 = `CURRENT_PROJECT_VERSION = ${build};`
  pbxprojFile = pbxprojFile.replace(regex1, newText1)
  const newText2 = `MARKETING_VERSION = ${version};`
  pbxprojFile = pbxprojFile.replace(regex2, newText2)

  writeFileSync(pbxprojPath, pbxprojFile)
}

function writeNewVersionToPackageJsons(version: string, build: number) {
  let packageJsonFile = readFileSync(packageJsonPath, 'utf8')
  const packageJson = JSON.parse(packageJsonFile)
  packageJson.version = `${version} (${build})`
  writeFileSync(packageJsonPath, JSON.stringify(packageJson))
}

export {main as setVersion}
