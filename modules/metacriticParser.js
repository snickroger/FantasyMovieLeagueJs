"use strict";
const cheerio = require('cheerio');

class MetacriticParser {
    parse(html) {
        let $ = cheerio.load(html);
        let metascoreElement = $("a.metascore_anchor span");

        if (!metascoreElement || metascoreElement.length === 0) {
            return null;
        }

        let score = parseInt(metascoreElement.eq(0).text());
        if (isNaN(score)) {
            return null;
        }
        
        return score;
    }
}

module.exports = MetacriticParser;