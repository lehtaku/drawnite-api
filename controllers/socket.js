const www = require('../bin/www');
const utils = require('../utils/utils');
const gameService = require('../services/game');

let gameId = '';
let words = ['Salmiakki', 'Pakkoruotsi', 'Villasukat', 'Aita', 'Vakuutus', 'Venäjä', 'Pörssi', 'Saksa', 'Tonnikala', 'Kissa'];

const socketOnConnection = (socket) => {
    gameId = socket.handshake.query.token;

    socket.join(gameId);
    socket.emit('ask-name');

    socket.on('set-username', (userName) => {
        socket.name = userName;
        newPlayer(socket)
    });
    socket.on('drawing', canvasDataUrl => drawingToCanvas(canvasDataUrl, socket));
    socket.on('change-state', gameOn => {
        if (!gameOn) {
            startGame(socket);
        }
        changeGameState(gameOn, socket);
    });
    socket.on('select-word', word => startRound(word));
    socket.on('settings-changed', settings => settingsChanged(settings, socket));
    socket.on('chat-message', msg => newMessage(msg, socket));
    socket.on('disconnect', () => socketDisconnected(socket));
};

const newPlayer = (socket) => {
    gameService.addPlayer(gameId, socket.id, socket.name)
        .then(res => {
            let playerName = res.players[res.players.length - 1].name;
            if (!socket.name) socket.name = playerName;
            www.io.to(gameId).emit('players-changed', res.players);
            socket.to(gameId)
                .emit('player-connected', playerName)
                .emit('new-settings', res.settings);
        })
        .catch(err => {
            // TODO: Error handling
            console.log(err);
        });
};

const startRound = (word) => {
    console.log(word);
    www.io.to(gameId).emit('start-round', word);
};

const socketDisconnected = (socket) => {
    gameService.removePlayer(gameId, socket.id)
        .then(res => {
            www.io.to(gameId).emit('players-changed', res.players);
            socket.to(gameId).emit('player-disconnected', socket.name)
        })
        .catch(err => {
            // TODO: Error handling
            console.log(err);
        })
};

const startGame = (socket) => {
    socket.emit('ask-word', utils.getThreeRandomWordsFromArray(words));
};

function getThreeRandomWordsFromArray(array) {
    let wordsArray = [];
    for (let i = 0; i < 3; i++) {
        let min = 0;
        let max = array.length;
        wordsArray.push(words[getRandomInt(min, max)]);
    }
    return wordsArray;
}

const newMessage = (msg, socket) => {
    www.io.to(gameId).emit('chat-message', {
        sender: socket.name,
        text: msg
    })
};

const drawingToCanvas = (canvasDataUrl, socket) => {
    socket.to(gameId).emit('send-canvas', canvasDataUrl);
};

const settingsChanged = (settings) => {
    gameService.saveSettings(gameId, settings)
        .then(res => {
            www.io.to(gameId).emit('new-settings', res.settings);
        })
        .catch(err => {
            // TODO: Error handling
            console.log(err);
        })
};

const changeGameState = (state) => {
    gameService.saveGameState(gameId, !state)
        .then(res => www.io.to(gameId).emit('state-changed', res));
};

module.exports = {
    socketOnConnection
};
