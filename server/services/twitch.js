const axios = require('axios');
const qs = require('qs');

const { twitchClientID, twitchClientSecret } = require('../config/keys');
const Token = require('../models/Token');

const getToken = async (userId) => {
    let token;
    if (userId) {
        token = await Token.findOne({ userId, source: 'twitch' });
    } else {
        const tokens = await Token.find({ source: 'twitch' }).sort({ id: -1 }).limit(1);
        token = tokens.pop();
    }
    let twitchAccessToken = token.accessToken;
    let url = 'https://id.twitch.tv/oauth2/validate';
    let result = await axios
        .get(url, {
            headers: {
                Authorization: `OAuth ${twitchAccessToken}`,
            },
        })
        .catch((err) => {
            console.log(err.response.data);
            return null;
        });
    if (result) {
        console.log('token still valid', result.data);
        return twitchAccessToken;
    }
    url = 'https://id.twitch.tv/oauth2/token';
    const date = new Date();
    result = await axios({
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
    }).catch((err) => {
        console.log(err.response.data);
        return err.response.data;
    });
    const { access_token, refresh_token, scope, expires_in, error } = result.data;
    if (!error) {
        console.log(error);
    } else {
        twitchAccessToken = access_token;
        token.accessToken = access_token;
        token.refreshToken = refresh_token;
        token.expiresAt = new Date(date + expires_in * 1000);
        token.save();
    }
    return twitchAccessToken;
};

module.exports = {
    getToken,
}