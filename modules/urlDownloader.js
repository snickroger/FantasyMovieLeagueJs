"use strict";
const request = require('request-promise-native');

class UrlDownloader {
    async download(url, options = {}) {
        options.uri = options.uri || url;
        let response = await request(options);
        return response;
    }
}

module.exports = UrlDownloader;