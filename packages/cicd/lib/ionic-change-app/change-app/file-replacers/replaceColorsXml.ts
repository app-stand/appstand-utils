import {AppLocalConfig} from 'types'
import {existsSync, readFileSync, writeFileSync} from 'fs'
import {appPath} from '../../_helpers/helpers'
import replaceBetween from './helpers/replaceBetween'

export default (appLocalConfig: AppLocalConfig) => {
  const filePath = `${appPath}/android/app/src/main/res/values/colors.xml`

  if (!existsSync(filePath)) {
    return
  }

  const windowBackground =
    appLocalConfig.colors.background ?? appLocalConfig.indexHtml.background

  let fileContent = readFileSync(filePath, {encoding: 'utf8'})

  fileContent = replaceBetween(
    fileContent,
    '<color name="app_window_background">',
    '</color>',
    windowBackground
  )

  writeFileSync(filePath, fileContent)
}
