export const TAB_ITEMS = [
  { name: 'index', href: '/(tabs)', label: 'Today' },
  { name: 'browse', href: '/browse', label: 'Browse' },
  { name: 'rest', href: '/rest', label: 'Rest' },
  { name: 'you', href: '/you', label: 'You' },
] as const;

export type TabName = (typeof TAB_ITEMS)[number]['name'];

/** Which dock item is selected for a web pathname. Groups may be omitted. */
export function tabFocused(pathname: string, name: TabName): boolean {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (name === 'index') {
    return clean === '/' || clean === '/(tabs)';
  }
  return clean === `/${name}` || clean === `/(tabs)/${name}`;
}
