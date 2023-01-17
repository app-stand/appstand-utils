import {readFileSync, writeFileSync} from 'fs'
import {AppLocalConfig} from 'types'
import {appPath} from '../../_helpers/helpers'
import replaceBetween from './helpers/replaceBetween'

export default (appLocalConfig: AppLocalConfig) => {
  const filePath = `${appPath}/index.html`
  let fileContent = readFileSync(filePath, {encoding: 'utf8'})
  const indexHtmlConfig = appLocalConfig.indexHtml

  fileContent = replaceBetween(
    fileContent,
    '<title>',
    '</title>',
    indexHtmlConfig.title
  )

  writeFileSync(filePath, fileContent)
}
