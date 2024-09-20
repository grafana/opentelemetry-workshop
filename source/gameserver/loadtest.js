import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 2, 
  duration: '60m',
};

export default function () {
  // Simulate a player making a request to play the game
  const payload = JSON.stringify({
    name: `Player${__VU}`, // Use the virtual user number as part of the player name
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post('http://localhost:8090/play', payload, params);

  // Sleep for a random time between 1-5 seconds before the next iteration
  sleep(Math.random() * 4 + 1);
}
