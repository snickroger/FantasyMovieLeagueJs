"use strict";
const request = require('request-promise-native');

class UrlDownloader {
    async download(url) {
        let html = await request(url);
        return html;
    }
}

module.exports = UrlDownloader;