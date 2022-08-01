import {appPath, start} from '../_helpers/helpers'
import changeApp from '../change-app'
import {asyncExec} from '../../async-exec'

// ******************************************************************
// ***************************** MAIN *******************************
// ******************************************************************

export default async function main(appId: string) {
  start('serve')
  await changeApp(appId, true, true, 'serve')
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
