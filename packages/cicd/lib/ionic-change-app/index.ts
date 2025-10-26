#!/usr/bin/env ts-node

import {setVersion} from './set-version'
import {build} from './build'
import {serve} from './serve'
import {Mode, SemanticIndex} from 'types'
import changeApp from './change-app'

main()

async function main() {
  const APP_ID = process.env.APP
  const MODE = process.env.MODE as Mode | undefined
  const SEMANTIC_INDEX = process.env.SEMANTIC_INDEX as SemanticIndex | undefined

  if (SEMANTIC_INDEX) return increaseVersion(SEMANTIC_INDEX)

  if (!APP_ID) throw '❌: No APP provided.'

  if (MODE === 'serve') return serve(APP_ID)

  if (MODE === 'build') return build(APP_ID)
  if (MODE === 'change') {
    return changeApp(APP_ID, false)
  }
  if (MODE === 'change-web') {
    return changeApp(APP_ID, true)
  }
  if (MODE === 'change-cicd') {
    return changeApp(APP_ID, true)
  }

  throw '❌: Either no MODE / APP provided, or SEMANTIC_INDEX missing.'
}

function increaseVersion(SEMANTIC_INDEX: SemanticIndex) {
  if (!['0', '1', '2', '99'].includes(SEMANTIC_INDEX)) {
    throw '❌: Provided SEMANTIC_INDEX not allowed.'
  }
  setVersion(SEMANTIC_INDEX)
}
