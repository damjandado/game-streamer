const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const bodyParser = require("body-parser");
const path = require("path");
const keys = require("./config/keys");
require("./models/User");
require("./models/Game");
require("./services/passport-social");
require("./services/passport-local");

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });
const db = mongoose.connection;

//handle mongo error
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  // we're connected!
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//use sessions for tracking logins
app.use(
  cookieSession({
    secret: "work hard",
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    }),
    maxAge: 0.05 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

require("./routes/socialRoutes")(app);
require("./routes/localRoutes")(app);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5020;
app.listen(PORT);
