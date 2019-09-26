const www = require('../bin/www');
const gameService = require('../services/game');

let gameId = '';

const socketOnConnection = (socket) => {
    gameId = socket.handshake.query.token;

    socket.join(gameId);

    socket.emit('ask-name', 'You\'r name?', (answer) => {
        socket.name = answer;
        newPlayer(socket);
    });

    socket.on('change-state', (state) => changeGameState(state, socket));
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

const newMessage = (msg, socket) => {
    www.io.to(gameId).emit('chat-message', {
        sender: socket.name,
        text: msg
    })
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
        .then(state => www.io.to(gameId).emit('state-changed', state));
};

module.exports = {
    socketOnConnection
};
