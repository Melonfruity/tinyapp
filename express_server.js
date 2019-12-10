const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8000;

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  b6Us2Q: { longURL: "https://www.facebook.com", userID: "user2RandomID" },
  b6oPOQ: { longURL: "https://www.poop.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
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
  },
  "aJ48lW": {
    id: "aJ48lW",
    email: "user3@example.com",
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
      return id;
    }
  } else {
    return userKey[0];
  }

};

const urlsForUser = (id) => {
  let userURLs = {}
  for (let key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      userURLs[key] = urlDatabase[key].longURL
    } 
  }
  console.log(userURLs);
  return userURLs;
}

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set('view engine', 'ejs');

app.get('/urls', (req, res) => {
  
  const cookie = req.cookies ? users[req.cookies["userID"]] : undefined;
    
  if (cookie) {
    const userID = cookie.id;
    const urls = urlsForUser(userID);
    console.log(urls);
    let templateVariables = {
      urls: urls,
      user: cookie,
    };
    
    res.render('urls_index', templateVariables);
  } else {
    res.redirect(301, '/login');
  }
});

// Changed urls => url because for some reason it keeps calling /urls/:shortURL even though /urls/new is before
app.get('/url/new', (req, res) => {

  const cookies = req.cookies ? users[req.cookies["userID"]] : undefined;
  if (!cookies) {
    res.redirect(301, '/login');
  }

  let templateVariables = {
    user: cookies,
  };
  
  res.render("urls_new", templateVariables);

});

app.get('/urls/:shortURL', (req, res) => {

  const shortURL = req.params.shortURL;
  const cookie = req.cookies ? users[req.cookies["userID"]] : undefined;
    
  if (cookie) {
    const userID = cookie.id;
    const longURL = urlsForUser(userID)[shortURL];
    
    let templateVariables = {
      shortURL: shortURL,
      longURL: longURL,
      user: cookie,
    };
    
    res.render('urls_show', templateVariables);

  } else {
    res.redirect(301, '/login');
  }

});

app.get('/u/:shortURL', (req, res) => {
  
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
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

// New URL
app.post('/urls', (req, res) => {
  
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();

  const userID = req.cookies["userID"];
  
  urlDatabase[shortURL] = {longURL: longURL, userID: userID};
  res
    .redirect('/urls');

});

// Edit URL
app.post('/urls/:shortURL', (req, res) => {
/* 
  const shortURL = req.params.shortURL;
  const cookie = req.cookies ? users[req.cookies["userID"]] : undefined;
    
  if (cookie) {
    const userID = cookie.id;
    const longURL = urlsForUser(userID)[shortURL];
    
    let templateVariables = {
      shortURL: shortURL,
      longURL: longURL,
      user: cookie,
    };
    
    res.render('urls_show', templateVariables);

  } else {
    res.redirect(301, '/login');
  }

 */  console.log(`post url shorturl`);
  const longURL = req.body.longURL;
  const shortURL = req.params.shortURL;
 
  urlDatabase[shortURL] = {
    ...urlDatabase[shortURL], 
    longURL: longURL};

  res.redirect(`/urls/${shortURL}`);

});

app.post('/urls/:shortURL/delete', (req, res) => {
  
  const cookie = req.cookies ? users[req.cookies["userID"]] : undefined;
  const shortURL = req.params.shortURL;

  if (cookie) {

    const userID = cookie.id;
      if (urlDatabase[shortURL].userID === userID) {
        delete urlDatabase[shortURL];
        res.redirect('/urls');
      } else {
        res.status(401).end();
      }
  } else {
    res.redirect(301, '/login');
  }

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