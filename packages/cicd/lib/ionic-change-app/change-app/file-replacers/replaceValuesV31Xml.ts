import {AppLocalConfig} from 'types'
import {readFileSync, writeFileSync} from 'fs-extra'
import {appPath} from '../../_helpers/helpers'
import replaceBetween from './helpers/replaceBetween'

export default (appLocalConfig: AppLocalConfig) => {
  const filePath = `${appPath}/android/app/src/main/res/values-v31/styles.xml`
  let fileContent = readFileSync(filePath, {encoding: 'utf8'})
  const stringsXmlConfig = appLocalConfig.android.valuesV31Xml

  fileContent = replaceBetween(
    fileContent,
    '<item name="android:windowSplashScreenBackground">',
    '</item>',
    stringsXmlConfig.windowSplashScreenBackground
  )

  writeFileSync(filePath, fileContent)
}
