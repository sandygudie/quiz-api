import React, { useState } from 'react'
import { deleteQuiz, createQuiz } from '../../utilis/api/quiz'
import { toast } from 'react-toastify'
import Spinner from '../Spinner'
import { verifyContributorQuiz } from '../../utilis/api/admin'

export default function index({
  setQuiz,
  editData,
  handleModalChange,
  handleTabChange,
  isVerify,
  getData
}) {
  const [isLoading, setLoading] = useState(false)

  const verifyQuizHandler = async (quizitem) => {
    setLoading(true)
    try {
      const formData = {
        category: quizitem.category,
        difficulty: quizitem.difficulty,
        question: quizitem.question,
        correct_answer: quizitem.correct_answer,
        incorrect_answers: [
          quizitem.incorrect_answers[0],
          quizitem.incorrect_answers[1],
          quizitem.incorrect_answers[2]
        ]
      }
      let response = await createQuiz(formData)
      if (response.success) {
        let verifyResponse = await verifyContributorQuiz(quizitem.id)
        if (verifyResponse.success) {
          setLoading(false)
          toast(<p className="text-lg font-semibold text-green-700">Quiz added </p>, {
            position: 'top-center',
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: 'light'
          })
        }
      }
      getData()
      handleModalChange('')
      handleTabChange('allquiz')
    } catch (error) {
      setLoading(false)
      toast.error(error.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        theme: 'colored'
      })
    }
  }

  const deleteQuizHandler = async () => {
    setLoading(true)
    try {
      const response = await deleteQuiz(editData)
      if (response.success) {
        setQuiz((current) =>
          current.filter((quiz) => {
            return quiz.id !== editData
          })
        )

        toast(<p className="text-lg font-semibold text-green-700">{response.success}</p>, {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: 'light'
        })
      }
      getData()
      handleModalChange('')
    } catch (error) {
      setLoading(false)
      toast.error(error.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        theme: 'colored'
      })
    }
  }
  return (
    <div className="h-48 p-8">
      <h1 className="text-2xl text-center font-bold mb-4">
        {' '}
        {isVerify ? ' Verify Quiz' : 'Delete Quiz'}
      </h1>
      <p className="text-center text-lg">
        {' '}
        {isVerify
          ? ' Quiz will be added to the main database'
          : 'Are you sure you want to delete quiz?'}
      </p>
      <div className="text-center flex items-center justify-around mt-8">
        <button
          className="p-3 px-6 w-40 h-12 text-white hover:bg-primary/70 hover:text-secondary px-4 rounded-md bg-primary font-bold"
          type="button"
          onClick={() => {
            isVerify ? verifyQuizHandler(editData) : deleteQuizHandler()
          }}
        >
          {' '}
          {isLoading ? <Spinner width="30px" height="30px" color="#fff" /> : 'Continue'}
        </button>
        <button
          className="p-3 px-6 w-40 text-white font-bold hover:bg-primary/70 hover:text-secondary duration-300 px-4 rounded-md bg-primary"
          type="button"
          onClick={() => handleModalChange()}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
