const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Game = require('../models/Game');
const twitchSvc = require('../services/twitch');
const userSvc = require('../services/user');
const { twitchData } = require('../index');

exports.games = async (req, res) => {
    const appUser = await User.findById(req.user.id).exec();
    let { games } = appUser.visits;
    let listOfGames = remove_duplicates(games);
    listOfGames = listOfGames.map((item) => encodeURI(item));
    const gamesInstance = new Game({
        games: await twitchSvc.fetchGames(listOfGames),
    });
    console.log(gamesInstance);
    try {
        const lg = await gamesInstance.save();
        res.send(lg);
    } catch (err) {
        res.status(422).send(err);
    }
};

exports.users = async (req, res) => {
    const obj = req.body.stream || req.body;
    const { game_id, game_name, user_id, user_name } = obj;
    const appUser = await User.findById(req.user.id);
    const game = { id: game_id, name: game_name };
    const twitchUser = { id: user_id, name: user_name };
    const { games, users } = appUser.visits;
    if (game_id) {
        const existingGame = games.find((g) => g.id === game_id);
        if (existingGame) {
            existingGame.count = (existingGame.count || 0) + 1;
        } else {
            game.count = 1;
            games.push(game);
        }
    }
    if (user_id) {
        const existingTwitchUser = users.find((u) => u.id === user_id);
        if (existingTwitchUser) {
            existingTwitchUser.count = (existingTwitchUser.count || 0) + 1;
        } else {
            twitchUser.count = 1;
            users.push(twitchUser);
        }
    }
    appUser.save();
    res.send(req.body);
};

exports.dashboard = async (req, res) => {
    res.sendtatus(200);
};

exports.currentUser = async (req, res) => {
    const currentTime = new Date().getTime();
    if (req.user) {
        if (req.user.tokenExp < currentTime) {
            req.logout();
            return res.send(req.user);
        }
    }
    let twAccessToken = await twitchSvc.getToken(req.user?.id);
    let recommendation;
    if (req.user) {
        recommendation = userSvc.getUserRecommendations(req.user);
    }
    res.send({ user: req.user, recommendation, twAccessToken, twitchData });
};

exports.currentUserDb = async (req, res) => {
    // const user = await User.findOne({ _id: req.user.id });
    console.log('req.user: ', req.user);
    res.send(req.user);
};

exports.checkEmail = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.send({ valid: true });
    }
    return res.send({ valid: false });
};

exports.checkUsername = async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
        return res.send({ valid: true });
    }
    return res.send({ valid: false });
};

exports.changePass = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!req.body.email) {
        return;
    }
    const tempRemoved = await User.findOneAndRemove({ email: req.body.email });
    user.password = req.body.password;
    user.psw = req.body.psw;
    const { email, username, visits, password, psw } = user;
    const userAgain = { email, username, visits, password, psw };
    console.log('User found in DB:', user);
    console.log('-------------------');
    await User.create(userAgain, (err, user) => {
        if (err) {
            return res.send({ valid: false });
        }
        return res.send({ valid: true });
    });
};

exports.comparePass = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if (err) return console.log(err);
        res.send({ isMatch });
    });
};
