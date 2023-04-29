---
sidebar_position: 1
---

# Getting Started

**QUIZBASE** is free JSON API for multiple choice trivia questions in programming. You get questions on wide variety of topics in programming. You can test your knowledge of different programming languages. No API key is required.

## Request Query

You can search for questions using any of the following queries:

**Category**

- HTML
- CSS
- Javascript

**Difficulty**

- Easy
- Medium.
- Hard

**Limit**

- Minimum - 5

## Example

```
fetch('https://quizbase.onrender.com/api/v1/quiz')
      .then(response => response.json())
      .then(json => console.log(json))

```

#### Response Data

```
[
  {
    "category": "HTML",
    "difficulty": "easy",
    "question": "What is HTML",
    "incorrect_answers": [
      "Hypertext",
      "HyperText Markbook",
      "Function"
    ],
    "correct_answer": "HyperText Markup language",
    "id": "640de1c638907a48c75eccbc"
  },

]
```
