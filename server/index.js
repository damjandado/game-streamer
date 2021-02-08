require('dotenv').config();
const { promises: fs } = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const axios = require('axios');

const keys = require('./config/keys');
const Game = require('./models/Game');
require('./services/passport-social');
require('./services/passport-local');
const { twitchClientID } = require('./config/keys');
const twitchSvc = require('./services/twitch');
const { remove_duplicates } = require('./utils/utils.js');

mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});
const db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
});

exports.twitchData = {
    games: require('../games.json'),
};

const bootstrap = async () => {
    console.log('⏳ bootstrapping app');
    try {
        const existingGamesPromise = Game.find().lean();
        const accessToken = await twitchSvc.getToken();
        const url = 'https://api.twitch.tv/helix/games/top';
        const config = {
            url,
            method: 'get',
            params: { first: 100 },
            headers: {
                'Client-ID': twitchClientID,
                Authorization: `Bearer ${accessToken}`,
            },
        };
        console.time('get new games');
        let newGames = [];
        const iterator = Array(+process.env.TWITCH_ITER).keys();
        for (let _ of iterator) {
            const axiosRes = await axios(config).catch((_) => null);
            if (!axiosRes?.data) continue;
            const { data, pagination } = axiosRes.data;
            config.params.after = pagination.cursor;
            newGames = newGames.concat(data);
        }
        console.timeEnd('get new games');
        console.log('new games fetched', newGames.length);
        const existingGames = remove_duplicates(await existingGamesPromise);
        const existingGamesIds = existingGames.map((g) => g.id);
        newGames = newGames.filter((g) => !existingGamesIds.includes(g.id));
        console.log('new games filtered', newGames.length);
        await Game.insertMany(newGames);
        const games = newGames.concat(existingGames);
        this.twitchData.games = games;
        fs.writeFile('games.json', JSON.stringify(games));
        console.log('🔋 bootstrapping done');
    } catch (err) {
        console.log('💥 bootstrapping error', err);
    }
};

bootstrap();

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
    };
    console.log(logObj);
    next();
});

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONT_URL);
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
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
