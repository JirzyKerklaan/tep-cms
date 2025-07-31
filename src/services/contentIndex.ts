import fs from 'fs/promises';
import path from 'path';
import lunr from 'lunr';

const COLLECTIONS_DIR = path.join(process.cwd(), 'content/collections');

export interface IndexEntry {
  slug: string;
  title: string;
  content: string;
  type: string;
  path: string;
}

let index: IndexEntry[] = [];
let lunrIndex: ReturnType<typeof lunr> | null = null;

export async function buildContentIndex(): Promise<void> {
  const collections = await fs.readdir(COLLECTIONS_DIR);
  const result: IndexEntry[] = [];

  for (const collection of collections) {
    const collectionPath = path.join(COLLECTIONS_DIR, collection);
    const stat = await fs.stat(collectionPath);
    if (!stat.isDirectory()) continue;

    const files = await fs.readdir(collectionPath);

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const filePath = path.join(collectionPath, file);
      const slug = path.basename(file, '.json');

      const jsonRaw = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(jsonRaw);

      result.push({
        slug,
        title: data.title || slug,
        content: JSON.stringify(data),
        type: collection,
        path: filePath,
      });
    }
  }

  index = result;
  buildLunrIndex();
}

function buildLunrIndex() {
  lunrIndex = lunr(function (this: any) {
    this.ref('slug');
    this.field('title');
    this.field('content');
    this.field('type');

    index.forEach(entry => this.add(entry));
  });
}

export function searchContent(query: string): IndexEntry[] {
  if (!lunrIndex) return [];

  const results = lunrIndex.search(query);
  return results
    .map((result: any) => index.find((item: IndexEntry) => item.slug === result.ref))
    .filter((item: any): item is IndexEntry => Boolean(item));
}

export function getAllIndex(): IndexEntry[] {
  return index;
}
