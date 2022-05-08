function start(title: string) {
  console.info('ℹ️', `Starting ${title}...`)
}

//const packagesDir = `${__dirname}/../..`
const packagesDir = `${process.cwd()}/..`

const cicdDir = `${packagesDir}/cicd-utils`

async function getAppConfig(appId: string) {
  const configPath = `${cicdDir}/apps/${appId}/appConfig/index.json`
  const configJson = await import(configPath)
  return configJson.default
}

export {start, packagesDir, cicdDir, getAppConfig}
