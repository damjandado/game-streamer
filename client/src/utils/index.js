import { get } from './http';
import twitchId from '../config/keys';

export const formatImgUrl = (url, width = 350, height = 200) =>
    url ? url.replace(/(\{width\})x\{height\}/g, `${width}x${height}`) : '';

export const fetchFromTwitch = async (url, options = {}, withPagination = false) => {
    const accessToken = localStorage.getItem('twAccessToken');
    const config = {
        ...options,
        withCredentials: false,
        headers: { 'Client-ID': twitchId, Authorization: `Bearer ${accessToken}` },
    };
    try {
        const data = await get(url, config);
        if (withPagination) {
            return data;
        }
        return data.data;
    } catch (err) {
        console.log(err);
        return [];
    }
};

export const populateUser = (streams) => {
    const url = 'https://api.twitch.tv/helix/users';
    const withUser = streams.map(async (stream) => ({
        ...stream,
        _user: (await fetchFromTwitch(url, { params: { id: stream.user_id } }))[0],
    }));
    return Promise.all(withUser);
};
