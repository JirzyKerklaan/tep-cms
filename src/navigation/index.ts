// src/navigation/index.ts
import fs from 'fs';
import path from 'path';
import { NavigationGroup } from "../../core/interfaces/NavGroup";

const navPath = path.join(process.cwd(), '/content/navigation');

const navigationData: Record<string, NavigationGroup> = {};

function loadNavigation() {
  if (!fs.existsSync(navPath)) return;

  fs.readdirSync(navPath).forEach(file => {
    if (file.endsWith('.json')) {
      const navName = path.basename(file, '.json');
      const raw = fs.readFileSync(path.join(navPath, file), 'utf-8');
      const parsed: NavigationGroup = JSON.parse(raw);
      navigationData[navName] = parsed;
    }
  });
}

loadNavigation();

export default navigationData;
