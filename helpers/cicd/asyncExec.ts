import util from 'util'
const execSync = util.promisify(child_process.execSync)
const exec = util.promisify(child_process.exec)
import child_process from 'child_process'

export default async (cliCommand, syncIo = false) => {
  try {
    // Makes sure, that called child processes i/o is synced
    if (syncIo) {
      return await execSync(cliCommand)
    } else {
      return await exec(cliCommand)
    }
  } catch (e) {
    return Promise.reject(e)
  }
}
