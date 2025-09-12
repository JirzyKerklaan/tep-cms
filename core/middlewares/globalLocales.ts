import { Request, Response, NextFunction } from 'express';
import config from '../../src/config';
import navigationData from '../../src/navigation';
import { renderNav } from '../../src/utils/renderNav';

export function globalLocals(req: Request, res: Response, next: NextFunction) {
  res.locals.site_name = config.site.site_name;
  res.locals.title = 'Default title';
  res.locals.navigation = navigationData;
  res.locals.nav = renderNav;
  next();
}
