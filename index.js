const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
require('./models/User');
require('./models/Game');
require('./services/passport');
require('./services/passport-twitch');
require('./services/passport-local');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI);
const db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

const app = express();
require('./services/passportab')(app, passport);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//use sessions for tracking logins
app.use(
  cookieSession({
    secret: 'work hard',
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

require('./routes/authRoutes')(app);
require('./routes/userRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  // Express will serve up production assets
  // like our main.js file, or main.css file!
  app.use(express.static('client/build'));

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

/*app.get('/', (req, res) => {
  res.send({ hi: 'there'});
})*/

const PORT = process.env.PORT || 5020;
app.listen(PORT);
