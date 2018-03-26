const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const { secret } = require("./config/keys");
const MongoStore = require("connect-mongo")(session);
mongoose.Promise = global.Promise;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = mongoose.connection;

mongoose.connect(
  "mongodb://localhost:27017/sakai",
  { useMongoClient: true },
  err => {
    if (err) console.log(err);
    else console.log("db connection successful");
  }
);
require("./models");

app.use(
  session({
    resave: true,
    secret,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: db
    })
  })
);

app.set("view engine", "pug");
app.set("views", "templates");
app.use(express.static("./public"));

app.use((req, res, next) => {
  res.locals.user = req.session.email;
  return next();
});

require("./routes")(app);

app.use((req, res, next) => {
  const err = new Error("sorry, not found");
  err.status = 404;
  return next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  console.log(err);
  return res.render("error", { title: "Error", message: err.message });
});

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log("server is running on PORT", port);
});
