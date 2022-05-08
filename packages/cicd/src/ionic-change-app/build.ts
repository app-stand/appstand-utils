import {asyncExec} from './../asyncExec'
import {start} from './helpers'
import changeApp from './changeApp'

// ******************************************************************
// ***************************** MAIN *******************************
// ******************************************************************

export default async function main(appId: string) {
  start('build')
  await changeApp(appId)
  const devMode = process.env.DEV_MODE
  await buildProject(devMode)
  console.info('✅', `Successfully built app.`)
}

// ******************************************************************
// ************************** FUNCTIONS *****************************
// ******************************************************************

async function buildProject(devMode: string | undefined) {
  let buildCmd
  if (devMode) {
    // Doesn't seem to properly work yet, see https://github.com/ionic-team/ionic-cli/issues/4642
    buildCmd = 'vite build --mode development'
  } else {
    buildCmd = 'vite build --mode production' // default
  }

  await asyncExec(buildCmd, true)
}

export {main as build}
