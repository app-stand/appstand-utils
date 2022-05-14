function start(title: string) {
  console.info('ℹ️', `Starting ${title}...`)
}

const packagesDir = `${process.cwd()}/..`
const appPath = `${packagesDir}/app`
const cicdDir = `${packagesDir}/cicd-utils`
const moduleSrcPath = `${__dirname}/../../src`
const templatesPath = `${moduleSrcPath}/ionic-change-app/_templates`

async function getOldAppLocalConfig() {
  const oldConfigPath = `${appPath}/src/appLocalConfig/index.json`
  try {
    const configJson = await import(oldConfigPath)
    return configJson.default
  } catch (e) {
    return null
  }
}

async function getAppLocalConfig(appId: string) {
  const configPath = `${cicdDir}/apps/${appId}/appLocalConfig/index.json`
  const configJson = await import(configPath)
  return configJson.default
}

export {
  start,
  packagesDir,
  cicdDir,
  getAppLocalConfig,
  appPath,
  templatesPath,
  getOldAppLocalConfig,
}
