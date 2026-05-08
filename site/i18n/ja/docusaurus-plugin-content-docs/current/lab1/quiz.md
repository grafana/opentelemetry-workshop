---
sidebar_position: 4
---

# ラボ 1 の終了クイズ

import Quiz from '@site/src/components/Quiz';

{/* prettier-ignore */}
export const questions = [
  {
    question_text: "OpenTelemetry とは何ですか？",
    explanation: "OpenTelemetry は、可観測性のためのツールと標準のセットです。",
    choices: [
      { choice_text: "プログラミング言語", is_correct: false },
      { choice_text: "可観測性のためのツールと標準のセット", is_correct: true },
      { choice_text: "テレメトリーを保存するためのデータベース", is_correct: false },
      { choice_text: "アプリケーション開発フレームワーク", is_correct: false },
    ],
  },
  {
    question_text: 'OpenTelemetry の文脈で "span" とは何ですか？',
    explanation: "OpenTelemetry において span は作業または操作の単位であり、Trace の構成要素です。",
    choices: [
      { choice_text: "データベースクエリの種類", is_correct: false },
      { choice_text: "作業または操作の単位であり、Trace の構成要素", is_correct: true },
      { choice_text: "ユーザーインターフェースのコンポーネント", is_correct: false },
      { choice_text: "ネットワークプロトコル", is_correct: false },
    ],
  },
  {
    question_text: "OpenTelemetry における resource とは何ですか？",
    explanation: "OpenTelemetry における resource は、テレメトリーデータを生成するエンティティを説明する属性のセットです。",
    choices: [
      { choice_text: "テレメトリーデータを生成するエンティティを説明する属性のセット", is_correct: true },
      { choice_text: "テレメトリーデータを保存するためのデータベースの種類", is_correct: false },
      { choice_text: "テレメトリーデータを可視化するためのユーザーインターフェースコンポーネント", is_correct: false },
      { choice_text: "テレメトリーデータを送信するためのネットワークプロトコル", is_correct: false },
    ],
  },
  {
    question_text: "OpenTelemetry における resource attribute とは何ですか？",
    explanation: "OpenTelemetry における resource attribute は、サービス名やインスタンス ID など、テレメトリーデータを生成するエンティティを説明するメタデータです。",
    choices: [
      { choice_text: "ログ出力をカスタマイズするための設定パラメータ", is_correct: false },
      { choice_text: "テレメトリーデータを送信するためのネットワークプロトコル", is_correct: false },
      { choice_text: "ドキュメントの種類", is_correct: false },
      { choice_text: "サービス名やインスタンス ID など、テレメトリーデータを生成するエンティティを説明するメタデータ", is_correct: true },
    ],
  },
  {
    question_text: "OpenTelemetry でサービスのインスタンスを一意に識別するために使うべき属性はどれですか？",
    explanation: "OpenTelemetry では 'service.instance.id' 属性がサービスのインスタンスを一意に識別します。",
    choices: [
      { choice_text: "service.instance.id", is_correct: true },
      { choice_text: "service.name", is_correct: false },
      { choice_text: "service.version", is_correct: false },
      { choice_text: "service.environment", is_correct: false },
    ],
  },
];

このワークショップのこのパートで学んだことを証明するチャンスです。

次の質問に答えられるか試してみましょう。

<Quiz questions={questions}></Quiz>
