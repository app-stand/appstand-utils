import {asyncExec} from '../../async-exec'
import {appPath, start} from '../_helpers/helpers'

// ******************************************************************
// ***************************** MAIN *******************************
// ******************************************************************

export default async function main(appId: string) {
  start('build')
  await buildProject()
  console.info('✅', `Successfully built app.`)
}

// ******************************************************************
// ************************** FUNCTIONS *****************************
// ******************************************************************

async function buildProject(devMode?: string | undefined) {
  console.info('ℹ️', `Building ...`)

  let buildCmd
  if (devMode) {
    // Doesn't seem to properly work yet, see https://github.com/ionic-team/ionic-cli/issues/4642
    buildCmd = `cd ${appPath} && vite build --mode development`
  } else {
    buildCmd = `cd ${appPath} && vite build --mode production` // default
  }

  await asyncExec(buildCmd, true)

  console.info('✅', `App successfully built!`)
}

export {main as build}
