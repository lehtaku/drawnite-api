const www = require('../bin/www');
const gameService = require('../services/game');

const socketOnConnection = (socket) => {
    socket.join(socket.handshake.query.token);

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
    const gameId = socket.handshake.query.token;
        gameService.addPlayer(gameId, socket.id, socket.name)
            .subscribe(game => {
                if (game) {
                    www.io.to(gameId).emit('players-changed', game.players);
                    socket.to(gameId)
                        .emit('player-connected', socket.name)
                        .emit('new-settings', game.settings);
                }
            });
};

const socketDisconnected = (socket) => {
    const gameId = socket.handshake.query.token;
    gameService.removePlayer(gameId, socket.id)
        .subscribe(players => {
            www.io.to(gameId).emit('players-changed', players);
            socket.to(gameId).emit('player-disconnected', socket.name)
        });
};

const newMessage = (msg, socket) => {
    const gameId = socket.handshake.query.token;
    www.io.to(gameId).emit('chat-message', {
        sender: socket.name,
        text: msg
    })
};

const settingsChanged = (settings, socket) => {
    const gameId = socket.handshake.query.token;
    gameService.saveSettings(gameId, settings)
        .subscribe(settings => {
            www.io.to(gameId).emit('new-settings', settings);
        })
};

const changeGameState = (state, socket) => {
    const gameId = socket.handshake.query.token;
    const newState = !state;
    console.log('Change Gamestate called');
    gameService.saveGameState(gameId, newState)
        .subscribe(state => {
            www.io.to(gameId).emit('state-changed', state);
        })
};

module.exports = {
    socketOnConnection
};
