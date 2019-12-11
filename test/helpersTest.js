const { assert } = require('chai');
const bcrypt = require('bcrypt');
const { generateRandomString, getUserByEmail, urlsForUser } = require('../helpers.js');

const userState = getUserByEmail;

/* const testUsers = {
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
}; */

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

/* describe('getUserByEmail', () => {
  it('should return a user with valid email', () => {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput);
  });

  it('should return undefined', () => {
    const user = getUserByEmail("user@example.com");
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});
 */
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


describe('userState with hashed passwords', () => {
  it('should return a new 6 length string id when registering a valid new user', () => {
    const newUserKey = userState('test@gmail.com', '214124', userDatabase, true);
    assert.isString(newUserKey);
    assert.equal(newUserKey.length, 6);
  });

  it('should return false registering an invalid new user email', () => {
    const newUserKey = userState('', '214124', userDatabase, true);
    assert.isFalse(newUserKey);
  });

  it('should return false registering an invalid new user password', () => {
    const newUserKey = userState('test@gmail.com', '', userDatabase, true);
    assert.isFalse(newUserKey);
  });

  it('should return undefined if logging in with a invalid user', () => {
    const user = userState('test@gmail.com', '12312', userDatabase);
    assert.isUndefined(user);
  });
  
  it('should return user if valid user logs in and proper keys are provided', () => {
    const user = userState('user@example.com', 'purple-monkey-dinosaur', userDatabase);
    assert.equal(user, 'userRandomID');
  });
});

describe('urlsForUsers', () => {
  it('should return an object with a valid user', () => {
    const id = `aJ48lW`;
    const userUrls = urlsForUser(id, urlDatabase);
    assert.isObject(userUrls);
  });
  
  it('should contain urls of only that user', () => {
    const id = `aJ48lW`;
    const userUrls = urlsForUser(id, urlDatabase);
    const validUrls = {
      b6UTxQ: "https://www.tsn.ca",
      b6oPOQ: "https://www.poop.ca",
      i3BoGr: "https://www.google.ca",
    };
    
    assert.deepEqual(userUrls, validUrls);
  });

  it('should return an empty object with a invalid user', () => {
    const id = `aJ48W`;
    const userUrls = urlsForUser(id, urlDatabase);
    assert.isEmpty(userUrls);
  });
});