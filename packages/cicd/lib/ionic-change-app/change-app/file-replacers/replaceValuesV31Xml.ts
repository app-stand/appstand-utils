import {AppLocalConfig} from 'types'
import {existsSync, readFileSync, writeFileSync} from 'fs'
import {appPath} from '../../_helpers/helpers'
import replaceBetween from './helpers/replaceBetween'

export default (appLocalConfig: AppLocalConfig) => {
  const before = '<item name="android:windowSplashScreenBackground">'
  const after = '</item>'

  const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const itemRegex = new RegExp(
    `${escapeRegex(before)}([\\s\\S]*?)${escapeRegex(after)}`
  )

  const nextValue =
    appLocalConfig.android.valuesV31Xml.windowSplashScreenBackground

  const updateFileIfNeeded = (filePath: string) => {
    if (!existsSync(filePath)) {
      return
    }

    let fileContent = readFileSync(filePath, {encoding: 'utf8'})
    const match = fileContent.match(itemRegex)

    // If the item is not present, skip (do not fail the whole change-app run).
    if (!match) {
      return
    }

    const currentValue = match[1]?.trim() ?? ''

    // If the value is a resource reference (e.g. @color/app_window_background), skip.
    if (currentValue.startsWith('@')) {
      return
    }

    fileContent = replaceBetween(fileContent, before, after, nextValue)
    writeFileSync(filePath, fileContent)
  }

  updateFileIfNeeded(
    `${appPath}/android/app/src/main/res/values-v31/styles.xml`
  )
  updateFileIfNeeded(
    `${appPath}/android/app/src/main/res/values-v29/styles.xml`
  )
}
