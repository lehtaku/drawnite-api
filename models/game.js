const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    created: Date,
    gameOn: Boolean,
    settings: {
        rounds: Number,
        drawTime: Number
    },
    players: [
        {
            socket_id: String,
            name: String,
            score: Number,
            drawing: Boolean
        }
    ],
    messages: [
        {
            author: String,
            content: String
        }
    ]
});

const Game = mongoose.model('Game', gameSchema);

module.exports = {
    Game
};
