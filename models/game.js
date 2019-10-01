const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    created: Date,
    gameOn: Boolean,
    drawerSocket: String,
    settings: {
        rounds: Number,
        drawTime: Number
    },
    players: [
        {
            socket_id: String,
            name: String,
            score: Number,
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
