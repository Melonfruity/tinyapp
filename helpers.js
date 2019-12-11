const bcrypt = require('bcrypt');
/*
const getUserByEmail = function(email, database) {
  // lookup magic...
  let user;
  for (let key in database) {
    if (database[key].email === email) {
      user = key;
    }
  }
  return user;
}; */

const urlsForUser = (id, urlDatabase) => {
  let userURLs = {};
  for (let key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      userURLs[key] = urlDatabase[key].longURL;
    }
  }
  return userURLs;
};

const getUserByEmail = (email, password, userDatabase, register) => {
  
  const userKeys = Object.keys(userDatabase);
  const comparePasswords = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);
  const userKey = userKeys.filter(key => userDatabase[key].email === email && comparePasswords(password, userDatabase[key].password));
  
  // If you are trying to register a new user
  if (register) {
    if (email.length === 0 || password.length === 0 || userKey.length > 0) {
      return false;
    } else {
      const id = generateRandomString();
      userDatabase[id] = {
        id: id,
        email: email,
        password: password,
      };
      return id;
    }
  } else {
    // return the id of a matched user
    return userKey[0];
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

const userState = getUserByEmail;

module.exports = {
  userState,
  urlsForUser,
  generateRandomString
};