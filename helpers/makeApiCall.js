const axios = require('axios').default;

module.exports = async (url, data, headers, method = 'get') => axios({ url, data, headers, method })
    .then(function (response) {
        return response.data ? response.data : response;
    })
    .catch(function (error) {
        console.error(error);
    });
