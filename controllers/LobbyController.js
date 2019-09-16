const randomString = require('randomstring');
const fs = require('fs');

let games = require('../games.json');

module.exports.test = (req, res) => {
    res.send('<h1>Express API</h1>')
};

module.exports.createNewLobby = (req, res) => {
    const newGame = {
        id: randomString.generate(10),
        created: Date.now(),
        rounds: 3,
        roundTime: 60,
        players: []
    };
    let gamesArr = Array.from(games);
    gamesArr.push(newGame);

    fs.writeFile('./games.json', JSON.stringify(gamesArr, null, 4), err => {
        if (err) {
            console.log('Error during writing: ' + err);
            return;
        }
        console.log('File writed successfully')
    });

    res.send(newGame);
};

module.exports.getLobbyData = (req, res) => {
    res.send({
        lobbyId: req.params.lobbyId
    });
};

module.exports.addNewPlayer = (socketId, clientId) => {

};
