// const axios = require('axios');

const getToken = async (axios) => {
    const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        {
            grant_type: "client_credentials",
            client_id: "42d6f0ebb22f4ab29bf9e81ac67a8263",
            client_secret: "c34e2fc0424642d199deecbf8890bb03"
        },
        {
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
        }
    );
    const { data } = response;
    console.log({data});
    const { access_token, token_type, expires_in } = data;
    const expiration = Date.now() + expires_in * 1000;
    return { token: `${token_type} ${access_token}`, expiration };
}

module.exports = getToken;
