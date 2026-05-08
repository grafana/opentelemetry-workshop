---
sidebar_position: 3
---

# ラボ 2 の終了クイズ

import Quiz from '@site/src/components/Quiz';

{/* prettier-ignore */}
export const questions = [
  {
    question_text: "なぜ gameserver はエラーを投げていたのでしょうか？",
    explanation: "このアプリはまだ新しく、開発者はゲームで 'computer' と 'player' の両方が勝つコードパスを実装していませんでした。（この件は開発チームに確認しましょう！）",
    choices: [
      { choice_text: "'equal score' の結果がまだ実装されていない", is_correct: true },
      { choice_text: "データベースが応答していない", is_correct: false },
      { choice_text: "サーバーが過負荷状態である", is_correct: false },
      { choice_text: "OpenTelemetry の設定が誤っている", is_correct: false },
    ],
  },
];

このワークショップのこのパートで学んだことを証明するチャンスです。

次の質問に答えられるか試してみましょう。

<Quiz questions={questions}></Quiz>
