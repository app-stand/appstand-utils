function start(title: string) {
  console.info('ℹ️', `Starting ${title}...`)
}

const packagesDir = `${process.cwd()}/..`
const appPath = `${packagesDir}/app`
const cicdDir = `${packagesDir}/cicd-utils`
const templatesPath = `${cicdDir}/_templates`

async function getAppConfig(appId: string) {
  const configPath = `${cicdDir}/apps/${appId}/appConfig/index.json`
  const configJson = await import(configPath)
  return configJson.default
}

export {start, packagesDir, cicdDir, getAppConfig, appPath, templatesPath}
