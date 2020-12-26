import twitchId from '../config/keys';

export const formatImgUrl = (url, width) => (url ? url.replace(/\{width\}|\{height\}/g, width) : '');

export const fetchFromTwitch = (url, options = {}) => {
    const accessToken = localStorage.getItem('twitchAccessToken');
    const config = {
        ...options,
        url,
        method: 'get',
        headers: { 'Client-ID': twitchId, Authorization: `Bearer ${accessToken}` },
    };
    return axios(config).then(({ data }) => data);
};
