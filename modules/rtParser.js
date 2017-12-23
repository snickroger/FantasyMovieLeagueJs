"use strict";
const cheerio = require('cheerio');

class MojoParser {
    parse(html) {
        let percentToInt = strGross => parseInt(strGross.replace(/%/g, ''));
        let $ = cheerio.load(html);
        let meterValue = $("div.critic-score .meter-value");
        if (!meterValue || meterValue.length === 0) {
            return null;
        }
        return percentToInt(meterValue.eq(0).text());
    }
}

module.exports = MojoParser;