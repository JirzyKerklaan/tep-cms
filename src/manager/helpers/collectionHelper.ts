import fs from 'fs/promises';
import path from 'path';

interface Collection {
  id: string;
  name: string;
}

const collections: Collection[] = [];

const collectionHelper = {
  async createCollection(data: Partial<Collection>) {
    if (!data.name) throw new Error('Collection name is required');

    // Define folder path based on collection name
    const folderPath = path.join(process.cwd(), 'content', 'collection', data.name);

    try {
      // Check if folder already exists
      await fs.stat(folderPath);
      // If stat succeeds, folder exists, throw error
      throw new Error('That collection already exists');
    } catch (err: any) {
      if (err.code !== 'ENOENT') {
        // If error is something other than folder not existing, rethrow
        throw err;
      }
      // ENOENT means folder doesn't exist, proceed
    }

    const id = Date.now().toString();
    const newCollection = { id, ...data } as Collection;
    collections.push(newCollection);

    // Create folder (recursive true ensures parent folders are created if missing)
    await fs.mkdir(folderPath, { recursive: true });

    // Prepare file content with collection name
    const fileContent = JSON.stringify({
      title: `First ${newCollection.name}`
    }, null, 2);

    // Write standard.json file
    await fs.writeFile(path.join(folderPath, 'standard.json'), fileContent, 'utf-8');

    return newCollection;
  },

  async getCollectionById(id: string) {
    return collections.find(c => c.id === id);
  },

  async updateCollection(id: string, data: Partial<Collection>) {
    const index = collections.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Not found');
    collections[index] = { ...collections[index], ...data };
  },

  async getAllCollections() {
    return collections;
  }
};

export default collectionHelper;
