/** A shuffled bag visits every approved project before repeating any of them. */
export function shuffledProjects(ids: readonly string[], current: string, random = Math.random): string[] {
  const pool = [...new Set(ids)].filter(id => id !== current);
  for (let index = pool.length - 1; index > 0; index--) {
    const target = Math.min(index, Math.max(0, Math.floor(random() * (index + 1))));
    [pool[index], pool[target]] = [pool[target], pool[index]];
  }
  return pool;
}
