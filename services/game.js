const Rx = require('rxjs');

const randomString = require('randomstring');
const gameModel = require('../models/game');

const Game = gameModel.Game;

const saveGameToDb = () => {
    return new Rx.Observable(observer => {
        const newGame = new Game({
            created: Date.now(),
            gameOn: false,
            settings: {
                rounds: 3,
                drawTime: 60
            }
        });

        newGame.save((err, game) => {
            if (err) {
                observer.error(err);
            }
            observer.next(game);
            observer.complete();
        });
    });
};

const getGame = (gameId) => {
    return new Rx.Observable(observer => {
        Game.findById(gameId, (err, game) => {
            if (err) {
                observer.error(err);
            }
            observer.next(game);
            observer.complete();
        })
    })
};

const saveSettings = (gameId, settings) => {
    return new Rx.Observable(observer => {
        Game.findByIdAndUpdate(gameId,
            { settings: settings },
            { new: true },
            (err, res) => {
            if (err) {
                observer.error(err);
            }
            observer.next(res.settings);
            observer.complete();
            })
    });
};

const saveGameState = (gameId, state) => {
    return new Rx.Observable(observer => {
        Game.findByIdAndUpdate(gameId,
            { gameOn: state },
            { new: true },
            (err, res) => {
            if (err) {
                observer.error(err);
            }
            observer.next(res.gameOn);
            observer.complete();
            })
    });
};

const newMessage = () => {
    // TODO: Save message to DB
};

const addPlayer = (gameId, socketId, name) => {
    return new Rx.Observable(observer => {
        // TODO: If player name empty, set e.g. Player 1
        const newPlayer = {
            socket_id: socketId,
            name: name
        };

        Game.findByIdAndUpdate(gameId,
            { $push: { players: newPlayer } },
            { new: true },
            (err, game) => {
            if (err) {
                observer.error(err);
            } else {
                observer.next(game);
                observer.complete();
            }
        })
    });
};

const removePlayer = (gameId, socketId) => {
    return new Rx.Observable(observer => {
        Game.findById(gameId, (err, game) => {
            if (err) {
                observer.error(err);
            }
            const newPlayers = game.players.filter(player => player.socket_id !== socketId);
            Game.findByIdAndUpdate(gameId,
                { players:  newPlayers},
                { new: true },
                (err, res) => {
                    if (err) {
                        observer.error(err);
                    }
                    observer.next(res.players);
                    observer.complete();
                })
        });
    });
};

module.exports = {
    saveGameToDb,
    getGame,
    newMessage,
    addPlayer,
    saveSettings,
    saveGameState,
    removePlayer
};
