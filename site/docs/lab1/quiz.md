---
sidebar_position: 4
---

# End of Lab 1 Quiz

import Quiz from '@site/src/components/Quiz';

{/* prettier-ignore */}
export const questions = [
  {
    question_text: "What is OpenTelemetry?",
    explanation:
      "OpenTelemetry is a set of tools and standards for observability.",
    choices: [
      {
        choice_text: "A programming language",
        is_correct: false,
      },
      {
        choice_text: "A set of tools and standards for observability",
        is_correct: true,
      },
      {
        choice_text: "A database for storing telemetry",
        is_correct: false,
      },
      {
        choice_text: "An application development framework",
        is_correct: false,
      },
    ],
  },
  {
    question_text: 'What is a "span" in the context of OpenTelemetry?',
    explanation:
      "In OpenTelemetry, a span is a unit of work or operation, which is the building block of a Trace.",
    choices: [
      {
        choice_text: "A type of database query",
        is_correct: false,
      },
      {
        choice_text:
          "A unit of work or operation, which is the building block of a Trace",
        is_correct: true,
      },
      {
        choice_text: "A user interface component",
        is_correct: false,
      },
      {
        choice_text: "A network protocol",
        is_correct: false,
      },
    ],
  },
  {
    question_text: "In OpenTelemetry, what is a resource?",
    explanation:
      "In OpenTelemetry, a resource is a set of attributes that describe the entity producing telemetry data.",
    choices: [
      {
        choice_text:
          "A set of attributes that describe the entity producing telemetry data",
        is_correct: true,
      },
      {
        choice_text: "A type of database used to store telemetry data",
        is_correct: false,
      },
      {
        choice_text:
          "A user interface component for visualizing telemetry data",
        is_correct: false,
      },
      {
        choice_text: "A network protocol for transmitting telemetry data",
        is_correct: false,
      },
    ],
  },
  {
    question_text: "In OpenTelemetry, what is a resource attribute?",
    explanation:
      "In OpenTelemetry, a resource attribute is metadata that describes the entity producing the telemetry data, such as a service name or instance ID.",
    choices: [
      {
        choice_text: "A configuration parameter used to customize log output",
        is_correct: false,
      },
      {
        choice_text: "A network protocol for transmitting telemetry data",
        is_correct: false,
      },
      {
        choice_text: "A type of document",
        is_correct: false,
      },
      {
        choice_text:
          "Metadata that describes the entity producing the telemetry data, such as a service name or instance ID",
        is_correct: true,
      },
    ],
  },
  {
    question_text:
      "Which attribute in OpenTelemetry should be used to uniquely identify an instance of a service?",
    explanation:
      "In OpenTelemetry, the 'service.instance.id' attribute uniquely identifies an instance of a service.",
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


Now's your chance to prove what you've learned in this part of the workshop. 

See if you can answer the following questions:

<Quiz questions={questions}></Quiz>
