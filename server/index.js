require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const path = require('path');
const axios = require('axios');
const qs = require('qs');

const keys = require('./config/keys');
const User = require('./models/User');
const Game = require('./models/Game');
const Token = require('./models/Token');
require('./services/passport-social');
require('./services/passport-local');
const { twitchClientID } = require('./config/keys');
const twitchSvc = require('./services/twitch');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
});

exports.twitchData = {
    games: [],
};

const populate = async () => {
    try {
        console.time('get token');
        const accessToken = await twitchSvc.getToken();
        console.timeEnd('get token');
        const existingGamesPromise = Game.find().lean();
        const url = 'https://api.twitch.tv/helix/games/top';
        const config = {
            url,
            method: 'get',
            params: { first: 100 },
            headers: { 'Client-ID': twitchClientID, Authorization: `Bearer ${accessToken}` },
        };
        console.time();
        let newGames = [];
        const iterator = Array(0).keys();
        for (let _ of iterator) {
            const axiosRes = await axios(config).catch(_ => ({}));
            const { data, pagination } = axiosRes.data;
            console.log(_, pagination.cursor);
            if (!data) continue;
            config.params.after = pagination.cursor;
            newGames = newGames.concat(data);
        }
        console.timeEnd();
        const existingGames = await existingGamesPromise;
        const existingGamesIds = existingGames.map(g => g.id);
        console.log(newGames.length);
        console.time('filter new games');
        newGames = newGames.filter(g => !existingGamesIds.includes(g.id));
        console.log(newGames.length);
        console.timeEnd('filter new games');
        console.time('insert new games');
        await Game.insertMany(newGames);
        this.twitchData.games = newGames.concat(existingGames);
        console.timeEnd('insert new games');
    } catch (err) {
        console.log('Error populating database', err);
    }
}

populate();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//use sessions for tracking logins
app.use(
    cookieSession({
        secret: 'work hard',
        resave: true,
        saveUninitialized: false,
        store: new MongoStore({
            mongooseConnection: db,
        }),
        maxAge: 0.05 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey],
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    const logObj = {
        url: req.originalUrl,
        user: req.user?.name,
        cookie: req.headers.cookie,
    }
    console.log(logObj);
    next();
});

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONT_URL);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

require('./routes/socialRoutes')(app);
require('./routes/localRoutes')(app);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5020;
app.listen(PORT, () => {
    console.log('GameStreamer server 🏃‍♂️ on', PORT);
});
