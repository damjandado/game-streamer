const mongoose = require('mongoose');
const User = mongoose.model('users');
const Game = mongoose.model('games');

const { fetchGames, fetchStreamsByUsers, fetchStreamsByGames, processQuery } = require('./twitchApiController.js');

exports.games = async (req, res) => {
    const appUser = await User.findById(req.user.id).exec();
    let { games } = appUser.visits;
    let listOfGames = remove_duplicates(games);
    listOfGames = listOfGames.map((item) => encodeURI(item));
    const gamesInstance = new Game({ games: await fetchGames(listOfGames) });
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
        const existingGame = games.find(g => g.id === game_id);
        if (existingGame) {
            existingGame.count = (existingGame.count || 0) + 1;
        } else {
            game.count = 0;
            games.push(game);
        }
    }
    if (user_id) {
        const existingTwitchUser = users.find(u => u.id === user_id);
        if (existingTwitchUser) {
            existingTwitchUser.count = (existingTwitchUser.count || 0) + 1;
        } else {
            twitchUser.count = 0;
            users.push(twitchUser);
        }
    }
    appUser.save();
    res.send(req.body);
};

exports.dashboard = async (req, res) => {
    res.sendtatus(200);
};
