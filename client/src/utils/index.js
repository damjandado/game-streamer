import axios from 'axios';
import twitchId from '../config/keys';

export const formatImgUrl = (url, width = 350, height = 200) =>
    url ? url.replace(/(\{width\})x\{height\}/g, `${width}x${height}`) : '';

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
