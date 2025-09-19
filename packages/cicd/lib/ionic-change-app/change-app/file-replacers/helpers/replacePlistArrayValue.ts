import replaceBetween from './replaceBetween'

export function replacePlistArrayValue(
  fileContent: string,
  key: string,
  values: string[]
) {
  const arrayAsXmlString = values
    .map((value) => `				<string>${value}</string>`)
    .join('\n')
  const fillIn = `
			<array>${arrayAsXmlString}`

  return replaceBetween(fileContent, `<key>${key}</key>`, '</array>', fillIn)
}
