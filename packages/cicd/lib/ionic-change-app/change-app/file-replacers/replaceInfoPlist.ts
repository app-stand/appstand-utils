import {AppLocalConfig} from 'types'
import {readFileSync, writeFileSync} from 'fs'
import {appPath} from '../../_helpers/helpers'
import {replacePlistStringValue} from './helpers/replacePlistStringValue'
import {replacePlistArrayValue} from './helpers/replacePlistArrayValue'

export function replaceInfoPlist(
  appLocalConfig: AppLocalConfig,
  isDevInfoPlist: boolean = false
) {
  const fileName = isDevInfoPlist ? 'Info-Dev.plist' : 'Info.plist'
  const filePath = `${appPath}/ios/App/App/${fileName}`
  let fileContent = readFileSync(filePath, {encoding: 'utf8'})
  const infoPlistConfig = appLocalConfig.ios.infoPlist

  fileContent = replacePlistStringValue(
    fileContent,
    'CFBundleDisplayName',
    infoPlistConfig.cfBundleDisplayName
  )

  if (infoPlistConfig.cfBundleURLSchemes) {
    fileContent = replacePlistArrayValue(
      fileContent,
      'CFBundleURLSchemes',
      infoPlistConfig.cfBundleURLSchemes
    )
  }

  if (infoPlistConfig.facebookAppId) {
    fileContent = replacePlistStringValue(
      fileContent,
      'FacebookAppID',
      infoPlistConfig.facebookAppId
    )
  }

  if (infoPlistConfig.facebookClientToken) {
    fileContent = replacePlistStringValue(
      fileContent,
      'FacebookClientToken',
      infoPlistConfig.facebookClientToken
    )
  }

  if (infoPlistConfig.facebookDisplayName) {
    fileContent = replacePlistStringValue(
      fileContent,
      'FacebookDisplayName',
      infoPlistConfig.facebookDisplayName
    )
  }

  writeFileSync(filePath, fileContent)
}
