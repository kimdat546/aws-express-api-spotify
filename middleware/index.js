// axiosMiddleware.js

const axios = require('axios');
const getToken = require('../services/getToken');

// Token store object (you can replace this with Redis or a database)
let tokenStore = {
    token: null,
    expiration: null,
};

// Axios middleware to include the token in the request headers
const axiosWithAuth = async (config) => {
    if (!tokenStore.token || tokenStore.expiration <= Date.now()) {
        const { token, expiration } = await getToken(axios);
        tokenStore.token = token;
        tokenStore.expiration = expiration;
    }
    console.log({tokenStore});

    config.headers.Authorization = tokenStore.token;
    return config;
};

// Register the Axios middleware
axios.interceptors.request.use(axiosWithAuth);

module.exports = axios;
