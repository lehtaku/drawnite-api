const gameService = require('../services/game');

const createNewGame = (req, res) => {
    gameService.saveGameToDb().subscribe(game => {
        res.send(game);
    });
};

const getGameData = (req, res) => {
    gameService.getGame(req.params.gameId).subscribe(game => {
        res.send(game)
    });
};

module.exports = {
    createNewGame,
    getGameData
};
