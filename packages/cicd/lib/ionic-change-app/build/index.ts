import {asyncExec} from '../../async-exec'
import {appPath, start} from '../_helpers/helpers'
import changeApp from '../change-app'

// ******************************************************************
// ***************************** MAIN *******************************
// ******************************************************************

export default async function main(
  appId: string,
  skipCapacitator: boolean,
  skipPwa: boolean
) {
  start('build')
  await changeApp(appId, skipCapacitator, skipPwa)
  await buildProject()
  console.info('â', `Successfully built app.`)
}

// ******************************************************************
// ************************** FUNCTIONS *****************************
// ******************************************************************

async function buildProject(devMode?: string | undefined) {
  console.info('âšī¸', `Building ...`)

  let buildCmd
  if (devMode) {
    // Doesn't seem to properly work yet, see https://github.com/ionic-team/ionic-cli/issues/4642
    buildCmd = `cd ${appPath} && vite build --mode development`
  } else {
    buildCmd = `cd ${appPath} && vite build --mode production` // default
  }

  await asyncExec(buildCmd, true)

  console.info('â', `App successfully built!`)
}

export {main as build}
