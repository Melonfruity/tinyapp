const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const _ = require('lodash');
const { urlsForUser, userState, generateRandomString } = require('./helpers');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080;

const getDate = () => {
  let today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;
  return today;
};

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", date: getDate(), count: 0, uniqueVisits: [], userID: "aJ48lW" },
  b6Us2Q: { longURL: "https://www.facebook.com", date: getDate(), count: 0, uniqueVisits: [], userID: "user2RandomID" },
  b6oPOQ: { longURL: "https://www.poop.ca", date: getDate(), count: 0, uniqueVisits: [], userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", date: getDate(), count: 0, uniqueVisits: [], userID: "aJ48lW" }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  },
  "aJ48lW": {
    id: "aJ48lW",
    email: "user3@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
};

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['userID']
}));

app.set('view engine', 'ejs');

app.get('/urls', (req, res) => {

  const cookie = req.session ? users[req.session.userID] : undefined;

  if (cookie) {
    const userID = cookie.id;
    const urls = urlsForUser(userID, urlDatabase);

    let templateVariables = {
      urls: urls,
      user: cookie,
    };
    
    res.render('urls_index', templateVariables);
  } else {
    res.redirect(301, '/login');
  }
});

app.get('/urls/new', (req, res) => {

  const cookie = req.session ? users[req.session.userID] : undefined;
  if (cookie) {  
    let templateVariables = {
      user: cookie,
    };
    
    res.render("urls_new", templateVariables);
  } else {
    res.redirect(301, '/login');
  }

});

app.get('/urls/:shortURL', (req, res) => {

  const shortURL = req.params.shortURL;
  
  
  const cookie = req.session ? users[req.session.userID] : undefined;
  
  if (cookie) {
    const userID = cookie.id;

    const url = urlsForUser(userID, urlDatabase)[shortURL];

    if(url) {
      let templateVariables = {
        shortURL: shortURL,
        url: url,
        user: cookie,
      }
      res.render('urls_show', templateVariables);
    } else {
      res.status(401).send('Unauthorized Access');
    }

  } else {
    res.redirect(301, '/urls');
  }

});

app.get('/u/:shortURL', (req, res) => {
  
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;

  urlDatabase[shortURL].count += 1;
  if (!urlDatabase[shortURL].uniqueVisits.includes(req.session.userID)) {
    urlDatabase[shortURL].uniqueVisits.push(req.session.userID);
  }

  res.redirect(longURL);
});

app.get('/register', (req, res) => {
 
  let templateVariables = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: req.sessions ? users[req.session.userID] : undefined,
  };
  res.render(`register`, templateVariables);
});

app.get('/login', (req, res) => {
  let templateVariables = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: req.sessions ? users[req.session.userID] : undefined,
  };

  res.render(`login`, templateVariables);
});

// New URL
app.post('/urls', (req, res) => {
  
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();

  const userID = req.session.userID;
  
  urlDatabase[shortURL] = {
    longURL: longURL, 
    date: getDate(),
    count: 0,
    uniqueVisits: 0,
    userID: userID};

  res
    .redirect('/urls');

});

// Edit URL
app.post('/urls/:shortURL', (req, res) => {  

  const longURL = req.body.longURL;
  const shortURL = req.params.shortURL;
  const cookie = req.session ? req.session : undefined;
  const userID = cookie.userID;

  if(urlDatabase[shortURL].userID === userID) {
    const newURL = {
      ...urlDatabase[shortURL],
      longURL: longURL.substring(0,7) === 'http://' ? longURL : 'http://'.concat(longURL),
    };
    urlDatabase[shortURL] = newURL;
    res.redirect(`/urls/${shortURL}`);  
  } else {
    res.redirect(400, `/urls`);
  }
  
});

// Delete URL
app.post('/urls/:shortURL/delete', (req, res) => {

  const cookie = req.session ? req.session : undefined;
  const shortURL = req.params.shortURL;

  if (cookie) {
    if (urlDatabase[shortURL].userID === cookie.userID) {
      delete urlDatabase[shortURL];
      res.redirect('/urls');
    } else {
      res.redirect('/urls');
    }
  } else {
    res.redirect(301, '/login');
  }

});

app.post('/login', (req, res) => {
 
  const email = req.body.email;
  const password = req.body.password;
  const userID = userState(email, password, users);
 
  if (userID) {
    req.session.userID = userID;
    res.redirect(301, '/urls');
  } else {
    res
      .redirect(403, `/login`);
  }
});

app.post('/logout', (req, res) => {
  req.session.userID = undefined;
  res.redirect(301, '/urls');
});

app.post('/register', (req, res) => {
 
  const email = req.body.email;
  const password = req.body.password;
  const userID = userState(email, password, users, true);

  if (userID) {
    req.session.userID = userID;
    res.redirect(301, '/urls');
  } else {
    res
      .redirect(400, '/register');
  }

});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});