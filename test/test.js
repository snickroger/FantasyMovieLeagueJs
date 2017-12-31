"use strict";
const assert = require('assert');
const fs = require('fs');
const MojoParser = require('../modules/mojoParser.js');
const RtParser = require('../modules/rtParser.js');
const Standings = require('../modules/standings.js');

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
    });

    describe('RtParser', function() {
        let parser = new RtParser();
        let html = fs.readFileSync('test/rtResponse.txt');

        it('has Star Wars with a 92% rating', function() {
            let rating = parser.parse(html);
            assert.equal(rating, 92);
        });
    });

    describe('Standings (README Example)', function() {
        let movies = [{
            id: 1,
            name: "Rocky VI",
            rating: 88,
            shares: [{playerId: 10, num_shares: 5},{playerId: 11, num_shares: 10},{playerId: 12, num_shares: 0},{playerId: 13, num_shares: 3},{playerId: 14, num_shares: 7}],
            earnings: [{gross: 180000000, createdAt: new Date(2018, 1, 1)}]
        }];
        let players = [{id: 10, name: "Alice"}, {id: 11, name: "Bob"}, {id: 12, name: "Charlie"}, {id: 13, name: "David"}, {id: 14, name: "Eve"}];
        let season = {movies: movies};

        let sortedStandings = Standings.getSortedStandings(season, players);

        it('has Bob in 1st with $72,000,000', function() {
            assert.equal(sortedStandings[0].name, "Bob");
            assert.equal(sortedStandings[0].total, 72000000);
        });

        it('has Eve in 2nd with $50,400,000', function() {
            assert.equal(sortedStandings[1].name, "Eve");
            assert.equal(sortedStandings[1].total, 50400000);
        });

        it('has Alice in 3rd with $36,000,000', function() {
            assert.equal(sortedStandings[2].name, "Alice");
            assert.equal(sortedStandings[2].total, 36000000);
        });

        it('has David in 4th with $21,600,000', function() {
            assert.equal(sortedStandings[3].name, "David");
            assert.equal(sortedStandings[3].total, 21600000);
        });

        it('has Charlie in 5th with $0', function() {
            assert.equal(sortedStandings[4].name, "Charlie");
            assert.equal(sortedStandings[4].total, 0);
        });
    });

    describe('Standings (More)', function() {
        let movies = [{
            id: 1,
            name: "A",
            shares: [{playerId: 10, num_shares: 2}, {playerId: 11, num_shares: 1}],
            rating: 88,
            earnings: [{gross: 60000000, createdAt: new Date(2018, 1, 1)}, {gross: 35000000, createdAt: new Date(2017, 12, 31)}]
        },{
            id: 2,
            name: "B",
            shares: [{playerId: 11, num_shares: 1}, {playerId: 12, num_shares: 1}],
            rating: 39,
            earnings: [{gross: 100000000, createdAt: new Date(2018, 1, 1)}]
        },{
            id: 3,
            name: "C",
            shares: [{playerId: 11, num_shares: 2}, {playerId: 13, num_shares: 8}],
            rating: 99,
            earnings: [{gross: 40000000, createdAt: new Date(2018, 1, 1)}]
        },{
            id: 4,
            name: "D",
            shares: [{playerId: 11, num_shares: 3}, {playerId: 12, num_shares: 4}],
            rating: 50,
            earnings: []
        },{
            id: 5,
            name: "D",
            shares: [{playerId: 11, num_shares: 3}, {playerId: 12, num_shares: 4}],
            rating: null,
            earnings: []
        }];

        let players = [{
            id: 10,
            name: "Player 1",
            bonus1Id: 1,
            bonus2Id: 4
        },{
            id: 11,
            name: "Player 2",
            bonus1Id: null,
            bonus2Id: null
        },{
            id: 12,
            name: "Player 3",
            bonus1Id: 1,
            bonus2Id: 4
        },{
            id: 13,
            name: "Player 4",
            bonus1Id: 3,
            bonus2Id: 4
        }];
        let season = {movies: movies, bonusAmount: 5000000};

        let sortedStandings = Standings.getSortedStandings(season, players);

        it('has Player 4 in last', function() {
            assert.equal(sortedStandings[sortedStandings.length-1].name, "Player 4");
        });

        it('has Player 4 with Bonus 1', function () {
            assert(sortedStandings[sortedStandings.length-1].bonus1);
        });

        it('has Player 2 in 1st with $78,000,000', function() {
            assert.equal(sortedStandings[0].name, "Player 2");
            assert.equal(sortedStandings[0].total, 78000000);
        });

        it('has Player 3 in 2nd with $50,000,000', function() {
            assert.equal(sortedStandings[1].name, "Player 3");
            assert.equal(sortedStandings[1].total, 50000000);
        });

        it('has Player 1 in 3rd with $40,000,000', function() {
            assert.equal(sortedStandings[2].name, "Player 1");
            assert.equal(sortedStandings[2].total, 40000000);
        });

        it('has Player 4 in 4th with $37,000,000', function() {
            assert.equal(sortedStandings[3].name, "Player 4");
            assert.equal(sortedStandings[3].total, 37000000);
        });

    });
})