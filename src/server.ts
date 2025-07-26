import express from 'express';
import * as exphbs from 'express-handlebars';
import path from 'path';
import session from 'express-session';

import registerComponents from './helpers/registerComponents';
import routes from './routes/routes';
import adminRouter from './vendor/admin/routes';
import authRouter from './routes/auth';
import config from './config';

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false
}));

// ** Middleware to set global variables for all views **
app.use((req, res, next) => {
  res.locals.site_name = config.site.site_name;
  next();
});

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

app.use(express.static(path.join(process.cwd(), '/public')));

app.use(authRouter);

const adminHbs = exphbs.create({
  extname: '.hbs',
  layoutsDir: path.join(process.cwd(), '/src/vendor/admin/views/layouts'),
  defaultLayout: 'adminMain',
  partialsDir: path.join(process.cwd(), '/src/vendor/admin/views/partials'),
});
app.engine('adminhbs', adminHbs.engine);

app.use('/manager', (req, res, next) => {
  res.app.set('view engine', 'adminhbs');
  res.app.set('views', path.join(process.cwd(), '/src/vendor/admin/views'));
  next();
}, adminRouter);

// Make sure default view engine and views are reset after /manager routes
app.use((req, res, next) => {
  res.app.set('view engine', 'hbs');
  res.app.set('views', path.join(process.cwd(), '/src/templates'));
  next();
});

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
