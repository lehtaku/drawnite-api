const LobbyController = require('./LobbyController');
const www = require('../bin/www');

module.exports.socketOnConnection = (socket) => {
    // Join to channel
    let clientToken = socket.handshake.query.token;
    socket.join(clientToken);

    // Find right game
    let thisGame = games.find(game => game.id === clientToken);

    // Add players
    const player = {
        id: socket.id,
        name: 'Player ' + (thisGame.players.length + 1)
    };
    thisGame.players.push(player);

    // Share players to all in room
    www.io.to(clientToken).emit('players-changed', thisGame.players);

    // Send to chat
    socket.to(clientToken).emit('player-connected', player);

    // Find player
    const thisPlayer = thisGame.players.filter(player => player.id === socket.id);

    // Chat message
    socket.on('chat-message', msg => {
        www.io.in(clientToken).emit('chat-message', {
            sender: thisPlayer[0].name,
            text: msg
        })
    });

    socket.on('username-changed', userName => {
        thisPlayer[0].name = userName;
        www.io.to(clientToken).emit('players-changed', thisGame.players);
    });

    socket.on('disconnect', () => {
        // Remove disconnected socket from players
        thisGame.players = thisGame.players.filter(player => player.id !== socket.id);

        // Share players to all in room
        www.io.to(clientToken).emit('players-changed', thisGame.players);

        // Send to chat
        socket.to(clientToken).emit('player-disconnected', player);
    });
};

const findUser = () => {

};

let games = [
    {
        id: "RHywcWA8dT",
        created: 1568646837319,
        rounds: 3,
        roundTime: 60,
        players: []
    },
    {
        id: "G4Mw2l3qVG",
        created: 1568646838080,
        rounds: 3,
        roundTime: 60,
        players: []
    }];
