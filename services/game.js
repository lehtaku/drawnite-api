const gameModel = require('../models/game');
const Game = gameModel.Game;

const saveGameToDb = async () => {
    try {
        const newGame = await new Game({
            created: Date.now(),
            gameOn: false,
            drawerSocket: null,
            settings: {
                rounds: 3,
                drawTime: 60
            }
        });
        return newGame.save();
    } catch (err) {
        // TODO: Error handling
        return err;
    }
};

const getGame = async (gameId) => {
    try {
        return Game.findById(gameId);
    } catch (err) {
        // TODO: Error handling
        return err;
    }
};

const saveSettings = async (gameId, settings) => {
    try {
        return Game.findByIdAndUpdate(gameId, { settings: settings },{ new: true });
    } catch (err) {
        // TODO: Error handling
        return err;
    }
};

const saveGameState = async (gameId, state) => {
    const game = await Game.findById(gameId);
    return Game.findByIdAndUpdate(gameId, { gameOn: state, drawerSocket: game.players[0].socket_id}, { new: true });
};

const addPlayer = async (gameId, socketId, name) => {
    try {
        if (name === '' || name === null || name === undefined) {
            const game = await Game.findById(gameId).exec();
            name = 'Player ' + (game.players.length + 1);
        }
        let player = {
            socket_id: socketId,
            name: name,
            score: 0,
            drawing: false
        };
        return await Game.findByIdAndUpdate(gameId, {$push: {players: player}}, {new: true}).exec();
    } catch (err) {
        return err;
    }
};

const removePlayer = async (gameId, socketId) => {
    try {
        const game = await Game.findById(gameId);
        const newPlayers = game.players.filter(player => player.socket_id !== socketId);
        return Game.findByIdAndUpdate(gameId, { players:  newPlayers}, { new: true });
    } catch (err) {
        return err;
    }
};

module.exports = {
    saveGameToDb,
    getGame,
    addPlayer,
    saveSettings,
    saveGameState,
    removePlayer
};
