import {assign} from 'lodash'

function start(title: string) {
  console.info('ℹ️', `Starting ${title}...`)
}

const packagesDir = `${process.cwd()}/..`
const appPath = `${packagesDir}/app`
const cicdDir = `${packagesDir}/cicd-utils`
const moduleSrcPath = `${__dirname}/../../lib`
const templatesPath = `${moduleSrcPath}/ionic-change-app/_templates`

// CICD Config
async function getConfig() {
  const defaultSettings = {
    changeSitemap: true,
  }

  const configPath = `${cicdDir}/config.json`
  try {
    const configJson = await import(configPath)

    return assign({}, defaultSettings, configJson.default)
  } catch (e) {
    return defaultSettings
  }
}

async function getOldAppLocalConfig() {
  const oldConfigPath = `${appPath}/src/assets/dyn/appLocalConfig.ts`
  try {
    const configTs = await import(oldConfigPath)
    return configTs.default
  } catch (e) {
    return null
  }
}

async function getAppLocalConfig(appId: string) {
  const configPath = `${cicdDir}/apps/${appId}/assets/appLocalConfig.ts`
  const configTs = await import(configPath)
  return configTs.default
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
}
