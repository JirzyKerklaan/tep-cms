const fs = require('fs');
const path = require('path');

function registerComponents(hbs) {
  const componentsDir = path.join(__dirname, '../blocks');

  function registerFromDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    entries.forEach(entry => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        registerFromDir(fullPath); // recurse into folders
      } else if (entry.isFile() && path.extname(entry.name) === '.hbs') {
        const name = path.parse(entry.name).name;
        const template = fs.readFileSync(fullPath, 'utf-8');
        hbs.handlebars.registerPartial(name, template);
      }
    });
  }

  registerFromDir(componentsDir);

  // Register dynamic partial helper
  hbs.handlebars.registerHelper('partial', function (name, options) {
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

module.exports = registerComponents;
