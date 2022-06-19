import {appPath, cicdDir, start} from './helpers'
import changeApp from './changeApp'
import {asyncExec} from './../asyncExec'

// ******************************************************************
// ***************************** MAIN *******************************
// ******************************************************************

export default async function main(appId: string) {
  start('serve')
  await changeApp(appId, true, true)
  serveProject()
}

// ******************************************************************
// ************************** FUNCTIONS *****************************
// ******************************************************************

async function serveProject() {
  console.info('ℹ️', `Serving ...`)
  const cmd = `cd ${appPath} && vite --host --mode development` // default
  try {
    await asyncExec(cmd, true)
  } catch (e) {
    console.error('❌', e)
    return
  }
}

export {main as serve}
