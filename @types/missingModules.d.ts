declare module 'child_process'
declare module 'util'
declare module 'fs'
declare module '*.svg?url' {
  const src: string
  export default src
}
