import replaceBetween from './replaceBetween'

export function replacePlistStringValue(
  fileContent: string,
  key: string,
  value: string
) {
  return replaceBetween(
    fileContent,
    `<key>${key}</key>
  <string>`,
    '</string>',
    value
  )
}
