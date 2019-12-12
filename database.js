const bcrypt = require('bcrypt');
const { getDate } = require('./helpers');

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", date: getDate(), count: 0, uniqueVisits: [], userID: "aJ48lW" },
  b6Us2Q: { longURL: "https://www.facebook.com", date: getDate(), count: 0, uniqueVisits: [], userID: "user2RandomID" },
  b6oPOQ: { longURL: "https://www.poop.ca", date: getDate(), count: 0, uniqueVisits: [], userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", date: getDate(), count: 0, uniqueVisits: [], userID: "aJ48lW" },
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10),
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10),
  },
  "aJ48lW": {
    id: "aJ48lW",
    email: "user3@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10),
  }
};

module.exports = {
  urlDatabase,
  users
}