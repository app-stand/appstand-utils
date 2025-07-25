import {assign} from 'lodash-es'
import {dirname} from 'path'
import {AppLocalConfig, AppstandCicdConfig} from 'types'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function start(title: string) {
  console.info('ℹ️', `Starting ${title}...`)
}

function handleError(title: string, e: unknown) {
  console.error('❌', `${title} failed, skipping...`)
  console.debug(e)
}

const packagesDir = `${process.cwd()}/..`
const appPath = `${packagesDir}/app`
const cicdDir = `${packagesDir}/cicd-utils`
const moduleSrcPath = `${__dirname}/../..`
const templatesPath = `${moduleSrcPath}/ionic-change-app/change-app/_templates`

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

async function getOldAppLocalConfig(): Promise<AppLocalConfig | null> {
  const oldConfigPath = `${appPath}/src/assets/dyn/appLocalConfig.ts`
  try {
    const configTs = await import(oldConfigPath)
    return configTs.default as AppLocalConfig
  } catch (e) {
    // Can also not exist, ignore.
    return null
  }
}

async function getAppLocalConfig(appId: string): Promise<AppLocalConfig> {
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
