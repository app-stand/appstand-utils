import os from 'os'
import {asyncExec} from '../../../async-exec'

export async function resetAndroidStudioCaches(): Promise<void> {
  const platform = os.platform()

  if (platform !== 'darwin' && platform !== 'linux') {
    console.info('⚠️', 'Android Studio cache cleanup not supported on this OS')
    return
  }

  const isMac = platform === 'darwin'

  const systemCacheRoots = isMac
    ? [
        '$HOME/Library/Caches/Google',
        '$HOME/Library/Caches/JetBrains',
        '$HOME/Library/Caches',
      ]
    : ['$HOME/.cache/Google', '$HOME/.cache/JetBrains', '$HOME/.cache']

  const configRoots = isMac
    ? [
        '"$HOME/Library/Application Support/Google"',
        '"$HOME/Library/Application Support/JetBrains"',
      ]
    : ['$HOME/.config/Google', '$HOME/.config/JetBrains']

  const invalidateSystemDirs = [
    'caches',
    'tmp',
    'vcs-log',
    'shared-indexes',
    'shared-index',
  ]

  const targets: string[] = []
  for (const root of systemCacheRoots) {
    for (const dir of invalidateSystemDirs) {
      targets.push(`${root}/AndroidStudio*/${dir}`)
    }
  }

  for (const root of configRoots) {
    targets.push(`${root}/AndroidStudio*/LocalHistory`)
  }

  console.info('🧹', 'Invalidating Android Studio caches (no Gradle caches)...')
  await asyncExec(`rm -rf ${targets.join(' ')}`, true)
}
