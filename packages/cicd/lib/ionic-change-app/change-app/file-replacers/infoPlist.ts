import {AppLocalConfig} from 'types'
import {readFileSync, writeFileSync} from 'fs'
import {appPath} from '../../_helpers/helpers'
import replaceBetween from './helpers/replaceBetween'

export default (appLocalConfig: AppLocalConfig) => {
  const filePath = `${appPath}/ios/App/App/Info.plist`
  let fileContent = readFileSync(filePath, {encoding: 'utf8'})
  const infoPlistConfig = appLocalConfig.ios.infoPlist

  fileContent = replaceBetween(
    fileContent,
    `<key>CFBundleDisplayName</key>
  <string>`,
    '</string>',
    infoPlistConfig.cfBundleDisplayName
  )

  if (infoPlistConfig.cfBundleURLSchemes) {
    fileContent = replaceBetween(
      fileContent,
      '<key>CFBundleURLSchemes</key>\n\t\t<array>',
      '\n\t\t</array>',
      infoPlistConfig.cfBundleURLSchemes
        .map((scheme) => `\n\t\t\t<string>${scheme}</string>`)
        .join('') + '\n'
    )
  }

  if (infoPlistConfig.facebookAppId) {
    fileContent = replaceBetween(
      fileContent,
      '<key>FacebookAppID</key>',
      '</string>',
      infoPlistConfig.facebookAppId
    )
  }

  if (infoPlistConfig.facebookClientToken) {
    fileContent = replaceBetween(
      fileContent,
      '<key>FacebookClientToken</key>',
      '</string>',
      infoPlistConfig.facebookClientToken
    )
  }

  if (infoPlistConfig.facebookDisplayName) {
    fileContent = replaceBetween(
      fileContent,
      '<key>FacebookDisplayName</key>',
      '</string>',
      infoPlistConfig.facebookDisplayName
    )
  }

  writeFileSync(filePath, fileContent)
}
