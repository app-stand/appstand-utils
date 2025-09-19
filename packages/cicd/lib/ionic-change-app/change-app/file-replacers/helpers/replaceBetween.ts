export default (
  content: string,
  before: string,
  after: string,
  replaceWith: string
) => {
  // Escape any regex special characters so 'before' and 'after' are treated literally
  const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const beforeEsc = escapeRegex(before)
  const afterEsc = escapeRegex(after)

  // Use [\s\S]*? to match across newlines in a non-greedy fashion
  const regex = new RegExp(`${beforeEsc}[\\s\\S]*?${afterEsc}`)

  if (!regex.test(content)) {
    throw new Error(`Pattern between "${before}" and "${after}" not found.`)
  }
  return content.replace(regex, `${before}${replaceWith}${after}`)
}
