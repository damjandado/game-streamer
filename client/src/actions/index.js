import axios from 'axios';
import twitchId from '../config/keys';
import { fetchFromTwitch, populateUser } from '../utils';
import {
    FETCH_FEATURED,
    FETCH_TOPGAMES,
    FETCH_SEARCH,
    FETCH_DASHBOARD,
    FETCH_CLIPS,
    GET_USER,
    LOGIN_USER,
    FETCH_USER,
    SAVE_ACTIVITY,
    EMBED_STREAM,
} from './types';

export const getUser = (params) => async (dispatch) => {
    const url = 'https://api.twitch.tv/helix/users';
    try {
        const users = await fetchFromTwitch(url, { params });
        dispatch({ type: GET_USER, payload: users[0] });
        dispatch(embedStream({ user: users[0] }));
    } catch (err) {
        console.log('getUser', err);
    }
};

export const getStream = (params) => async (dispatch) => {
    const url = 'https://api.twitch.tv/helix/streams';
    try {
        const streams = await fetchFromTwitch(url, { params });
        dispatch(embedStream({ stream: streams[0] }));
    } catch (err) {
        console.log('getStream', err);
    }
};

export const fetchUserData = () => async (dispatch, getState) => {
    const axiosRes = await axios.get('/api/current_user', { withCredentials: true });
    const { user, recommendation, twitchAccessToken, twitchData } = axiosRes.data;
    localStorage.setItem('twitchAccessToken', twitchAccessToken);
    dispatch({ type: LOGIN_USER });
    dispatch({ type: FETCH_USER, payload: { user, twitchAccessToken } });
    dispatch({ type: FETCH_SEARCH, payload: { allGames: twitchData.games } });
    if (user) {
        dispatch({ type: FETCH_DASHBOARD, payload: { status: 'loading' } });
        try {
            const status = 'success';
            const { games, streams } = await fetchUserTwitch(recommendation, twitchData);
            dispatch({ type: FETCH_DASHBOARD, payload: { status, streams, games } });
            const populatedStreams = await populateUser(streams);
            dispatch({ type: FETCH_DASHBOARD, payload: { status, streams: populatedStreams } });
        } catch (err) {
            console.log('fetchUserData', err);
        }
    }
};

export const fetchUserTwitch = async (recommendation, twitchData) => {
    const games = recommendation.games.map((rg) => ({
        ...rg,
        ...twitchData.games.find((g) => g.id === rg.id),
    }));
    const streamPromises = [];
    let url = 'https://api.twitch.tv/helix/streams';
    recommendation.users.forEach((user) => {
        const params = { user_id: user.id };
        streamPromises.push(fetchFromTwitch(url, { params }));
    });
    recommendation.games.forEach((game) => {
        const params = { game_id: game.id };
        streamPromises.push(fetchFromTwitch(url, { params }));
    });
    if (!streamPromises.length) {
        const streams = await fetchFromTwitch(url);
        return { streams: streams.slice(0, 10), games: twitchData.games.slice(0, 10) };
    }
    const found = {};
    const streams = [];
    const streamResults = await Promise.all(streamPromises);
    for (let data of streamResults) {
        if (!data.length) continue;
        let stream = data[0];
        if (!found[stream.id]) {
            found[stream.id] = true;
        } else {
            found[stream.id] = true;
            stream = data.find((s) => s.id !== stream.id);
            if (!stream) continue;
        }
        streams.push(stream);
    }
    return { streams, games };
};

export const saveActivity = (entity) => async (dispatch) => {
    const res = await axios.post('/api/twitch/users', entity, { withCredentials: true });

    dispatch({ type: SAVE_ACTIVITY, payload: res.data });
};

export const embedStream = (payload) => {
    return {
        type: EMBED_STREAM,
        payload,
    };
};

export const featuredApi = (limit = 20) => async (dispatch, getState) => {
    const url = 'https://api.twitch.tv/helix/streams';
    let payload = { status: 'loading', list: [] };
    dispatch({ type: FETCH_FEATURED, payload });
    try {
        const status = 'success';
        const params = { first: limit };
        const streams = await fetchFromTwitch(url, { params });
        dispatch({ type: FETCH_FEATURED, payload: { status, list: streams } });
        const populatedStreams = await populateUser(streams);
        dispatch({ type: FETCH_FEATURED, payload: { status, list: populatedStreams } });
    } catch (err) {
        console.log('featuredApi', err);
    }
};

export const topGamesApi = (limit = 10, offset = 0, searchTerm) => async (dispatch, getState) => {
    const url = 'https://api.twitch.tv/helix/games/top';
    let payload = { status: 'loading', list: [] };
    dispatch({ type: FETCH_TOPGAMES, payload });
    dispatch({ type: FETCH_SEARCH, payload });
    try {
        const options = { params: { first: limit } };
        const status = 'success';
        if (!searchTerm) {
            const list = await fetchFromTwitch(url, options);
            payload = { status, list };
        } else {
            const { allGames } = getState().twitch;
            const term = searchTerm.toLowerCase();
            let foundGames = allGames.filter((item) => item.name.match(new RegExp(term, 'i')));
            const payload = { searchTerm, foundGames, status };
            return dispatch({ type: FETCH_SEARCH, payload });
        }
    } catch (err) {
        console.log('topGamesApi', err);
        payload = { ...payload, status: 'error' };
    }
    dispatch({ type: FETCH_TOPGAMES, payload });
};

export const searchStreams = (gameId, gameName) => async (dispatch) => {
    let payload = { status: 'loading', foundStreams: [], searchTerm: gameName };
    dispatch({ type: FETCH_SEARCH, payload });
    const url = 'https://api.twitch.tv/helix/streams';
    const options = { params: { game_id: gameId } };
    try {
        const status = 'success';
        const foundStreams = await fetchFromTwitch(url, options);
        payload = { ...payload, status, foundStreams };
        dispatch({ type: FETCH_SEARCH, payload });
        const populatedStreams = await populateUser(foundStreams);
        dispatch({ type: FETCH_SEARCH, payload: { status, foundStreams: populatedStreams } });
    } catch (err) {
        console.log('searchStreams', err);
        payload = { status: 'error' };
        dispatch({ type: FETCH_SEARCH, payload });
    }
};

export const fetchClips = (channel = 'Twitch', limit = 10) => async (dispatch) => {
    const res = await axios({
        method: 'get',
        url: `https://api.twitch.tv/kraken/clips/top?channel=${channel}&period=week&limit=${limit}`,
        headers: {
            'Client-ID': twitchId,
            Accept: 'application/vnd.twitchtv.v5+json',
        },
    });
    dispatch({
        type: FETCH_CLIPS,
        status: 'success',
        clips: res.data.clips,
    });
};

export const fetchStreamByChannelName = (name) => async (dispatch) => {
    try {
        const res = await axios({
            method: 'get',
            url: `https://api.twitch.tv/kraken/channels/${name}`,
            headers: {
                'Client-ID': `${twitchId}`,
            },
        });
        const stream = res.data;
        dispatch(embedStream({ stream }));
    } catch (e) {
        dispatch({ type: 'NOT_FOUND', found: false });
    }
};
