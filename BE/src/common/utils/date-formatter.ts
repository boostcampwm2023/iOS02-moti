export function dateFormat(date: Date): string {
  return date?.toISOString().slice(0, -5).concat('Z') || null;
}
