const express = require('express');
const router = express.Router();

const gameController = require('../controllers/game');

// When creating new game
router.get('/new-game', gameController.createNewGame);

router.get('/:gameId', gameController.getGameData);

module.exports = router;
