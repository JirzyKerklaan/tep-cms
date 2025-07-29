import fs from 'fs-extra';
import path from 'path';

const BLOCKS_DIR = path.join(process.cwd(), 'src/data/blocks');

fs.ensureDirSync(BLOCKS_DIR);

export type BlockType = 'page_builder' | 'component';

export interface BlockData {
  id: string;
  type: BlockType;
  block: string;
  fields: Record<string, any>;
}

// Save a new block
export async function saveBlock({ id, block, type, fields }: BlockData) {
  const basePath = path.join(process.cwd(), 'src', 'blocks');

  const templatePath = path.join(basePath, type, `${block}.ejs`);
  const schemaPath = path.join(basePath, 'schemas', type, `${block}.json`);

  // Generate basic EJS template content (can be enhanced later)
  const templateContent = `<div>\n  <!-- ${block} block -->\n  <%- JSON.stringify(fields, null, 2) %>\n</div>`;

  // Save EJS file
  await fs.outputFile(templatePath, templateContent);

  // Save schema/metadata
  await fs.outputJson(schemaPath, { id, block, type, fields }, { spaces: 2 });
}

// Get a block by ID
export async function getBlockById(id: string): Promise<BlockData | null> {
  const filePath = path.join(BLOCKS_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  return await fs.readJson(filePath);
}

// Update an existing block
export async function updateBlock(id: string, data: Partial<BlockData>): Promise<void> {
  const filePath = path.join(BLOCKS_DIR, `${id}.json`);
  const existing = await getBlockById(id);
  if (!existing) throw new Error('Block not found');
  const updated = { ...existing, ...data };
  await fs.writeJson(filePath, updated, { spaces: 2 });
}

// List all blocks
export async function listBlocks(): Promise<BlockData[]> {
  const files = await fs.readdir(BLOCKS_DIR);
  const blocks: BlockData[] = [];

  for (const file of files) {
    if (file.endsWith('.json')) {
      const block = await fs.readJson(path.join(BLOCKS_DIR, file));
      blocks.push(block);
    }
  }

  return blocks;
}

// Delete a block
export async function deleteBlock(id: string): Promise<void> {
  const filePath = path.join(BLOCKS_DIR, `${id}.json`);
  await fs.remove(filePath);
}
