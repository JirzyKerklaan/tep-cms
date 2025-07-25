import express from 'express';
import * as exphbs from 'express-handlebars';
import path from 'path';
import registerComponents from './helpers/registerComponents';
import routes from './routes/routes';

const app = express();
const PORT = 3000;

const hbs = exphbs.create({
  extname: '.hbs',
  layoutsDir: path.join(process.cwd(), '/src/templates/layouts'),
  defaultLayout: 'main',
  partialsDir: path.join(process.cwd(), '/src/templates/partials'),
  helpers: {}
});

registerComponents(hbs);

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(process.cwd(), '/src/templates'));

app.use(express.static(path.join(process.cwd(), '/public')));

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
