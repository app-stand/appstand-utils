import {readFileSync, writeFileSync} from 'fs-extra'
import {appPath} from '../helpers'
import replaceBetween from './helpers/replaceBetween'

export default (appLocalConfig: any) => {
  const filePath = `${appPath}/index.html`
  let fileContent = readFileSync(filePath, {encoding: 'utf8'})
  const indexHtmlConfig = appLocalConfig.cicd.indexHtml

  fileContent = replaceBetween(
    fileContent,
    '<title>',
    '</title>',
    indexHtmlConfig.title
  )

  writeFileSync(filePath, fileContent)
}
