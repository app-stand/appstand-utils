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
  const regex = new RegExp(`${beforeEsc}[\\s\\S]*?${afterEsc}`, 'g')

  let replaced = false
  const updated = content.replace(regex, () => {
    replaced = true
    return `${before}${replaceWith}${after}`
  })

  if (!replaced) {
    throw new Error(`Pattern between "${before}" and "${after}" not found.`)
  }

  return updated
}
