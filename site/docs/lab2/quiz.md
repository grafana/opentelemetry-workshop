---
sidebar_position: 3
---

# End of Lab 2 Quiz

import Quiz from '@site/src/components/Quiz';

{/* prettier-ignore */}
export const questions = [
  {
    question_text: "Why was the gameserver throwing errors?",
    explanation:
      "The app is brand new, and the developers hadn't implemented a code path to handle both 'computer' and 'player' winning the game. (We'll chat to the dev team about that!)",
    choices: [
      {
        choice_text: "The 'equal score' outcome hasn't been implemented yet",
        is_correct: true,
      },
      {
        choice_text: "The database is not responding",
        is_correct: false,
      },
      {
        choice_text: "The server is overloaded",
        is_correct: false,
      },
      {
        choice_text: "OpenTelemetry has been configured incorrectly",
        is_correct: false,
      },
    ],
  },
];


Now's your chance to prove what you've learned in this part of the workshop. 

See if you can answer the following questions:

<Quiz questions={questions}></Quiz>
