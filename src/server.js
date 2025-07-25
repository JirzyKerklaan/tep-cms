// server.js
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

// Import your helper that registers components
const registerComponents = require('./helpers/registerComponents');

const app = express();
const PORT = 3000;

// Create and configure Handlebars instance
const hbs = exphbs.create({
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'templates/layouts'),
  defaultLayout: 'main',
  partialsDir: path.join(__dirname, 'templates/partials'), // if needed
  helpers: {} // optional: you can add custom helpers here
});

// Register blocks/components from /src/blocks
registerComponents(hbs); // <- this now works!

// Setup Handlebars with Express
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'templates'));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Use routes
const routes = require('./routes/routes');
app.use(routes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
