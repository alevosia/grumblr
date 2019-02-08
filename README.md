# Grumblr

## NoSQL project for SFLECT1

### Project website that mimics the website of Tumblr.com

Watch it in action [here](https://www.youtube.com/watch?v=H3-ICZAQ_hI)!
---

## Dependencies
* bcrypt
* body-parser
* connect-flash
* connect-mongo
* ejs
* express-session
* express
* mongoose
* morgan
* multer
* passport
* passport-local

## devDependency

* nodemon

---

<br/>

## Core Features Required

* Login either via email with email and password (5%)
* or via Facebook (optional +5%)
* CRUD (Create, Read, Update, and Delete) for posting a blog entry. The Blog entry can contain
  images, text, quotes, and links (40%)
* Able to follow different users (5%)
* Have a timeline of the post of the users you are following (30%) Timezone must be in UTC
* Able to comment on posts (10%)
* Full Text searching (10%)

### Total Grade of 105%

---

<br/>

## Notes

* Any technology or framework except for the persistence layer.
  The persistence layer should be MongoDB

* You can use MySQL/PostgreSQL to store user information but the blog posts
  should be stored, and saved on a MongoDB instance

### How To Use:

* Download [npm](https://www.npmjs.com/get-npm) <br/>
* This project also requires MongoDB locally to use the database.
* Make sure npm commands are global. Set it in your system's environment variables.

1. Navigate to the folder directory then type 'npm install'
1. Start the mongodb server by typing 'mongod'
1. Type 'npm start'
1. Type 'localhost:8080' in the browser url
