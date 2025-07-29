/**
 * @Author: JirzyKerklaan
 * @Date: 2025-07-27 14:06:43
 * @Desc: Server entrypoint (converted to EJS)
 */

import express from 'express';
import path from 'path';
import session from 'express-session';
import expressLayouts from 'express-ejs-layouts';

import routes from './routes/routes';
import managerRoutes from './routes/managerRoutes';
import config from './config';
import navigationData from './navigation';

const app = express();
const PORT = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', [
  path.join(process.cwd(), 'src/templates/'),
  path.join(process.cwd(), 'src/blocks/')
]);

// Enable express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layouts/main'); // Relative to /src/templates/views

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
}));

// Global template variables
app.use((req, res, next) => {
  res.locals.site_name = config.site.site_name;
  res.locals.title = 'Default title';

  res.locals.navigation = navigationData;
  
  res.locals.nav = renderNav;
  
  next();
});

// Serve static assets
app.use(express.static(path.join(process.cwd(), 'public')));

// Route handlers
app.use('/', routes);
app.use('/manager', managerRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});


// A function to generate navigation HTML from a nav name
function renderNav(name: string) {
  const nav = navigationData[name];
  if (!nav) return '';
  
  const items = nav.links.map((link: any) =>
    `<li><a href="${link.url}">${link.label}</a></li>`
  ).join('');

  return `<ul>${items}</ul>`;
}
