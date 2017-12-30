"use strict";
const cheerio = require('cheerio');
const accounting = require('accounting');

class MojoParser {
    parse(html) {
        let currencyToInt = strGross => parseInt(strGross.replace(/\$|,/g, ''));
        let $ = cheerio.load(html);
        let rows = $("form[name='MojoDropDown1']").parents("table").last().find("tr");
        let movies = [];

        for (let i = 2; i < rows.length; i++) {
            let row = rows.eq(i);
            let gross = currencyToInt(row.find("td").eq(4).text());
            if (isNaN(gross)) {
                continue;
            }
            movies.push({
                name: row.find("td").eq(2).text(),
                gross: gross
            });
        }
        return movies;
    }

    getEarnings(rows, movies) {
        let earnings = [];
        for (let row of rows) {
            let matchingMovies = movies.filter(m => m.name == row.name);
            if (matchingMovies.length == 0) {
                continue;
            }
            let gross = row.gross;
            let grossStr = accounting.formatMoney(gross, '$', 0);
            for (let movie of matchingMovies) {
                earnings.push({
                    movieId: movie.id, 
                    gross: gross,
                    grossStr: grossStr, 
                    name: movie.name
                });
            }
        }
        return earnings;
    }
}

module.exports = MojoParser;