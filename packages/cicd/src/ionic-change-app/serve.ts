import {start} from './helpers'
import changeApp from './changeApp'
import {asyncExec} from './../asyncExec'

// ******************************************************************
// ***************************** MAIN *******************************
// ******************************************************************

export default async function main(appId: string) {
  start('serve')
  await changeApp(appId)
  serveProject()
}

// ******************************************************************
// ************************** FUNCTIONS *****************************
// ******************************************************************

async function serveProject() {
  const buildCmd = 'vite --mode development' // default
  await asyncExec(buildCmd, true)
}

export {main as serve}
