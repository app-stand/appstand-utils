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

  // Android Studio keeps many of its effective caches under the IDE "system" directory
  // (e.g. ~/Library/Application Support/Google/AndroidStudio*/system/caches).
  // Invalidate Caches in the UI clears these, then restarts the IDE.
  for (const root of configRoots) {
    for (const dir of invalidateSystemDirs) {
      targets.push(`${root}/AndroidStudio*/system/${dir}`)
    }
    targets.push(`${root}/AndroidStudio*/system/index`)
  }

  for (const root of configRoots) {
    targets.push(`${root}/AndroidStudio*/LocalHistory`)
  }

  console.info('🧹', 'Invalidating Android Studio caches...')
  await asyncExec(`rm -rf ${targets.join(' ')}`, true)

  // Optional: restart Android Studio so it actually re-reads caches/indexes.
  // Deleting folders alone often isn't enough while the IDE is running.
  if (process.env.ANDROID_STUDIO_RESTART === '1') {
    await restartAndroidStudio(platform)
  }
}

async function restartAndroidStudio(platform: string): Promise<void> {
  if (platform !== 'darwin' && platform !== 'linux') return

  if (platform === 'darwin') {
    // Best-effort; may prompt if there are unsaved changes.
    console.info('🔁', 'Restarting Android Studio...')
    await asyncExec(
      `osascript -e 'tell application "Android Studio" to quit' || true`,
      true
    )
    await asyncExec(`open -a "Android Studio" || true`, true)
    return
  }

  // Linux: try to relaunch via desktop entry if available.
  console.info('🔁', 'Restarting Android Studio (best-effort)...')
  await asyncExec(
    `pkill -f "android-studio|studio.sh|jetbrains-studio" || true`,
    true
  )
  await asyncExec(`(command -v studio && studio) || true`, true)
}
