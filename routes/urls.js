const urlsRouter = require('express').Router();
const { urlsForUser, getDate, generateRandomString } = require('../helpers');
const { urlDatabase, users } = require('../database');

urlsRouter.get('/', (req, res) => {

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

urlsRouter.get('/new', (req, res) => {

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

urlsRouter.get('/:shortURL', (req, res) => {

  const shortURL = req.params.shortURL;
  const cookie = req.session ? users[req.session.userID] : undefined;
  
  if (cookie) {
    
    const userID = cookie.id;
    const url = urlsForUser(userID, urlDatabase)[shortURL];

    if (url) {
      
      let templateVariables = {
        shortURL: shortURL,
        url: url,
        user: cookie,
      };
      
      res.render('urls_show', templateVariables);
    
    } else {
      res.status(401).send('Unauthorized Access');
    }

  } else {
    res.redirect(301, '/urls');
  }

});


// New URL
urlsRouter.post('/', (req, res) => {
  
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  const userID = req.session.userID;

  if (userID) {

    urlDatabase[shortURL] = {
      longURL: longURL,
      date: getDate(),
      count: 0,
      uniqueVisits: 0,
      userID: userID};
  
    res.redirect('/urls');
  }

  res.status(401).send('Unauthorized please log in if you haven\'t already');

});

// Edit URL
urlsRouter.put('/:shortURL', (req, res) => {

  const longURL = req.body.longURL;
  const shortURL = req.params.shortURL;
  const cookie = req.session ? req.session : undefined;
  const userID = cookie.userID;

  if (urlDatabase[shortURL].userID === userID) {

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
urlsRouter.delete('/:shortURL', (req, res) => {

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

module.exports = urlsRouter;