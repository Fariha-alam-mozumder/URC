import 'package:flutter/material.dart';

void main() {
  runApp(const QuizApp());
}

class QuizApp extends StatelessWidget {
  const QuizApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'কুইজ আপ',
      theme: ThemeData(primarySwatch: Colors.deepPurple),
      home: const QuizPage(),
    );
  }
}

class QuizPage extends StatefulWidget {
  const QuizPage({super.key});

  @override
  State<QuizPage> createState() => _QuizPageState();
}

class _QuizPageState extends State<QuizPage> {
  int _questionIndex = 0;
  int _score = 0;

  final List<Map<String, Object>> _questions = [
    {
      'question': 'What is the capital of Bangladesh?',
      'answers': ['Dhaka', 'London', 'Berlin', 'Madrid'],
      'correct': 'Dhaka',
    },
    {
      'question': 'What is the color of Rose?',
      'answers': ['Red', 'Green', 'Blue', 'SKyBlue'],
      'correct': 'Red',
    },
    {
      'question': 'Which planet is known as the Red Planet?',
      'answers': ['Mars', 'Earth', 'Jupiter', 'Saturn'],
      'correct': 'Mars',
    },
    {
      'question': 'What is the capital of France ?',
      'answers': ['Paris', 'London', 'Berlin', 'Madrid'],
      'correct': 'Dhaka',
    },
    {
      'question': 'Which planet is known as the Red Planet?',
      'answers': ['Mars', 'Earth', 'Jupiter', 'Saturn'],
      'correct': 'Mars',
    },
  ];

  void _checkAnswer(String selectedAnswer) {
    String correctAnswer = _questions[_questionIndex]['correct'] as String;
    if (selectedAnswer == correctAnswer) {
      _score++;
    }

    setState(() {
      _questionIndex++;
    });
  }

  void _restartQuiz() {
    setState(() {
      _questionIndex = 0;
      _score = 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    bool quizEnded = _questionIndex >= _questions.length;

    return Scaffold(
      appBar: AppBar(title: const Text('কুইজ অ্যাপ')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: quizEnded
            ? Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Your score: $_score / ${_questions.length}',
                    style: const TextStyle(fontSize: 24),
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: _restartQuiz,
                    child: const Text('Restart Quiz'),
                  )
                ],
              )
            : Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    _questions[_questionIndex]['question'] as String,
                    style: const TextStyle(fontSize: 22),
                  ),
                  const SizedBox(height: 20),
                  ...(_questions[_questionIndex]['answers'] as List<String>)
                      .map((answer) {
                    return ElevatedButton(
                      onPressed: () => _checkAnswer(answer),
                      child: Text(answer),
                    );
                  }).toList(),
                ],
              ),
      ),
    );
  }
}
