import booklist from '../../content/booklist.json';

export interface AuthorInfo {
  name: string;
  name_en: string;
  bio: string;
  bio_en: string;
  slug: string;
}

function toAuthorSlug(name: string): string {
  const asciiSlug = name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return asciiSlug || encodeURIComponent(name);
}

export const AUTHORS: AuthorInfo[] = Array.from(
  new Set(booklist.books.map((book) => book.author))
)
  .sort((a, b) => a.localeCompare(b, 'en'))
  .map((name) => ({
    name,
    name_en: name,
    bio: `${name} 的代表作品已收录在 AIreading，可按主题快速收听精华版与完整版摘要。`,
    bio_en: `${name}'s representative works are available on AIreading with both short and full audio summaries.`,
    slug: toAuthorSlug(name),
  }));

export function getAuthorBySlug(slug: string): AuthorInfo | undefined {
  return AUTHORS.find((author) => author.slug === slug);
}

export function getAuthorByName(name: string): AuthorInfo | undefined {
  return AUTHORS.find((author) => author.name === name);
}
