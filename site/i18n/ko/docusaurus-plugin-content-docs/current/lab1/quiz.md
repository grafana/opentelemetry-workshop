---
sidebar_position: 4
---

# Lab 1 퀴즈

import Quiz from '@site/src/components/Quiz';

{/* prettier-ignore */}
export const questions = [
  {
    question_text: "OpenTelemetry란 무엇인가요?",
    explanation:
      "OpenTelemetry는 관찰 가능성을 위한 도구 및 표준의 집합입니다.",
    choices: [
      {
        choice_text: "프로그래밍 언어",
        is_correct: false,
      },
      {
        choice_text: "관찰 가능성을 위한 도구 및 표준의 집합",
        is_correct: true,
      },
      {
        choice_text: "텔레메트리를 저장하는 데이터베이스",
        is_correct: false,
      },
      {
        choice_text: "애플리케이션 개발 프레임워크",
        is_correct: false,
      },
    ],
  },
  {
    question_text: 'OpenTelemetry에서 "스팬(span)"이란 무엇인가요?',
    explanation:
      "OpenTelemetry에서 스팬은 트레이스의 구성 요소인 작업 또는 연산의 단위입니다.",
    choices: [
      {
        choice_text: "데이터베이스 쿼리의 유형",
        is_correct: false,
      },
      {
        choice_text:
          "트레이스의 구성 요소인 작업 또는 연산의 단위",
        is_correct: true,
      },
      {
        choice_text: "사용자 인터페이스 구성 요소",
        is_correct: false,
      },
      {
        choice_text: "네트워크 프로토콜",
        is_correct: false,
      },
    ],
  },
  {
    question_text: "OpenTelemetry에서 리소스(resource)란 무엇인가요?",
    explanation:
      "OpenTelemetry에서 리소스는 텔레메트리 데이터를 생성하는 엔티티를 설명하는 속성의 집합입니다.",
    choices: [
      {
        choice_text:
          "텔레메트리 데이터를 생성하는 엔티티를 설명하는 속성의 집합",
        is_correct: true,
      },
      {
        choice_text: "텔레메트리 데이터를 저장하는 데이터베이스의 유형",
        is_correct: false,
      },
      {
        choice_text:
          "텔레메트리 데이터를 시각화하기 위한 사용자 인터페이스 구성 요소",
        is_correct: false,
      },
      {
        choice_text: "텔레메트리 데이터를 전송하는 네트워크 프로토콜",
        is_correct: false,
      },
    ],
  },
  {
    question_text: "OpenTelemetry에서 리소스 속성이란 무엇인가요?",
    explanation:
      "OpenTelemetry에서 리소스 속성은 서비스 이름이나 인스턴스 ID와 같이 텔레메트리 데이터를 생성하는 엔티티를 설명하는 메타데이터입니다.",
    choices: [
      {
        choice_text: "로그 출력을 커스터마이징하는 데 사용되는 구성 매개변수",
        is_correct: false,
      },
      {
        choice_text: "텔레메트리 데이터를 전송하는 네트워크 프로토콜",
        is_correct: false,
      },
      {
        choice_text: "문서의 유형",
        is_correct: false,
      },
      {
        choice_text:
          "서비스 이름이나 인스턴스 ID와 같이 텔레메트리 데이터를 생성하는 엔티티를 설명하는 메타데이터",
        is_correct: true,
      },
    ],
  },
  {
    question_text:
      "OpenTelemetry에서 서비스 인스턴스를 고유하게 식별하는 데 사용해야 하는 속성은 무엇인가요?",
    explanation:
      "OpenTelemetry에서 'service.instance.id' 속성은 서비스 인스턴스를 고유하게 식별합니다.",
    choices: [
      {
        choice_text: "service.instance.id",
        is_correct: true,
      },
      {
        choice_text: "service.name",
        is_correct: false,
      },
      {
        choice_text: "service.version",
        is_correct: false,
      },
      {
        choice_text: "service.environment",
        is_correct: false,
      },
    ],
  },
];


이 워크숍의 이 부분에서 배운 것을 증명할 기회입니다.

다음 질문에 답해 보세요:

<Quiz questions={questions}></Quiz>
