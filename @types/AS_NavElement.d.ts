interface AS_NavElement {
  id: string
  icon: any
  href: string
  label?: string
  slot: 'start' | 'end'
  iconSize: 'small' | 'medium' | 'large'
}
