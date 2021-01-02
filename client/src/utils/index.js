import axios from 'axios';
import twitchId from '../config/keys';

export const formatImgUrl = (url, width) => (url ? url.replace(/\{width\}|\{height\}/g, width) : '');

export const fetchFromTwitch = async (url, options = {}) => {
    const accessToken = localStorage.getItem('twitchAccessToken');
    const config = {
        ...options,
        url,
        method: 'get',
        headers: { 'Client-ID': twitchId, Authorization: `Bearer ${accessToken}` },
    };
    try {
        const result = await axios(config);
        return result.data;
    } catch (err) {
        console.log(err);
    }
};
