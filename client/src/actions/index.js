import axios from 'axios';
import twitchId from '../config/keys';
import { fetchFromTwitch } from '../utils';
import {
    FETCH_FEATURED,
    FETCH_TOPGAMES,
    FETCH_SEARCH,
    FETCH_DASHBOARD,
    FETCH_CLIPS,
    GET_USER,
    LOGIN_USER,
    FETCH_USER,
    SEND_MAIL,
    CHECK_MAIL,
    SAVE_ACTIVITY,
    EMBED_STREAM,
} from './types';

export const getUser = (params) => async (dispatch) => {
    const url = 'https://api.twitch.tv/helix/users';
    const { data } = await fetchFromTwitch(url, { params });
    dispatch({ type: GET_USER, payload: data[0] });
    dispatch(embedStream({ user: data[0] }));
}

export const getStream = (params) => async (dispatch) => {
    const url = 'https://api.twitch.tv/helix/streams';
    let { data, pagination: { cursor } } = await fetchFromTwitch(url, { params });
    console.log(data);
    dispatch(embedStream({ stream: data[0] }));
}

export const fetchUserData = () => async (dispatch, getState) => {
    const axiosRes = await axios.get('/api/current_user', { withCredentials: true });
    const { user, twitchAccessToken, twitchData } = axiosRes.data;
    localStorage.setItem('twitchAccessToken', twitchAccessToken);
    dispatch({ type: LOGIN_USER });
    dispatch({ type: FETCH_USER, payload: { user, twitchAccessToken } });
    dispatch({ type: FETCH_SEARCH, payload: { games: twitchData.games } });
    if (user) {
        let payload = { status: 'loading' };
        dispatch({ type: FETCH_DASHBOARD, payload });
        try {
            const { user: authUser } = getState().auth;
            const res = await fetchUserTwitch(authUser);
            const { broadcasters, games } = res;
            payload = { status: 'success', broadcasters, games };
            dispatch({ type: FETCH_FEATURED, payload: { status: 'success', list: broadcasters } });
            dispatch({ type: FETCH_TOPGAMES, payload: { status: 'success', list: games } });
            dispatch({ type: FETCH_DASHBOARD, payload });
        } catch (e) {
            payload = { status: 'error' };
        }
    }
};

export const fetchUserTwitch = async (user) => {
    const { games, users } = user.visits;
    console.log('fetchUserTwitch user visits', user.visits);
    const fetchedGames = await fetchFromTwitch('https://api.twitch.tv/helix/games/top');
    const fetchedStreams = await fetchFromTwitch('https://api.twitch.tv/helix/streams');
    console.log('fetchedGames', fetchedGames.data.data);
    return { broadcasters: fetchedStreams.data, games: fetchedGames.data };
};

export const sendMail = (values) => async (dispatch) => {
    const res = await axios.post('/api/send_email', values);
    try {
        if (res.data.success) {
            dispatch({ type: SEND_MAIL, userId: res.data.userId });
        }
    } catch (e) {}
};

export const checkEmail = (email) => async (dispatch) => {
    const res = await axios.post('/api/check_email', email);
    if (res.data.valid) {
        dispatch({ type: CHECK_MAIL, payload: true });
    } else {
        dispatch({ type: CHECK_MAIL, payload: false });
    }
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
        const params = { first: limit };
        const { data } = await fetchFromTwitch(url, { params });
        const status = data.length ? 'success' : 'error';
        payload = { status, list: data };
    } catch (e) {
        payload = { status: 'error' };
    }
    dispatch({ type: FETCH_FEATURED, payload });
};

export const topGamesApi = (limit = 10, offset = 0, searchTerm) => async (dispatch, getState) => {
    const url = 'https://api.twitch.tv/helix/games/top';
    let payload = { status: 'loading', list: [] };
    dispatch({ type: FETCH_TOPGAMES, payload });
    dispatch({ type: FETCH_SEARCH, payload });
    try {
        const options = { params: { first: limit } };
        if (!searchTerm) {
            const { data } = await fetchFromTwitch(url, options);
            payload = { status: 'success', list: data };
        } else {
            const { games } = getState().search;
            const term = searchTerm.toLowerCase();
            console.log(games);
            let foundGames = games.filter((item) => item.name.match(new RegExp(term, 'i')));
            const status = foundGames.length ? 'success' : 'error';
            const payload = { searchTerm, foundGames, status };
            return dispatch({ type: FETCH_SEARCH, payload });
        }
    } catch (e) {
        payload = { ...payload, status: 'error' };
    }
    dispatch({ type: FETCH_TOPGAMES, payload });
};

export const searchStreams = (gameId, gameName) => async (dispatch) => {
    let payload = { status: 'loading', streams: [], searchTerm: gameName };
    dispatch({ type: FETCH_SEARCH, payload });
    const url = 'https://api.twitch.tv/helix/streams';
    const options = { params: { game_id: gameId } };
    try {
        let { data, pagination: { cursor } } = await fetchFromTwitch(url, options);
        const status = data.length ? 'success' : 'error';
        payload = { ...payload, status, streams: data };
        dispatch({ type: FETCH_SEARCH, payload });
    } catch (e) {
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

export const fetchChannelStream = (id) => async (dispatch) => {
    const res = await axios({
        method: 'get',
        url: `https://api.twitch.tv/kraken/channels/${id}`,
        headers: {
            'Client-ID': `${twitchId}`,
            Accept: 'application/vnd.twitchtv.v5+json',
        },
    });
    let stream;
    try {
        stream = res.data;
    } catch (e) {}
    dispatch(embedStream({ stream }));
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
