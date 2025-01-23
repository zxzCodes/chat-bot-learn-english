"use client"

import React from "react"
import type { Answer, Question, Quiz as QuizType } from "@prisma/client"
import { useState} from "react"
import { AnimatePresence } from "framer-motion"
import { motion } from "framer-motion"
import { Button } from "./ui/button"

interface QuizWithRelations extends QuizType {
  questions: (Question & {
    answers: Answer[]
  })[]
}

const Quiz = ({ quiz }: { quiz: QuizWithRelations }) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [score, setScore] = useState<number>(0)
  const [showResults, setShowResults] = useState<boolean>(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [incorrectAnswers, setIncorrectAnswers] = useState<
    { question: string; userAnswer: string; correctAnswer: string }[]
  >([])


  const questions = quiz.questions



  const handleAnswer = () => {
    if (selectedAnswer !== null) {
      const isCorrect = questions[currentQuestion].answers[selectedAnswer].correct // Check if the selected answer is correct
      if (isCorrect) {
        setScore(score + 1) // Increment the score if the answer is correct
      } else {
        const correctAnswer = questions[currentQuestion].answers.find((a) => a.correct)?.text || "" // Find the correct answer
        setIncorrectAnswers([ // Add the incorrect answer to the array
          ...incorrectAnswers, // Add the incorrect answer to the array
          {
            question: questions[currentQuestion].text, // Add the question, user answer and correct answer to the array
            userAnswer: questions[currentQuestion].answers[selectedAnswer].text, // Add the question, user answer and correct answer to the array
            correctAnswer, // Add the question, user answer and correct answer to the array
          },
        ])
      }

      if (currentQuestion < questions.length - 1) { // Check if there are more questions
        setCurrentQuestion(currentQuestion + 1) // Move to the next question
        setSelectedAnswer(null) // Reset the selected answer
      } else {
        setShowResults(true) // Show the results
      }
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowResults(false)
    setSelectedAnswer(null)
    setIncorrectAnswers([])
  }

  return (
    <div className="min-h-screen p-6">
    
      
      <div className="max-w-2xl mx-auto  rounded-2xl shadow-xl p-8 mt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            🎓 Quiz Time
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Test your knowledge!</p>
        </div>

        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="py-4"
            >
              <h3 className="mb-4 text-xl font-medium text-gray-800 dark:text-gray-100">
                Question {currentQuestion + 1} of {questions.length}
              </h3>
              <p className="mb-6 text-gray-700 dark:text-gray-200">{questions[currentQuestion].text}</p>
              <motion.div className="space-y-3">
                {questions[currentQuestion].answers.map((answer, index) => (
                  <motion.div
                    key={index}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedAnswer === index
                        ? "bg-blue-500 text-white shadow-blue-500/25"
                        : "bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-lg"
                    } shadow-md`}
                    onClick={() => setSelectedAnswer(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {answer.text}
                  </motion.div>
                ))}
              </motion.div>
              <Button
                disabled={selectedAnswer === null}
                onClick={handleAnswer}
                className="mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
              >
                {currentQuestion < questions.length - 1 ? "Next Question ➡️" : "Finish Quiz 🏁"}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="py-4"
            >
              <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
                🎉 Quiz Results
              </h3>
              <p className="mb-6 text-lg text-gray-700 dark:text-gray-200">
                You scored {score} out of {questions.length} questions correctly!
              </p>
              
              {incorrectAnswers.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-4">Review Incorrect Answers</h4>
                  {incorrectAnswers.map((item, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl shadow-md">
                      <p className="font-medium text-gray-800 dark:text-gray-100 mb-3">{item.question}</p>
                      <p className="text-red-500 dark:text-red-400 mb-2">Your answer: {item.userAnswer}</p>
                      <p className="text-emerald-500 dark:text-emerald-400">Correct answer: {item.correctAnswer}</p>
                    </div>
                  ))}
                </div>
              )}

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="text-center text-6xl my-8"
              >
                {score === questions.length ? "🏆" : score >= questions.length / 2 ? "👍" : "💪"}
              </motion.div>
              
              <Button 
                onClick={resetQuiz} 
                className="w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
              >
                Try Again 🔄
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Quiz