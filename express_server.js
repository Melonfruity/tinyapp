const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8000;

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const generateRandomString = () => {

  let randString = [];

  for (let i = 0; i < 6; i ++) {

    let charOrNum = Math.round(Math.random());
    let randomChar = String.fromCharCode(Math.round(Math.random()) ? Math.round(Math.random() * 26) + 65 : Math.round(Math.random() * 26) + 97);
    let randomNum = Math.round(Math.random() * 9);
    charOrNum ? randString.push(randomChar) : randString.push(randomNum);

  }

  return randString.join('');

};

const userHelper = (email, password, register) => {
  
  const userKeys = Object.keys(users);
  const userKey = userKeys.filter(key => users[key].email === email && users[key].password === password);
  
  if(register){
    if (email.length === 0 || password.length === 0 || userKey.length > 0) {
      return false;
    } else {
      const id = generateRandomString();
      users[id] = {
        id: id,
        email: email,
        password: password,
      }
      console.log(users);
      return id;
    }
  } else {
    return userKey[0];
  }

};

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set('view engine', 'ejs');

app.get('/urls', (req, res) => {
  
  let templateVariables = {
    urls: urlDatabase,
    user: req.cookies ? users[req.cookies["userID"]] : undefined,
  };
  
  res.render('urls_index', templateVariables);

});

app.get("/urls/new", (req, res) => {
  
  let templateVariables = {
    user: req.cookies ? users[req.cookies["userID"]] : undefined,
  };
  
  res.render("urls_new", templateVariables);

});

app.get('/urls/:shortURL', (req, res) => {

  // Bug here where short URL works but long URL doesn't
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];

  let templateVariables = {
    shortURL: shortURL,
    longURL: longURL,
    user: req.cookies ? users[req.cookies["userID"]] : undefined,
  };

  res.render(`urls_show`, templateVariables);
});

app.get('/u/:shortURL', (req, res) => {

  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);

});

app.get('/register', (req, res) => {
 
  let templateVariables = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: req.cookies ? users[req.cookies["userID"]] : undefined,
  };
  res.render(`register`, templateVariables);
});

app.get('/login', (req, res) => {
  let templateVariables = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: req.cookies ? users[req.cookies["userID"]] : undefined,
  };

  res.render(`login`, templateVariables);
});

app.post('/urls', (req, res) => {
  
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  
  urlDatabase[shortURL] = longURL;
  res
    .redirect('/urls');

});

app.post('/urls/:shortURL', (req, res) => {
 
  const longURL = req.body.longURL;
  const shortURL = req.params.shortURL;
 
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);

});

app.post('/urls/:shortURL/delete', (req, res) => {
 
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');

});

app.post('/login', (req, res) => {
 
  const email = req.body.email;
  const password = req.body.password;
  const userID = userHelper(email, password);
 
  if (userID) {
    res
      .cookie('userID', `${userID}`)
      .redirect(301, '/urls');
  } else {
    res
      .redirect(403, `/login`);
  }
});

app.post('/logout', (req, res) => {
  
  res
    .clearCookie('userID')
    .redirect(301, '/urls');
});

app.post('/register', (req, res) => {
 
  const email = req.body.email;
  const password = req.body.password;
  const userID = userHelper(email, password, true);

  console.log(email, password, userID);
  if (userID) {
    res
      .cookie('userID', `${userID}`)
      .redirect(301, '/urls');
  } else {
    res.status(400).send(`Invalid credentials`);
  }

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});