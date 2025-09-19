import replaceBetween from './replaceBetween'

export function replacePlistStringValue(
  fileContent: string,
  key: string,
  value: string
) {
  const fillIn = `
	<string>${value}`

  return replaceBetween(fileContent, `<key>${key}</key>`, '</string>', fillIn)
}
