import React, { useState, useEffect } from 'react'
import { TOKEN_KEY, PROFILE_KEY } from '../../utilis/constants'
import { Redirect } from '@docusaurus/router'
import QuizbaseImage from '@site/static/img/logo.svg'
import { logout } from '../../utilis/api/auth'
import { getAllContributorQuizs, getAllQuizs } from '../../utilis/api/admin'
import { createQuiz, editQuiz } from '../../utilis/api/quiz'
import Modal from '../../components/Modal'
import Spinner from '../../components/Spinner'
import Form from '../../components/Form'
import DeleteQuiz from '../../components/DeleteQuiz'
import { ToastContainer, toast } from 'react-toastify'

export default function AdminBoard() {
  const [quiz, setQuiz] = useState([])
  const [isModalOpen, setIsModalOpen] = useState('')
  const [editData, setEditData] = useState(null)
  const [quizTab, setQuizTab] = useState('allquiz')
  const [isVerify, setVerify] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [allContributor, setContributors] = useState([])

  let token
  let profile
  if (typeof window !== 'undefined') {
    token = localStorage.getItem(TOKEN_KEY)
    const parseddata = localStorage.getItem(PROFILE_KEY)
    profile = JSON.parse(parseddata)
  }

  if (!token || !profile.id) {
    return <Redirect to="/login" />
  }

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    try {
      setLoading(true)
      let quizResponse = await getAllQuizs()
      if (quizResponse) {
        setQuiz(quizResponse.data)
        setLoading(false)
      }
      let contributorsResponse = await getAllContributorQuizs()
      if (contributorsResponse) {
        setContributors(contributorsResponse.data)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      toast.error(error.message, {
        position: toast.POSITION.TOP_CENTER,
        Available: 2000,
        theme: 'colored'
      })
    } finally {
      setLoading(false)
    }
  }
  const handleModalChange = (isModalOpen) => {
    setIsModalOpen(isModalOpen)
  }

  const handleTabChange = (value) => {
    setQuizTab(value)
  }

  const createQuizhandler = async (formdata) => {
    try {
      const response = await createQuiz(formdata)
      if (response.success) {
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

        setQuiz((current) => [{ id: Math.random(), status: 'pending', ...formdata }, ...current])
        getData()
        handleModalChange('')
      }
    } catch (error) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        theme: 'colored'
      })
      handleModalChange('')
    }
  }
  const editHandler = async (id) => {
    quiz.map((content) => {
      return content.id === id ? setEditData(content) : null
    })
    handleModalChange('editQuizForm')
  }

  const editQuizHandler = async (id, formData) => {
    try {
      const response = await editQuiz(formData, id)
      if (response.success) {
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

        const newState = quiz.map((obj) => {
          if (obj.id === id) {
            return { id: Math.random(), status: 'pending', ...formData }
          }
          return obj
        })

        setQuiz(newState)
        getData()
        handleModalChange('')
      }
    } catch (error) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        theme: 'colored'
      })
    }
  }

  const deleteHandler = async (id) => {
    quiz.map((content) => {
      return content.id === id ? setEditData(id) : null
    })
    handleModalChange('deleteQuiz')
  }

  const verifyHandler = async (id) => {
    let quizitem = allContributor.find((content) => {
      return content.id === id
    })
    setEditData(quizitem)
    handleModalChange('verifyQuiz')
    setVerify(true)
  }

  return (
    <div className="h-screen overflow-auto bg-secondary">
      <div className="bg-white h-25 px-6 py-4 flex items-center justify-between">
        {' '}
        <a href="/">
          {' '}
          <QuizbaseImage className="w-fit h-10" />
        </a>
        <div className="flex items-center gap-8">
          {' '}
          <p className="font-bold text-primary text-base">
            <span className="text-base text-gray-100"> Status:</span>
            {profile.role.toUpperCase()}
          </p>
          <button
            onClick={() => logout()}
            className="bg-secondary hover:bg-secondary/50 cursor-pointer p-3 font-semibold"
          >
            Log Out
          </button>
        </div>
      </div>
      <section className="p-6 m-auto">
        <div className="relative font-bold text-base my-8 flex items-center justify-between">
          {' '}
          <div className="relative flex items-center justify-between gap-6">
            {' '}
            <span
              onClick={() => handleTabChange('contributorsquiz')}
              className={`${
                quizTab !== 'allquiz' ? 'text-success' : 'text-gray-100'
              } cursor-pointer`}
            >
              All Contributors Quiz
            </span>
            <span
              onClick={() => handleTabChange('allquiz')}
              className={`${
                quizTab === 'allquiz' ? 'text-success' : 'text-gray-100'
              } cursor-pointer`}
            >
              All Quiz
            </span>
          </div>
          {quizTab === 'allquiz' && (
            <button
              onClick={() => {
                setEditData(null), handleModalChange('createQuizForm')
              }}
              className="absolute right-10 hover:bg-primary/50 bg-primary font-bold text-white text-base px-4 py-2"
            >
              Create Quiz
            </button>
          )}
        </div>

        <div className="hidden md:block mx-auto my-6">
          {quizTab === 'allquiz' ? (
            isLoading ? (
              <Spinner width="40px" height="40px" color="#42b883" />
            ) : quiz.length ? (
              <div className="">
                <div className="flex items-center justify-between p-2 ">
                  <p className="py-2 px-4 w-[62px] font-bold text-lg">No.</p>
                  <p className="w-[170px] p-2 font-bold">Question</p>
                  <p className="w-[150px] p-2 font-bold">Correct</p>
                  <p className="w-[400px] p-2 font-bold">Incorrect Options</p>
                  <p className="w-[150px] p-2 font-bold">Others</p>
                  <p className="w-[100px] p-2 font-bold">Actions</p>
                </div>
                {quiz?.map((content, index) => {
                  return (
                    <div
                      key={content.id}
                      className="bg-white justify-between p-2 my-4 rounded-xl flex items-center border-[1px] border-solid border-gray-100"
                    >
                      <p className="px-4 py-2 w-[62px] font-bold text-lg">{index + 1}</p>
                      <p className="w-[170px]  p-2">{content.question}</p>
                      <p className="w-[150px]  p-2">{content.correct_answer}</p>
                      <div className="w-[400px]  p-2 m-0">
                        {content.incorrect_answers.map((ele, index) => (
                          <li className=" list-disc" key={index}>
                            {ele}
                          </li>
                        ))}
                      </div>

                      <div className="w-[150px]  flex flex-col justify-center gap-2 text-sm">
                        <p>
                          <span className="font-semibold pr-2 ">Category:</span>
                          {content.category}
                        </p>
                        <p>
                          <span className="font-semibold  pr-2">Difficulty:</span>
                          {content.difficulty}
                        </p>
                      </div>
                      <div className="w-[100px] p-2 flex flex-col gap-3">
                        {' '}
                        <button
                          onClick={() => editHandler(content.id)}
                          className="p-2 cursor-pointer w-[70px] font-bold block"
                        >
                          {' '}
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            deleteHandler(content.id)
                          }}
                          className="p-2 cursor-pointer w-[70px] font-bold block"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="absolute top-[55%] left-[50%] -translate-y-[50%] -translate-x-[50%]">
                <p className="text-4xl font-bold p-8  text-gray-100 bg-secondary/50 ">
                  No Quiz Available
                </p>
              </div>
            )
          ) : isLoading ? (
            <Spinner width="40px" height="40px" color="#42b883" />
          ) : allContributor.length ? (
            <div>
              <div className="flex items-center justify-between p-2 ">
                <p className="py-2 px-4 w-[90px] font-bold text-lg">Index</p>
                <p className="w-[270px] p-2 font-bold">Question</p>
                <p className="w-[270px] p-2 font-bold">Correct</p>
                <p className="w-[480px] p-2 font-bold">Incorrect Options</p>
                <p className="w-[150px] p-2 font-bold">Others</p>
                <p className="w-[100px] p-2 font-bold">Actions</p>
              </div>
              {allContributor.map((content, index) => {
                return (
                  <div
                    key={content.id}
                    className="relative bg-white justify-between px-4 py-8 my-4 rounded-xl flex items-center border-[1px] border-solid border-gray-100"
                  >
                    <span className="absolute top-4 left-10 text-sm">
                      Createdby:{' '}
                      <span className="text-sm text-primary font-semibold">
                        {content.contributor?.username}
                      </span>
                    </span>
                    <p className="px-4 py-2 w-[90px] font-bold text-lg">{index + 1}</p>
                    <p className="w-[270px] p-2">{content.question}</p>
                    <p className="w-[270px] p-2">{content.correct_answer}</p>

                    <div className="w-[480px] p-2 m-0">
                      {content.incorrect_answers.map((ele, index) => (
                        <li className="list-disc" key={index}>
                          {ele}
                        </li>
                      ))}
                    </div>

                    <div className="w-[150px] flex flex-col justify-center gap-2 text-sm">
                      <p>
                        <span className="font-semibold pr-2 ">Category:</span>
                        {content.category}
                      </p>
                      <p>
                        <span className="font-semibold  pr-2">Difficulty:</span>
                        {content.difficulty}
                      </p>
                      <div className="flex items-center">
                        {' '}
                        <span className="font-semibold  pr-2">Status:</span>
                        {content.status === 'pending' ? (
                          <button
                            onClick={() => verifyHandler(content.id)}
                            className={`text-error w-[70px] font-semibold w-15 p-2`}
                          >
                            {content.status}
                          </button>
                        ) : (
                          <p className="text-success font-semibold">{content.status}</p>
                        )}
                      </div>
                    </div>

                    <div className="w-[100px] p-2 flex flex-col gap-3">
                      {' '}
                      <button
                        onClick={() => editHandler(content.id)}
                        className="p-2 w-[70px] cursor-pointer font-bold block"
                      >
                        {' '}
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          deleteHandler(content.id)
                        }}
                        className="p-2 w-[70px] cursor-pointer font-bold block"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="absolute top-[55%] left-[50%] -translate-y-[50%] -translate-x-[50%]">
              <p className="text-4xl font-bold p-8  text-gray-100 bg-secondary/50 ">
                No Quiz Available
              </p>
            </div>
          )}
        </div>
      </section>
      {isModalOpen === 'editQuizForm' ? (
        <Modal
          children={<Form editData={editData} editQuizHandler={editQuizHandler} />}
          handleModalChange={handleModalChange}
        />
      ) : isModalOpen === 'createQuizForm' ? (
        <Modal
          handleModalChange={handleModalChange}
          children={<Form createQuizhandler={createQuizhandler} />}
        />
      ) : isModalOpen === 'deleteQuiz' ? (
        <Modal
          children={
            <DeleteQuiz
              getData={getData}
              editData={editData}
              setQuiz={setQuiz}
              handleModalChange={handleModalChange}
            />
          }
          handleModalChange={handleModalChange}
        />
      ) : isModalOpen === 'verifyQuiz' ? (
        <Modal
          children={
            <DeleteQuiz
              isVerify={isVerify}
              getData={getData}
              editData={editData}
              handleModalChange={handleModalChange}
              handleTabChange={handleTabChange}
            />
          }
          handleModalChange={handleModalChange}
        />
      ) : null}
      <ToastContainer />
    </div>
  )
}

// Admin can edit contributor quiz
// reoranise the endpoint folder
