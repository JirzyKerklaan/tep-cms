import fs from 'fs';
import path from 'path';
import * as exphbs from 'express-handlebars';
import { HelperOptions } from 'handlebars';

function registerComponents(hbs: exphbs.ExpressHandlebars | any): void {
const componentsDir = path.join(process.cwd(), '/src/blocks');

  function registerFromDir(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    entries.forEach(entry => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        registerFromDir(fullPath);
      } else if (entry.isFile() && path.extname(entry.name) === '.hbs') {
        const name = path.parse(entry.name).name;
        const template = fs.readFileSync(fullPath, 'utf-8');
        hbs.handlebars.registerPartial(name, template);
      }
    });
  }

  registerFromDir(componentsDir);

  hbs.handlebars.registerHelper('partial', function(this: any, name: string, options: HelperOptions) {
    const partial = hbs.handlebars.partials[name];
    if (!partial) {
      throw new Error(`Partial "${name}" not found`);
    }

    const template =
      typeof partial === 'string'
        ? hbs.handlebars.compile(partial)
        : partial;

    return template(this, options);
  });
}

export default registerComponents;
