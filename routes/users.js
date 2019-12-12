const userRouter = require('express').Router();
const { userState } = require('../helpers');
const { urlDatabase, users } = require('../database');
const { generateRandomString, getTimestamp } = require('../helpers');

userRouter.get('/register', (req, res) => {

  const userObj = req.session ? users[req.session.userID] : undefined;
  
  if (userObj) {
    res.redirect(301, '/urls');
  }

  let templateVariables = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: userObj,
  };

  res.render(`register`, templateVariables);
  
});

userRouter.get('/login', (req, res) => {

  const userObj = req.session ? users[req.session.userID] : undefined;
  
  if (userObj) {
    res.redirect(301, '/urls');
  }

  let templateVariables = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: userObj,
  };

  res.render(`login`, templateVariables);

});

userRouter.post('/login', (req, res) => {
 
  const email = req.body.email;
  const password = req.body.password;
  const userID = userState(email, password, users);
 
  if (userID) {

    req.session.userID = userID;
    res.redirect(301, '/urls');

  } else {
    res.redirect(403, `/login`);
  }

});

userRouter.post('/logout', (req, res) => {

  req.session = null;
  res.redirect(301, '/login');

});

userRouter.post('/register', (req, res) => {
 
  const email = req.body.email;
  const password = req.body.password;
  const userID = userState(email, password, users, true);

  if (userID) {

    req.session.userID = userID;
    res.redirect(301, '/urls');
  
  } else {
    res.redirect(400, '/register');
  }

});

userRouter.get('/u/:shortURL', (req, res) => {
  
  const shortURL = req.params.shortURL;

  if (urlDatabase[shortURL]) {
  
    const longURL = urlDatabase[shortURL].longURL;
    
    // Increase visits
    urlDatabase[shortURL].count += 1;

    if (!urlDatabase[shortURL].uniqueVisits[req.session.userID]) {
      const newUniqueVisitor = {
        id: req.session.userID ? req.session.userID : generateRandomString(),
        time: getTimestamp(),
      }
      urlDatabase[shortURL].uniqueVisits[newUniqueVisitor.id] = newUniqueVisitor;
    }
  
    res.redirect(longURL);
  
  } else {
    res.status(404).send('NOT FOUND');
  }

});

module.exports = userRouter;