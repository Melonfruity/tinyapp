const { assert } = require('chai');
const bcrypt = require('bcrypt')
const { getUserByEmail, generateRandomString, userState, urlsForUser } = require('../helpers.js');

const testUsers = {
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

const userDatabase = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
};

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  b6Us2Q: { longURL: "https://www.facebook.com", userID: "user2RandomID" },
  b6oPOQ: { longURL: "https://www.poop.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

describe('getUserByEmail', () => {
  it('should return a user with valid email', () => {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput);
  });

  it('should return undefined', () => {
    const user = getUserByEmail("user@example.com")
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});

describe('generateRandomString', () => {
  it('should return a string', () => {
    const randomString = generateRandomString();
    assert.isString(randomString);
  });

  it('should return a string of length 6', () => {
    const randomString = generateRandomString();
    assert.equal(randomString.length, 6);
  });
});
