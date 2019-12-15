const userRouter = require('express').Router();
const { userState, generateRandomString, getTimestamp } = require('../helpers');
const { urlDatabase, users } = require('../database');

userRouter.get('/register', (req, res) => {
  
  req.session = null;

  const userObj = req.session ? users[req.session.userID] : undefined;

  if (userObj) {
    res.redirect(301, '/urls');
  } else {
    let templateVariables = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL],
      user: userObj,
    };
  
    res.render(`register`, templateVariables);
  }
  
});

userRouter.get('/', (req, res) => {
  res.redirect(301, '/urls');
})

userRouter.get('/login', (req, res) => {

  req.session = null;

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
    req.session.error = 406;
    res.redirect(301, '/error');
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
    req.session.error = 400;
    res.redirect(301, '/error');
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
    req.session.error = 404;
    res.redirect(301, '/error');
  }

});

userRouter.get('/error', (req, res) => {
  
  // error message and header
  const error = req.session.error;

  const userObj = req.session ? users[req.session.userID] : undefined;

  const templateVariables = {
    user: userObj,
    statusCode: `Error: ${error}`,
  };

  res.statusCode = error;
  res.render('400', templateVariables);
});

module.exports = userRouter;