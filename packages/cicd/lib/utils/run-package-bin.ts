import {createRequire} from 'module'
import {readFileSync} from 'fs'
import path from 'path'
import {asyncExec} from '../async-exec'

type BinMap = string | Record<string, string>

function shArg(token: string): string {
  // Minimal shell escaping: wrap in double quotes if spaces/specials and escape existing quotes
  if (/[^A-Za-z0-9_\-./:@]/.test(token)) {
    return '"' + token.replace(/"/g, '\\"') + '"'
  }
  return token
}

/**
 * Resolve and execute a package binary via Node, robust to hoisting/symlinks.
 * @param pkgName e.g. '@capacitor/assets'
 * @param options.binName if package.json has multiple bins, specify the one to use
 * @param options.args list of CLI args; tokens will be minimally shell-escaped
 * @param options.cwd optional working directory; if provided, command will be prefixed with `cd <cwd> &&`
 */
export async function runPackageBin(
  pkgName: string,
  options?: {
    binName?: string
    args?: string[]
    cwd?: string
  }
) {
  const {binName, args = [], cwd} = options || {}
  const require = createRequire(import.meta.url)
  const pkgJsonPath = require.resolve(`${pkgName}/package.json`)
  const pkgDir = path.dirname(pkgJsonPath)
  const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8')) as {bin?: BinMap}

  if (!pkg.bin) {
    throw new Error(`Package ${pkgName} has no bin entry`)
  }

  let binRel: string | undefined
  if (typeof pkg.bin === 'string') {
    binRel = pkg.bin
  } else if (binName && pkg.bin[binName]) {
    binRel = pkg.bin[binName]
  } else {
    const values = Object.values(pkg.bin)
    if (values.length === 1) {
      binRel = values[0]
    } else {
      const guess = pkgName.split('/').pop()!
      binRel = pkg.bin[guess] ?? values[0]
    }
  }

  if (!binRel) {
    throw new Error(`Could not resolve bin for ${pkgName}`)
  }

  const binPath = path.resolve(pkgDir, binRel)
  const argsString = args.map(shArg).join(' ')
  const cmdCore = `node ${shArg(binPath)}${argsString ? ' ' + argsString : ''}`
  const cmd = cwd ? `cd ${shArg(cwd)} && ${cmdCore}` : cmdCore
  await asyncExec(cmd, false)
}
