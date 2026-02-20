// src/navigation/index.ts
import fs from 'fs';
import path from 'path';
import {SanitizedString} from "../../core/manager/classes/sanitizedString";

const navPath = path.join(process.cwd(), '/content/navigation');

const navigationData: Record<string, any> = {};

function loadNavigation() {
  if (!fs.existsSync(navPath)) return;
  fs.readdirSync(navPath).forEach(file => {
    if (file.endsWith('.json')) {
      const navName = path.basename(file, '.json');
      const raw = fs.readFileSync(path.join(navPath, new SanitizedString(file).toString()), 'utf-8');
      navigationData[navName] = JSON.parse(raw);
    }
  });
}

loadNavigation();

export default navigationData;
