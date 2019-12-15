# tinyAPP

Simple url shortener application. Urls are shortened to a random 6 character alphanumeric string.

## Installation

```sh
$ npm install
```
## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Usage

This application uses by default localhost at PORT 8080 (http://localhost:8080/urls).

```sh
$ npm start
```

A user must be logged in to do the following:

1. Create a short url
2. Edit a short url they created
3. Delete a short url they created

A url can be accessed by typing adding the route /u/:shortURL

# Screenshots

!["Screenshot of URLs page"](https://github.com/Melonfruity/tinyapp/blob/master/docs/urls.png)
!["Screenshot of ShortURLs edit page"](https://github.com/Melonfruity/tinyapp/blob/master/docs/shortURLedit.png)
!["Screenshot of ShortURLs edit page"](https://github.com/Melonfruity/tinyapp/blob/master/docs/tinyapptest.gif)