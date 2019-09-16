const express = require('express');
const router = express.Router();

const LobbyController = require('../controllers/LobbyController');

// Test
router.get('/test', LobbyController.test);

// When creating new game
router.get('/', LobbyController.createNewLobby);

// When already have game id
router.get('/:lobbyId', LobbyController.getLobbyData);

module.exports = router;
