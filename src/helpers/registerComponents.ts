import fs from 'fs';
import path from 'path';
import * as exphbs from 'express-handlebars';
import { HelperOptions } from 'handlebars';

interface Block {
  block: string;
  fields: Record<string, any>;
}

function registerComponents(hbs: exphbs.ExpressHandlebars | any): void {
  const baseDir = path.join(process.cwd(), '/src/blocks');
  const blockDirs = {
    page: path.join(baseDir, 'page_builder'),
    component: path.join(baseDir, 'components'),
    base: path.join(baseDir, 'base'),   // <-- New base directory
  };

  function registerFromDir(dir: string): void {
    if (!fs.existsSync(dir)) return;  // Safety check

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    entries.forEach(entry => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        registerFromDir(fullPath);
      } else if (entry.isFile() && path.extname(entry.name) === '.hbs') {
        const relativePath = path.relative(baseDir, fullPath);
        const partialName = relativePath
          .replace(/\\/g, '/')
          .replace('.hbs', '');
        const template = fs.readFileSync(fullPath, 'utf-8');
        hbs.handlebars.registerPartial(partialName, template);
      }
    });
  }

  // Register all 3 dirs
  registerFromDir(blockDirs.page);
  registerFromDir(blockDirs.component);
  registerFromDir(blockDirs.base);

  hbs.handlebars.registerHelper('concat', function (...args: any[]) {
    const options = args.pop();
    return args.map(String).join('');
  });

  hbs.handlebars.registerHelper('partial', function (
    this: Record<string, any>,
    name: string,
    context?: any,
    options?: HelperOptions
  ) {
    // If options is omitted, shift arguments
    if (!options) {
      options = context as HelperOptions;
      context = this;
    }
    
    const partial = hbs.handlebars.partials[name];
    if (!partial) throw new Error(`Partial "${name}" not found`);

    const template =
      typeof partial === 'string' ? hbs.handlebars.compile(partial) : partial;

    context = context || this;

    // Safely handle case when options might be undefined
    return new hbs.handlebars.SafeString(
      template(context, {
        data: options?.data,
      })
    );
  });


  // New helper for base blocks (header, footer, etc.)
  hbs.handlebars.registerHelper('baseBlock', function (
    this: Record<string, any>,
    name: string,
    options: HelperOptions
  ) {
    const partialName = `base/${name}`;
    const partial = hbs.handlebars.partials[partialName];
    if (!partial) throw new Error(`Partial "${partialName}" not found`);

    const template =
      typeof partial === 'string'
        ? hbs.handlebars.compile(partial)
        : partial;

    const context = options.hash || this;

    return new hbs.handlebars.SafeString(
      template(context, {
        data: options.data,
      })
    );
  });
}

export default registerComponents;
