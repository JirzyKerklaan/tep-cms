// src/navigation/index.ts
import fs from 'fs';
import path from 'path';

const navPath = path.join(process.cwd(), '/content/navigation');

const navigationData: Record<string, any> = {};

function loadNavigation() {
  if (!fs.existsSync(navPath)) return;
  fs.readdirSync(navPath).forEach(file => {
    if (file.endsWith('.json')) {
      const navName = path.basename(file, '.json');
      const raw = fs.readFileSync(path.join(navPath, file), 'utf-8');
      navigationData[navName] = JSON.parse(raw);
    }
  });
}

// Load once when this module is imported
loadNavigation();

export default navigationData;
