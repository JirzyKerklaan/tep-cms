import fs from 'fs/promises';
import path from 'path';
import lunr from 'lunr';
import {IndexEntry} from "../interfaces/IndexEntry";
import {SanitizedString} from "../manager/classes/sanitizedString";

const BASE_DIRS = [
  path.join(process.cwd(), 'content/collections'),
  path.join(process.cwd(), 'content/globals'),
  path.join(process.cwd(), 'content/navigation'),
];

let index: IndexEntry[] = [];
let lunrIndex: ReturnType<typeof lunr> | null = null;

export async function buildContentIndex(): Promise<void> {
  const result: IndexEntry[] = [];

  for (const baseDir of BASE_DIRS) {
    const type = path.basename(baseDir); // e.g., 'collections', 'globals'

    let jsonFiles: string[] = [];
    try {
      jsonFiles = await recursivelyFindJsonFiles(baseDir);
    } catch {
      continue;
    }

    for (const filePath of jsonFiles) {
      const slug = path.basename(filePath, '.json');

      try {
        const jsonRaw = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(jsonRaw);

        result.push({
          slug,
          title: data.title || slug,
          content: JSON.stringify(data),
          type,
          path: filePath,
        });
      } catch {
        // skip unreadable or invalid JSON
        continue;
      }
    }
  }

  index = result;
  buildLunrIndex();
}

async function recursivelyFindJsonFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, new SanitizedString(entry.name).toString());

    if (entry.isDirectory()) {
      const nestedFiles = await recursivelyFindJsonFiles(fullPath);
      files.push(...nestedFiles);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }

  return files;
}

function buildLunrIndex() {
  lunrIndex = lunr(function (this: any) {
    this.ref('slug');
    this.field('title');
    this.field('content');
    this.field('type');
    this.field('slug');

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
