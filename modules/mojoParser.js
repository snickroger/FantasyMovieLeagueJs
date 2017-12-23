"use strict";
const cheerio = require('cheerio');

class MojoParser {
    parse(html) {
        let currencyToInt = strGross => parseInt(strGross.replace(/\$|,/g, ''));
        let $ = cheerio.load(html);
        let rows = $("form[name='MojoDropDown1']").parents("table").last().find("tr");
        let movies = [];

        for (let i = 2; i < rows.length; i++) {
            let row = rows.eq(i);
            let movie = {
                name: row.find("td").eq(2).text(),
                gross: currencyToInt(row.find("td").eq(4).text())
            };
            if (!isNaN(movie.gross)) {
                movies.push(movie);
            }
        }
        return movies;
    }

    getEarnings(rows, movies) {
        let earnings = [];
        for (let row of rows) {
            let movie = movies.filter(m => m.name == row.name);
            if (movie.length == 0) {
                continue;
            }
            earnings.push({movieId: movie[0].id, gross: row.gross, name: movie[0].name});
        }
        return earnings;
    }
}

module.exports = MojoParser;