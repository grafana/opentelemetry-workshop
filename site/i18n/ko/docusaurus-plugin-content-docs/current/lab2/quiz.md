---
sidebar_position: 3
---

# Lab 2 퀴즈

import Quiz from '@site/src/components/Quiz';

{/* prettier-ignore */}
export const questions = [
  {
    question_text: "gameserver가 오류를 던진 이유는 무엇인가요?",
    explanation:
      "앱이 새로 만들어졌고, 개발자들이 '컴퓨터'와 '플레이어' 모두 게임에서 이기는 경우를 처리하는 코드 경로를 구현하지 않았습니다. (개발팀과 이야기해봐야겠네요!)",
    choices: [
      {
        choice_text: "'동점' 결과가 아직 구현되지 않았습니다",
        is_correct: true,
      },
      {
        choice_text: "데이터베이스가 응답하지 않습니다",
        is_correct: false,
      },
      {
        choice_text: "서버가 과부하 상태입니다",
        is_correct: false,
      },
      {
        choice_text: "OpenTelemetry가 잘못 구성되었습니다",
        is_correct: false,
      },
    ],
  },
];


이 워크숍의 이 부분에서 배운 것을 증명할 기회입니다.

다음 질문에 답해 보세요:

<Quiz questions={questions}></Quiz>
