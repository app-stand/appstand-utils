import replaceBetween from './replaceBetween'

export function replacePlistArrayValue(
  fileContent: string,
  key: string,
  values: string[]
) {
  return replaceBetween(
    fileContent,
    `<key>${key}</key>
  <array>`,
    '</array>',
    values.map((value) => `\n\t\t\t<string>${value}</string>`).join('') + '\n'
  )
}
