'use strict';  // This line enables strict mode for this file

require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Get the rolldice URL from environment variables
const ROLLDICE_URL = process.env.ROLLDICE_URL || 'http://localhost:8080/rolldice';

app.use(express.json());

// Function to roll the dice by calling the external service
async function rollDice(name) {
  const response = await fetch(`${ROLLDICE_URL}?name=${encodeURIComponent(name)}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Endpoint to play the game
app.post('/play', async (req, res) => {
  try {
    const { name } = req.body;
    console.log(`Player ${name} is playing`);
    const playerRoll = await rollDice(name);
    const computerRoll = await rollDice('Computer');

    let result;
    if (playerRoll > computerRoll) {
      result = 'You win!';
    } else if (playerRoll < computerRoll) {
      result = 'Computer wins!';
    } else {
      // Simulate an error when there's a tie
      throw new Error('Unexpected tie occurred');
    }

    res.json({
      playerName: name,
      playerRoll,
      computerRoll,
      result
    });
  } catch (error) {
    console.error('Error during game:', error.message);
    res.status(500).json({ error: 'An error occurred while playing the game' });
  }
});

app.listen(port, () => {
  console.log(`GamesApp listening at http://localhost:${port}`);
  console.log(`Using Rolldice service at: ${ROLLDICE_URL}`);
});
