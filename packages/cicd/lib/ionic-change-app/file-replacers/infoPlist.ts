import {AppLocalConfig} from 'types'
import {readFileSync, writeFileSync} from 'fs-extra'
import {appPath} from '../helpers'
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

  writeFileSync(filePath, fileContent)
}
