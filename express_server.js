const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PORT = 8000;

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  let randString = [];
  for (let i = 0; i < 6; i ++) {
    let charOrNum = Math.round(Math.random());
    let randomChar = String.fromCharCode(Math.round(Math.random()) ? Math.round(Math.random() * 26) + 65 : Math.round(Math.random() * 26) + 97);
    let randomNum = Math.round(Math.random() * 9);
    charOrNum ? randString.push(randomChar) : randString.push(randomNum); 
  }
  return randString.join('')
}

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.get('/urls', (req, res) => {
  let templateVariables = {
    urls: urlDatabase
  }
  res.render('urls_index', templateVariables);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get('/urls/:shortURL', (req, res) => {
  let templateVariables = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  }
  res.render(`urls_show`, templateVariables);
})

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.post('/urls', (req, res) => {
  console.log(req.body);
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  res.send(`${longURL} converted to ${shortURL}`);
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

// curl -i http://localhost:8000/hello