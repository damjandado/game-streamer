const axios = require('axios');
const qs = require('qs');
const { promises: fs } = require('fs');

const { twitchClientID, twitchClientSecret } = require('../config/keys');
const Token = require('../models/Token');

const requireF = (modulePath) => {
    try {
        return require(modulePath);
    } catch (err) {
        return null;
    }
};

let token = requireF('../../token.json');

exports.getToken = async (userId) => {
    if (!shouldRenew(token)) {
        return token.accessToken;
    }
    if (userId) {
        token = await Token.findOne({ userId, source: 'twitch' });
    } else {
        const tokens = await Token.find({ source: 'twitch' }).sort({ id: -1 }).limit(1);
        token = tokens.pop();
    }
    if (!shouldRenew(token)) {
        fs.writeFile('token.json', JSON.stringify(token));
        return token.accessToken;
    }
    const url = 'https://id.twitch.tv/oauth2/token';
    const date = new Date();
    const newToken = await axios({
        url,
        method: 'post',
        headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        data: qs.stringify({
            grant_type: 'refresh_token',
            refresh_token: token.refreshToken,
            client_id: twitchClientID,
            client_secret: twitchClientSecret,
        }),
    })
        .then((res) => res.data)
        .catch((err) => {
            return err.response.data;
        });
    const { access_token, refresh_token, scope, expires_in, error } = newToken;
    if (error) {
        console.log('Error refreshing token:', error);
    } else {
        console.log('new token:', newToken);
        token.accessToken = access_token;
        token.refreshToken = refresh_token;
        token.expiresAt = new Date(date.getTime() + expires_in * 1000);
        token.save();
        fs.writeFile('token.json', JSON.stringify(token));
    }
    return token.accessToken;
};

const shouldRenew = (token) => {
    if (!token) return true;
    const expiresIn = (new Date(token.expiresAt) - new Date()) / 1000;
    console.log('token expires in minutes', Math.floor(expiresIn / 60));
    if (expiresIn > 900) {
        return false;
    }
    return true;
};

const checkToken = () =>
    axios
        .get('https://id.twitch.tv/oauth2/validate', {
            headers: {
                Authorization: `OAuth ${twitchAccessToken}`,
            },
        })
        .then((res) => res.data)
        .catch((err) => {
            console.log('Error validating token:', err.response.data);
            return null;
        });

const featuredApi = async (limit = 8) => {
    try {
        const { data } = await axios.get(
            `https://api.twitch.tv/kraken/streams/featured?&limit=${limit}&client_id=${twitchClientID}`
        );
        return data.featured.map(({ stream }) => stream);
    } catch (e) {
        return null;
    }
};

exports.topGamesApi = async (limit = 8) => {
    try {
        const { data } = await axios.get(
            `https://api.twitch.tv/kraken/games/top?client_id=${twitchClientID}&limit=${limit}`
        );
        return data.top.map(({ game }) => game.name);
    } catch (e) {
        return null;
    }
};

exports.fetchStreamInfo = async ({ user_id }) => {
    try {
        const { data } = await axios.get({
            url: `https://api.twitch.tv/kraken/streams/${user_id}`,
            headers: {
                'Client-ID': twitchClientID,
                Accept: 'application/vnd.twitchtv.v5+json',
            },
        });
        return data.stream;
    } catch (e) {
        return null;
    }
};

exports.fetchGames = async (list) => {
    let outputGames;
    await Promise.all(
        list.map(async (item) => {
            try {
                const fetched = await axios.get({
                    url: `https://api.twitch.tv/helix/games?name=${item}`,
                    headers: { 'Client-ID': twitchClientID },
                });
                return fetched.data.data[0];
            } catch (e) {
                console.log(e);
            }
        })
    ).then((result) => {
        outputGames = [].concat(result);
    });
    return outputGames;
};
