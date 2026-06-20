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

  const backgroundPattern = /background:\s*[^;]+;/i

  if (backgroundPattern.test(fileContent)) {
    fileContent = replaceBetween(
      fileContent,
      'background: ',
      ';',
      indexHtmlConfig.background
    )
  } else {
    console.info(
      'ℹ️',
      'No background style found in index.html, skipping background replacement.'
    )
  }

  writeFileSync(filePath, fileContent)
}
