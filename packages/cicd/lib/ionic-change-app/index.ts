#!/usr/bin/env ts-node

import {setVersion} from './setVersion'
import {build} from './build'
import {serve} from './serve'
import {Mode, SemanticIndex} from 'types'

main()

function main() {
  const APP = process.env.APP
  const MODE = process.env.MODE as Mode | undefined
  const SEMANTIC_INDEX = process.env.SEMANTIC_INDEX as SemanticIndex | undefined

  if (SEMANTIC_INDEX) return increaseVersion(SEMANTIC_INDEX)

  if (!APP) throw '❌: No APP provided.'

  if (MODE === 'serve') return serve(APP)

  if (MODE === 'build-web') return build(APP, true, false)
  if (MODE === 'build-mobile') return build(APP, false, true)
  if (MODE === 'build') return build(APP, false, false)

  throw '❌: Either no MODE / APP provided, or SEMANTIC_INDEX missing.'
}

function increaseVersion(SEMANTIC_INDEX: SemanticIndex) {
  if (!['0', '1', '2', '99'].includes(SEMANTIC_INDEX)) {
    throw '❌: Provided SEMANTIC_INDEX not allowed.'
  }
  setVersion(SEMANTIC_INDEX)
}
