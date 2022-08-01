import {assign} from 'lodash'
import {AppLocalConfig, AppstandCicdConfig} from 'types'

function start(title: string) {
  console.info('ℹ️', `Starting ${title}...`)
}

function handleError(title: string, e: any) {
  console.error('❌', `${title} failed, skipping...`)
  console.debug(e)
}

const packagesDir = `${process.cwd()}/..`
const appPath = `${packagesDir}/app`
const cicdDir = `${packagesDir}/cicd-utils`
const moduleSrcPath = `${__dirname}/../../lib`
const templatesPath = `${moduleSrcPath}/ionic-change-app/_templates`

// CICD Config
async function getConfig() {
  const defaultSettings: AppstandCicdConfig = {
    changeSitemap: true,
  }

  const configPath = `${cicdDir}/cicdConfig.ts`
  try {
    const configTs = await import(configPath)

    return assign({}, defaultSettings, configTs.default as AppstandCicdConfig)
  } catch (e) {
    return defaultSettings
  }
}

async function getOldAppLocalConfig() {
  const oldConfigPath = `${appPath}/src/assets/dyn/appLocalConfig.ts`
  try {
    const configTs = await import(oldConfigPath)
    return configTs.default as AppLocalConfig
  } catch (e) {
    return null
  }
}

async function getAppLocalConfig(appId: string) {
  const configPath = `${cicdDir}/apps/${appId}/assets/appLocalConfig.ts`
  const configTs = await import(configPath)
  return configTs.default as AppLocalConfig
}

export {
  start,
  packagesDir,
  cicdDir,
  getAppLocalConfig,
  appPath,
  getConfig,
  templatesPath,
  getOldAppLocalConfig,
  handleError,
}
