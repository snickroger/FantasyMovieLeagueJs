"use strict";
const assert = require('assert');
const fs = require('fs');
const MojoParser = require('../modules/mojoParser.js');

describe('revenues', function() {
    describe('MojoParser', function() {
        let parser = new MojoParser();
        let html = fs.readFileSync('test/mojoResponse.txt');
        let movies = parser.parse(html);

        it('has 88 movies', function () {
            assert.equal(movies.length, 81);
        });

        it('has Thor in position 68', function () {
            assert.equal(movies[68].name, "Thor: Ragnarok");
        });

        it('has Star Wars with a $278M gross', function () {
            assert.equal(movies[2].gross, 278710009);
        });

        it('has 3 movies after filtering', function () {
            let rows = parser.getEarnings(movies, [{id: 1, name: "Thor: Ragnarok"}, 
                {id:2, name: "Star Wars: The Last Jedi"}, {id:3, name: "Coco"}]);
            assert.equal(rows.length, 3);
        });
    })
})