const FORBIDDEN = [
  /\b(teen|teenage|teenaged|underage|minor|schoolgirl|schoolboy)\b/i,
  /\b(18\s*year|nineteen|barely\s*18|just\s*18)\b/i,
  /\b(high\s*school|middle\s*school|elementary|daycare)\b/i,
  /\b(loli|shota|child|children|kid|kids|toddler)\b/i,
  /\b(age\s*play|ddl[bg]|little\s*space)\b/i,
];

export function isAdultBirthYear(year: number, now = new Date()): boolean {
  if (!Number.isInteger(year)) return false;
  const latest = now.getFullYear() - 18;
  return year <= latest && year >= 1900;
}

export function scanLine(text: string): string[] {
  return FORBIDDEN.filter((pattern) => pattern.test(text)).map((pattern) => pattern.source);
}

export function scanSessionTexts(texts: string[]): string[] {
  const hits: string[] = [];
  for (const text of texts) {
    for (const hit of scanLine(text)) {
      hits.push(`${hit} ← "${text.slice(0, 80)}"`);
    }
  }
  return hits;
}

export function assertAdultCatalog(texts: string[]): void {
  const hits = scanSessionTexts(texts);
  if (hits.length > 0) {
    throw new Error(`Adult catalog safety failed:\n${hits.join('\n')}`);
  }
}
