export default (
  content: string,
  before: string,
  after: string,
  replaceWith: string
) => {
  return content.replace(
    RegExp(`${before}.*?${after}`),
    `${before}${replaceWith}${after}`
  )
}
