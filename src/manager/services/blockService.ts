import fs from 'fs-extra';
import path from 'path';

const BLOCKS_DIR = path.join(process.cwd(), 'src/data/blocks');

fs.ensureDirSync(BLOCKS_DIR);

export type BlockType = 'page_builder' | 'component';

interface BlockInput {
  id: string;
  block: string;
  type: 'page_builder' | 'components';
  fields: any[];
}

// Save a new block
export async function saveBlock({ id, block, type, fields }: BlockInput) {
  const blockPath = path.join(process.cwd(), 'src', 'blocks', type, `${block}.ejs`);
  const schemaPath = path.join(process.cwd(), 'src', 'blocks', 'schemas', type, `${block}.schema.json`);

  // Create empty template file if it doesn't exist
  if (!(await fs.pathExists(blockPath))) {
    await fs.outputFile(blockPath, `<div class="${block}">\n  <!-- ${block} block -->\n</div>\n`);
  }

  // Create schema file
  const schema = {
    title: block,
    fields
  };
  await fs.outputJson(schemaPath, schema, { spaces: 2 });
}

// Get a block by ID
export async function getBlockById(id: string): Promise<BlockInput | null> {
  const filePath = path.join(BLOCKS_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  return await fs.readJson(filePath);
}

// Update an existing block
export async function updateBlock(id: string, data: Partial<BlockInput>): Promise<void> {
  const filePath = path.join(BLOCKS_DIR, `${id}.json`);
  const existing = await getBlockById(id);
  if (!existing) throw new Error('Block not found');
  const updated = { ...existing, ...data };
  await fs.writeJson(filePath, updated, { spaces: 2 });
}

// List all blocks
export async function listBlocks(): Promise<BlockInput[]> {
  const files = await fs.readdir(BLOCKS_DIR);
  const blocks: BlockInput[] = [];

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
