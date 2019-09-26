const gameService = require('../services/game');

const createNewGame = (req, res) => {
    gameService.saveGameToDb()
        .then(game => res.send(game))
        .catch(err => {
            // TODO: Error handling
            console.log(err)
        });
};

const getGameData = (req, res) => {
    gameService.getGame(req.params.gameId)
        .then(game => res.send(game))
        .catch(err => {
            // TODO: Error handling
            console.log(err)
        });
};

module.exports = {
    createNewGame,
    getGameData
};
