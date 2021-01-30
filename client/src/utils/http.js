import axios from 'axios';

const request = async (opts) => {
    try {
        opts.baseURL = process.env.REACT_APP_SERVER_URL;
        opts.withCredentials = opts.withCredentials || true;
        const { data } = await axios(opts);
        return data;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

const get = (url, config) => request({ ...config, url, method: 'get' });

const post = (url, data, config) => request({ ...config, url, data, method: 'post' });

export { get, post };
