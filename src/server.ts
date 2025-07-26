import express from 'express';
import * as exphbs from 'express-handlebars';
import path from 'path';
import session from 'express-session';

import registerComponents from './helpers/registerComponents';
import routes from './routes/routes';
import adminRouter from './vendor/admin/routes';
import authRouter from './routes/auth';

const app = express();
const PORT = 3000;

// ✅ Parse URL-encoded form bodies
app.use(express.urlencoded({ extended: true }));

// ✅ Session middleware
app.use(session({
  secret: 'your-secret-key', // Change to a secure secret
  resave: false,
  saveUninitialized: false
}));

// ✅ Frontend Handlebars setup
const hbs = exphbs.create({
  extname: '.hbs',
  layoutsDir: path.join(process.cwd(), '/src/templates/layouts'),
  defaultLayout: 'main',
  partialsDir: path.join(process.cwd(), '/src/templates/partials'),
});
registerComponents(hbs);
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(process.cwd(), '/src/templates'));

// ✅ Static files
app.use(express.static(path.join(process.cwd(), '/public')));

// ✅ Auth routes (login, logout)
app.use(authRouter);

// ✅ Admin Handlebars setup (different engine)
const adminHbs = exphbs.create({
  extname: '.hbs',
  layoutsDir: path.join(process.cwd(), '/src/vendor/admin/views/layouts'),
  defaultLayout: 'adminMain',
  partialsDir: path.join(process.cwd(), '/src/vendor/admin/views/partials'),
});
app.engine('adminhbs', adminHbs.engine);

// ✅ Mount admin routes with their own view engine + views path
app.use('/manager', (req, res, next) => {
  res.app.set('view engine', 'adminhbs');
  res.app.set('views', path.join(process.cwd(), '/src/vendor/admin/views'));
  next();
}, adminRouter);

// ✅ Reset view engine and views for frontend routes
app.use((req, res, next) => {
  res.app.set('view engine', 'hbs');
  res.app.set('views', path.join(process.cwd(), '/src/templates'));
  next();
});

// ✅ Frontend routes (homepage, pages, blog, etc.)
app.use('/', routes);

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
