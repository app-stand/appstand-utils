#!/usr/bin/env node

import {setVersion} from './setVersion'
import {build} from './build'
import {serve} from './serve'

function main() {
  const APP = process.env.APP
  const MODE = process.env.MODE
  const SEMANTIC_INDEX = process.env.SEMANTIC_INDEX

  if (MODE === 'serve') {
    if (!APP) throw '❌: No APP provided.'
    serve(APP)
    return
  }
  if (MODE === 'build') {
    if (!APP) throw '❌: No APP provided.'
    build(APP)
    return
  }
  if (SEMANTIC_INDEX) {
    if (!['0', '1', '2', '99'].includes(SEMANTIC_INDEX)) {
      throw '❌: Provided SEMANTIC_INDEX not allowed.'
    }
    setVersion(parseInt(SEMANTIC_INDEX) as SemanticIndex)
    return
  }
  throw '❌: Either no MODE / APP provided, or SEMANTIC_INDEX missing.'
}

if (require.main === module) {
  main()
}
