require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOveride = require('method-override');
const session = require('express-session');
const { flash }  = require('express-flash-message');

const connectDB = require('./server/config/db');

const app = express();
const port = 7000 || process.env.PORT;

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOveride('_method'));

//Static Files
app.use(express.static("public"));

// Express Session
app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      }
    })
  );
  
  // Flash Messages
  app.use(flash({ sessionKeyName: 'flashMessage' }));

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./server/routes/student'));

// Handle 404
app.get('*', (res, req) => {
    res.status(404).render('404');
})

app.listen(port, () => {
    console.log(`Server is on ${port}`);
})