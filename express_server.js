const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const methodOverride = require('method-override')
const urlsRouter = require('./routes/urls');
const usersRouter = require('./routes/users');
const PORT = 8080;

const app = express();

// Middleware
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['userID'],
}));

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));

// ejs views
app.set('view engine', 'ejs');

// Routes
app.use('/', usersRouter);
app.use('/urls', urlsRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});