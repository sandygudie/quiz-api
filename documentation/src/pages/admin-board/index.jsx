import React, { useState, useEffect } from 'react'
import { TOKEN_KEY, PROFILE_KEY } from '../../utilis/constants'
import { Redirect } from '@docusaurus/router'
import QuizbaseImage from '@site/static/img/logo.svg'
import { logout } from '../../utilis/api/auth'
import {
  getAllContributorQuizs,
  verifyContributorQuiz,
  createQuiz,
  getAllQuizs
} from '../../utilis/api/admin'
import Modal from '../../components/Modal'
import Spinner from '../../components/Spinner'
import Form from '../../components/Form'
import DeleteQuiz from '../../components/DeleteQuiz'
import { ToastContainer, toast } from 'react-toastify'

export default function AdminBoard() {
  const [quiz, setQuiz] = useState([])

  const [isModalOpen, setIsModalOpen] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [editData, setEdit] = useState(null)
  const [quizData, setQuizData] = useState('allquiz')

  let token
  if (typeof window !== 'undefined') {
    token = localStorage.getItem(TOKEN_KEY)
  }
  // what if token is expired or invalid or fake
  // remove token and profile is anything goes wrong
  if (!token) {
    return <Redirect to="/login" />
  }

  useEffect(() => {
    getData()
  }, [quizData])

  const getData = async () => {
    setLoading(true)
    try {
      let response
      if (quizData === 'allquiz') {
        response = await getAllQuizs()
      } else {
        response = await getAllContributorQuizs()
      }

      if (response.success) {
        setQuiz(response.data)
        setLoading(false)
      }
    } catch (error) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
        theme: 'colored'
      })
    }
  }
  const handleModalChange = (isModalOpen) => {
    setIsModalOpen(isModalOpen)
  }

  const editHandler = async (id) => {
    quiz.map((content) => {
      return content.id === id ? setEdit(content) : null
    })
    setIsModalOpen('openForm')
  }

  const deleteHandler = async (id) => {
    quiz.map((content) => {
      return content.id === id ? setEdit(id) : null
    })
    setIsModalOpen('deletequiz')
  }

  const verifyQuizHandler = async (id) => {
    try {
      let quizitem = quiz.find((content) => {
        return content.id === id
      })

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
        let verifyResponse = await verifyContributorQuiz(id)
        if (verifyResponse) {
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
    } catch (error) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
        theme: 'colored'
      })
    }
  }
  return (
    <div className="h-screen  overflow-auto bg-secondary">
      <div className="bg-white h-25 pr-32 pl-0  py-4">
        <div className="flex items-center justify-between ">
          {' '}
          <QuizbaseImage className="w-30 h-10" />
          <div className="flex items-center gap-8">
            {' '}
            <p className="font-bold text-lg">
              <span className="text-base"> Status:</span>
              Admin
            </p>
            <button
              onClick={() => logout()}
              className="bg-secondary hover:bg-secondary/50 cursor-pointer p-3 font-semibold"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
      <section className="w-11/12 m-auto h-full">
        <div className="font-bold text-base my-8 flex items-center justify-between">
          {' '}
          <div className="relative flex items-center justify-between gap-6">
            {' '}
            <span
              onClick={() => setQuizData('')}
              className={`${
                quizData !== 'allquiz' ? 'text-success' : 'text-gray-100'
              } cursor-pointer`}
            >
              All Contributors Quiz
            </span>
            <span
              onClick={() => setQuizData('allquiz')}
              className={`${
                quizData === 'allquiz' ? 'text-success' : 'text-gray-100'
              } cursor-pointer`}
            >
              All Quiz
            </span>
          </div>
          {quizData === 'allquiz' && (
            <button
              onClick={() => {
                setEdit(null), setIsModalOpen('openForm')
              }}
              className="hover:bg-primary/50 bg-primary font-bold text-white text-base px-4 py-2"
            >
              Create Quiz
            </button>
          )}
        </div>
        {quizData === 'allquiz' ? (
          <div className="mx-auto my-6">
            {isLoading ? (
              <Spinner width="40px" height="40px" color="#fff" />
            ) : quiz.length ? (
              <div className="">
                <div className="flex items-center justify-between p-2 ">
                  <p className=" py-2 px-4 w-20 font-bold text-lg">Index</p>
                  <p className="w-64 p-2   font-bold">Question</p>
                  <p className="w-64 p-2  font-bold">Correct</p>
                  <p className="w-64 p-2  font-bold">Incorrect Options</p>
                  <p className="w-24 p-2  font-bold">Category</p>
                  <p className="w-24 p-2 font-bold">Difficulty</p>
                  <p className="w-24 p-2 font-bold">Actions</p>
                  <p className="w-24 p-2 font-bold">Status</p>
                </div>
                {quiz.map((content, index) => {
                  return (
                    <div
                      key={content.id}
                      className="bg-white justify-between p-2 my-4 rounded-xl flex items-center border-[1px] border-solid border-gray-100"
                    >
                      <p className="px-4 py-2 w-20 font-bold text-lg">{index + 1}</p>
                      <p className="w-64  p-2">{content.question}</p>
                      <p className="w-64  p-2">{content.correct_answer}</p>

                      <div className="w-64 p-2 m-0">
                        {content.incorrect_answers.map((ele, index) => (
                          <li className=" list-disc" key={index}>
                            {ele}
                          </li>
                        ))}
                      </div>

                      <p className="w-24 p-2">{content.category}</p>
                      <p className="w-24 p-2">{content.difficulty}</p>
                      <div className="w-24 p-2 flex flex-col gap-3">
                        {' '}
                        <button
                          onClick={() => editHandler(content.id)}
                          className="p-2 cursor-pointer font-bold block"
                        >
                          {' '}
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            deleteHandler(content.id)
                          }}
                          className="p-2 cursor-pointer font-bold block"
                        >
                          Delete
                        </button>
                      </div>
                      {content.status === 'pending' ? (
                        <button
                          onClick={() => verifyQuizHandler(content.id)}
                          className={`text-error font-semibold w-24 p-2`}
                        >
                          {' '}
                          {content.status}
                        </button>
                      ) : (
                        <p className="text-success font-semibold w-24 p-2">{content.status}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="absolute top-[55%] left-[50%] -translate-y-[50%] -translate-x-[50%]">
                <p className="text-4xl font-bold p-8  text-gray-100 bg-secondary/50 ">
                  No Quiz Added
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="w-11/12 mx-auto my-6">
            {isLoading ? (
              <Spinner width="40px" height="40px" color="#fff" />
            ) : quiz.length ? (
              <div className="">
                <div className="flex items-center justify-between p-2 ">
                  <p className=" py-2 px-4 w-20 font-bold text-lg">Index</p>
                  <p className="w-64 p-2   font-bold">Question</p>
                  <p className="w-64 p-2  font-bold">Correct</p>
                  <p className="w-64 p-2  font-bold">Incorrect Options</p>
                  <p className="w-24 p-2  font-bold">Category</p>
                  <p className="w-24 p-2 font-bold">Difficulty</p>
                  <p className="w-24 p-2 font-bold">Actions</p>
                  <p className="w-24 p-2 font-bold">Status</p>
                </div>
                {quiz.map((content, index) => {
                  return (
                    <div
                      key={content.id}
                      className="bg-white  justify-between p-2 my-4 rounded-xl flex items-center border-[1px] border-solid border-gray-100"
                    >
                      <p className="px-4 py-2 w-20 font-bold text-lg">{index + 1}</p>
                      <p className="w-64  p-2">{content.question}</p>
                      <p className="w-64  p-2">{content.correct_answer}</p>

                      <div className="w-64 p-2 m-0">
                        {content.incorrect_answers.map((ele, index) => (
                          <li className=" list-disc" key={index}>
                            {ele}
                          </li>
                        ))}
                      </div>

                      <p className="w-24 p-2">{content.category}</p>
                      <p className="w-24 p-2">{content.difficulty}</p>
                      <div className="w-24 p-2 flex flex-col gap-3">
                        {' '}
                        <button
                          onClick={() => editHandler(content.id)}
                          className="p-2 cursor-pointer font-bold block"
                        >
                          {' '}
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            deleteHandler(content.id)
                          }}
                          className="p-2 cursor-pointer font-bold block"
                        >
                          Delete
                        </button>
                      </div>
                      {content.status === 'pending' ? (
                        <button
                          onClick={() => verifyQuizHandler(content.id)}
                          className={`text-error font-semibold w-24 p-2`}
                        >
                          {' '}
                          {content.status}
                        </button>
                      ) : (
                        <p className="text-success font-semibold w-24 p-2">{content.status}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="absolute top-[55%] left-[50%] -translate-y-[50%] -translate-x-[50%]">
                <p className="text-4xl font-bold p-8  text-gray-100 bg-secondary/50 ">
                  No Quiz Added
                </p>
              </div>
            )}
          </div>
        )}
      </section>
      {isModalOpen === 'openForm' ? (
        editData ? (
          <Modal
            children={
              <Form editData={editData} getData={getData} handleModalChange={handleModalChange} />
            }
            handleModalChange={handleModalChange}
          />
        ) : (
          <Modal
            handleModalChange={handleModalChange}
            children={<Form getData={getData} handleModalChange={handleModalChange} />}
          />
        )
      ) : isModalOpen === 'deletequiz' ? (
        <Modal
          children={<DeleteQuiz editData={editData} handleModalChange={handleModalChange} />}
          handleModalChange={handleModalChange}
        />
      ) : null}
      <ToastContainer />
    </div>
  )
}

// if there is network issue error handling use react query
