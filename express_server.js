const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const methodOverride = require('method-override')
const urlsRouter = require('./routes/urls');
const usersRouter = require('./routes/users');
const app = express();
const PORT = 8080;

app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['userID']
}));

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.use('/', usersRouter);
app.use('/urls', urlsRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});