import { Service } from './service';
import { generateBlockTemplate } from '../helpers/blockTemplateHelper';
import fs from 'fs-extra';
import path from 'path';
import {BlockInput} from "../../interfaces/BlockInput";

export type BlockType = 'page_builder' | 'component';

const BLOCKS_DIR = path.join(process.cwd(), 'src/blocks');
const SCHEMAS_DIR = path.join(BLOCKS_DIR, 'schemas');

fs.ensureDirSync(BLOCKS_DIR);
fs.ensureDirSync(SCHEMAS_DIR);

function normalizeName(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

class BlockService extends Service<BlockInput> {
  constructor() {
    super(BLOCKS_DIR);
  }

  save = async ({ block, type, fields }: BlockInput) => {
    const normalizedBlock = normalizeName(block);
    const blockPath = path.join(BLOCKS_DIR, type, `${normalizedBlock}.ejs`);
    const schemaPath = path.join(SCHEMAS_DIR, type, `${normalizedBlock}.schema.json`);

    const templateContent = generateBlockTemplate(type, normalizedBlock, block);

    if (!(await fs.pathExists(blockPath))) await fs.outputFile(blockPath, templateContent);

    const schema = { title: block, fields };
    await fs.outputJson(schemaPath, schema, { spaces: 2 });
  };

  delete = async (id: string) => {
    const block = await this.getById(id);
    if (!block) return;

    const normalizedBlock = normalizeName(block.block);
    const blockPath = path.join(BLOCKS_DIR, block.type, `${normalizedBlock}.ejs`);
    const schemaPath = path.join(SCHEMAS_DIR, block.type, `${normalizedBlock}.schema.json`);

    if (await fs.pathExists(blockPath)) await fs.remove(blockPath);
    if (await fs.pathExists(schemaPath)) await fs.remove(schemaPath);
  };
}

export default new BlockService();
