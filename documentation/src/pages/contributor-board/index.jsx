import React, { useState, useEffect } from 'react'
import { TOKEN_KEY, PROFILE_KEY } from '../../utilis/constants'
import { Redirect } from '@docusaurus/router'
import QuizbaseImage from '@site/static/img/logo.svg'
import { getContributor } from '../../utilis/api/contributor'
import Modal from '../../components/Modal'
import Spinner from '../../components/Spinner'
import { createQuiz, editQuiz } from '../../utilis/api/quiz'
import Form from '../../components/Form'
import DeleteQuiz from '../../components/DeleteQuiz'
import { ToastContainer, toast } from 'react-toastify'
import { logout } from '../../utilis/api/auth'

export default function ContributorBoard() {
  const [quiz, setQuiz] = useState([])
  const [isModalOpen, setIsModalOpen] = useState('openForm' | 'deletequiz' | 'close')
  const [editData, setEditData] = useState(null)

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

  if (profile.role !== 'contributor') {
    return <Redirect to="/admin-board" />
  }

  useEffect(() => {
    contributorData()
  }, [])

  const contributorData = async () => {
    try {
      let response = await getContributor(profile.id)
      if (response.success) {
        setQuiz(response.data.quiz)
      }
    } catch (error) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        theme: 'colored'
      })
    }
  }
  const handleModalChange = (isModalOpen) => {
    setIsModalOpen(isModalOpen)
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
        contributorData()
      
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        theme: 'colored'
      })
    }finally{
      handleModalChange('')
    }
  }
  const editQuizdata = async (id) => {
    quiz.map((content) => {
      return content.id === id ? setEditData(content) : null
    })
    setIsModalOpen('openForm')
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
        contributorData()
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
    setIsModalOpen('deletequiz')
  }

  return (
    <div className="h-screen overflow-y-auto bg-secondary">
      <div className="bg-white h-25 px-6 py-4 flex items-center justify-between">
        <QuizbaseImage className="w-fit h-10" />
        <div className="flex items-center gap-8">
          {' '}
          {profile.role.length ? (
            <p className="font-bold text-primary text-base">
              <span className="text-base text-gray-100"> Status: </span>
              {profile.role.toUpperCase()}
            </p>
          ) : (
            ''
          )}
          <button
            onClick={() => logout()}
            className="bg-secondary hover:bg-secondary/50 cursor-pointer p-3 font-semibold"
          >
            Log Out
          </button>
        </div>
      </div>

      <section className="p-6 m-auto">
        <div className="font-bold text-xl my-8 flex items-center justify-between">
          {' '}
          <h3>Contributor Quiz</h3>
          <button
            onClick={() => {
              setEditData(null), setIsModalOpen('openForm')
            }}
            className="hover:bg-primary/50 bg-primary font-bold text-white text-base px-4 py-2"
          >
            Create Quiz
          </button>
        </div>
        {quiz.length ? (
          <div className="hidden md:block">
            <div className="flex items-center justify-between p-2 ">
              <p className="py-2 px-4 w-[64px] font-bold text-lg">No.</p>
              <p className="w-[270px] p-2 font-bold">Question</p>
              <p className="w-[270px] p-2 font-bold">Correct</p>
              <p className="w-[480px] p-2 font-bold">Incorrect Options</p>
              <p className="w-[150px] p-2 font-bold">Others</p>
              <p className="w-[100px] p-2 font-bold">Actions</p>
            </div>
            {quiz.map((content, index) => {
              return (
                <div
                  key={content.id}
                  className="bg-white justify-between p-2 my-4 rounded-xl flex items-center border-[1px] border-solid border-gray-100"
                >
                  <p className="px-4 py-2 w-[64px] font-bold text-lg">{index + 1}</p>
                  <p className="w-[270px] p-2">{content.question}</p>
                  <p className="w-[270px] p-2">{content.correct_answer}</p>

                  <div className="w-[480px] p-2 m-0">
                    {content.incorrect_answers.map((ele, index) => (
                      <li className=" list-disc" key={index}>
                        {ele}
                      </li>
                    ))}
                  </div>

                  <div className=" flex flex-col justify-center gap-2 text-sm w-[150px] text-sm">
                    <p>
                      <span className="font-semibold pr-2">Category:</span>
                      {content.category}
                    </p>
                    <p>
                      <span className="font-semibold pr-2">Difficulty:</span>
                      {content.difficulty}
                    </p>
                    <p
                      className={`${
                        content.status === 'pending' ? 'text-error' : 'text-success'
                      } font-semibold`}
                    >
                      {' '}
                      <span className="font-semibold text-black pr-2"> Status:</span>{' '}
                      {content?.status}
                    </p>
                  </div>
                  <div className="w-[100px] p-2 flex flex-col gap-3 ">
                    {' '}
                    <button
                      disabled={content.status === 'verified'}
                      onClick={() => editQuizdata(content.id)}
                      className={`${
                        content.status === 'verified' ? 'bg-secondary/50' : 'bg-gray-100'
                      } p-2 cursor-pointer w-[70px] font-bold block`}
                    >
                      {' '}
                      Edit
                    </button>
                    <button
                      disabled={content.status === 'verified'}
                      onClick={() => {
                        deleteHandler(content.id)
                      }}
                      className={`${
                        content.status === 'verified' ? 'bg-secondary/50' : ' bg-gray-100'
                      } p-2 cursor-pointer w-[70px] font-bold block`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : quiz.length === ' ' ? (
          <div className="absolute top-[55%] left-[50%] -translate-y-[50%] -translate-x-[50%]">
            <p className="text-4xl font-bold p-8 text-gray-100 bg-secondary/50">
              No Quiz Available
            </p>
          </div>
        ) : (
          <Spinner width="40px" height="40px" color="#42b883" />
        )}
      </section>
      {isModalOpen === 'openForm' ? (
        editData ? (
          <Modal
            children={<Form editData={editData} editQuizHandler={editQuizHandler} />}
            handleModalChange={handleModalChange}
          />
        ) : (
          <Modal
            handleModalChange={handleModalChange}
            children={<Form createQuizhandler={createQuizhandler} />}
          />
        )
      ) : isModalOpen === 'deletequiz' ? (
        <Modal
          children={
            <DeleteQuiz
              setQuiz={setQuiz}
              getData={contributorData}
              editData={editData}
              handleModalChange={handleModalChange}
            />
          }
          handleModalChange={handleModalChange}
        />
      ) : null}
      <ToastContainer />
    </div>
  )
}

// contributor or admin can delete their account