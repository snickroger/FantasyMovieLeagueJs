"use strict";
class MockSeasons {
    static getSeason1() {
        return {
            movies: [{
                id: 1,
                name: "Rocky VI",
                rating: 88,
                shares: [
                    {playerId: 10, num_shares: 5},
                    {playerId: 11, num_shares: 10},
                    {playerId: 12, num_shares: 0},
                    {playerId: 13, num_shares: 3},
                    {playerId: 14, num_shares: 7}
                ],
                earnings: [
                    {gross: 180000000, createdAt: new Date(2018, 1, 1)}
                ]
            }],
            players: [
                {id: 10, name: "Alice"}, 
                {id: 11, name: "Bob"}, 
                {id: 12, name: "Charlie"}, 
                {id: 13, name: "David"}, 
                {id: 14, name: "Eve"}
            ]
        };
    }

    static getSeason2() {
        return {
            movies: [{
                id: 1,
                name: "A",
                shares: [
                    {playerId: 10, num_shares: 2}, 
                    {playerId: 11, num_shares: 1}
                ],
                rating: 88,
                earnings: [
                    {gross: 60000000, createdAt: new Date(2018, 1, 1)}, 
                    {gross: 35000000, createdAt: new Date(2017, 12, 31)}
                ]
            },{
                id: 2,
                name: "B",
                shares: [
                    {playerId: 11, num_shares: 1}, 
                    {playerId: 12, num_shares: 1}
                ],
                rating: 39,
                earnings: [
                    {gross: 100000000, createdAt: new Date(2018, 1, 1)}
                ]
            },{
                id: 3,
                name: "C",
                shares: [
                    {playerId: 11, num_shares: 2}, 
                    {playerId: 13, num_shares: 8}
                ],
                rating: 99,
                earnings: [
                    {gross: 40000000, createdAt: new Date(2018, 1, 1)}
                ]
            },{
                id: 4,
                name: "D",
                shares: [
                    {playerId: 11, num_shares: 3}, 
                    {playerId: 12, num_shares: 4}
                ],
                rating: 50,
                earnings: []
            },{
                id: 5,
                name: "D",
                shares: [
                    {playerId: 11, num_shares: 3}, 
                    {playerId: 12, num_shares: 4}
                ],
                rating: null,
                earnings: []
            }],
            players: [{
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
            }],
            bonusAmount: 5000000
        }
    }
}
module.exports = MockSeasons