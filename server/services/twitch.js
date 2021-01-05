const axios = require('axios');
const qs = require('qs');
const { promises: fs } = require('fs');

const { twitchClientID, twitchClientSecret } = require('../config/keys');
const Token = require('../models/Token');
const User = require('../models/User');

const requireF = (modulePath) => {
    try {
        return require(modulePath)
    } catch (err) {
        return null;
    }
}

let token = requireF('../../token.json');

const getToken = async (userId) => {
    if (!shouldRenew(token)) {
        return token.accessToken;
    };
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
        .then((res = res.data))
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
}

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

module.exports = {
    getToken,
};
