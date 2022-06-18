import {readFileSync, writeFileSync} from 'fs-extra'
import {appPath} from '../helpers'
import replaceBetween from './helpers/replaceBetween'

export default (appLocalConfig: any) => {
  const filePath = `${appPath}/android/app/src/main/res/values/strings.xml`
  let fileContent = readFileSync(filePath, {encoding: 'utf8'})
  const stringsXmlConfig = appLocalConfig.cicd.android.stringsXml

  fileContent = replaceBetween(
    fileContent,
    '<string name="app_name">',
    '</string>',
    stringsXmlConfig.appName
  )

  fileContent = replaceBetween(
    fileContent,
    '<string name="title_activity_main">',
    '</string>',
    stringsXmlConfig.titleActivityMain
  )

  fileContent = replaceBetween(
    fileContent,
    '<string name="package_name">',
    '</string>',
    stringsXmlConfig.packageName
  )

  fileContent = replaceBetween(
    fileContent,
    '<string name="custom_url_scheme">',
    '</string>',
    stringsXmlConfig.customUrlSheme
  )

  writeFileSync(filePath, fileContent)
}
