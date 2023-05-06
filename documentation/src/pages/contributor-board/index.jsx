import React, { useState, useEffect } from 'react'
import { TOKEN_KEY, PROFILE_KEY } from '../../utilis/constants'
import { Redirect } from '@docusaurus/router'
import QuizbaseImage from '@site/static/img/logo.svg'
import { getContributor} from '../../utilis/api/contributor'
import Modal from '../../components/Modal'
import Spinner from '../../components/Spinner'
import Form from '../../components/Form'
import DeleteQuiz from '../../components/DeleteQuiz'
import { ToastContainer, toast } from 'react-toastify'
import { logout } from '../../utilis/api/auth'

export default function ContributorBoard() {
  const [quiz, setQuiz] = useState([])

  const [isModalOpen, setIsModalOpen] = useState('openForm' | 'deletequiz' | 'close')
  const [isLoading, setLoading] = useState(false)
  const [editData, setEdit] = useState(null)

  let token
  let profile
  if (typeof window !== 'undefined') {
    token = localStorage.getItem(TOKEN_KEY)
    const parseddata = localStorage.getItem(PROFILE_KEY)
    profile = JSON.parse(parseddata)
  }

  // what if token is expired or invalid or fake
  // remove token and profile is anything goes wrong
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
    setLoading(true)
    try {
      let response = await getContributor(profile.id)
      // console.log(response)
      if (response.success) {
        setQuiz(response.data.quiz)
     
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

  return (
    <div className="h-screen overflow-y-auto  bg-secondary">
      
        <div className="bg-white h-25 px-6 py-4 flex items-center justify-between ">
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
              setEdit(null), setIsModalOpen('openForm')
            }}
            className="hover:bg-primary/50 bg-primary font-bold text-white text-base px-4 py-2"
          >
            Create Quiz
          </button>
        </div>
        {isLoading ? (
          <Spinner width="40px" height="40px" color="#fff" />
        ) : quiz.length ? (
          <div>
            <div className="flex items-center justify-between p-2 ">
              <p className="py-2 px-4 w-[96px] font-bold text-lg">Index</p>
              <p className="w-[256px] p-2  font-bold">Question</p>
              <p className="w-[256px] p-2 font-bold">Correct</p>
              <p className="w-[256px] p-2  font-bold">Incorrect Options</p>
              <p className="w-[112px] p-2  font-bold">Category</p>
              <p className="w-[112px] p-2 font-bold">Difficulty</p>
              <p className="w-[112px] p-2 font-bold">Actions</p>
              <p className="w-[112px] p-2 font-bold">Status</p>
            </div>
            {quiz.map((content, index) => {
              return (
                <div
                  key={content.id}
                  className="bg-white justify-between p-2 my-4 rounded-xl flex items-center border-[1px] border-solid border-gray-100"
                >
                  <p className="px-4 py-2 w-[96px] font-bold text-lg">{index + 1}</p>
                  <p className="w-[256px]  p-2">{content.question}</p>
                  <p className="w-[256px]  p-2">{content.correct_answer}</p>

                  <div className="w-[256px] p-2 m-0">
                    {content.incorrect_answers.map((ele, index) => (
                      <li className=" list-disc" key={index}>
                        {ele}
                      </li>
                    ))}
                  </div>

                  <p className="w-[112px] p-2">{content.category}</p>
                  <p className="w-[112px] p-2">{content.difficulty}</p>
                  <div className="w-[112px] p-2 flex flex-col gap-3">
                    {' '}
                    <button
                      disabled={content.status === 'verified'}
                      onClick={() => editHandler(content.id)}
                      className={`${
                        content.status === 'verified' ? 'bg-secondary/50' : ' bg-gray-100'
                      } p-2 cursor-pointer w-[96px] font-bold block`}
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
                      } p-2 cursor-pointer w-[96px] font-bold block`}
                    >
                      Delete
                    </button>
                  </div>
                  <p
                    className={`${
                      content.status === 'pending' ? 'text-error' : 'text-success'
                    } font-semibold w-[96px] p-2`}
                  >
                    {' '}
                    {content?.status}
                  </p>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="absolute top-[55%] left-[50%] -translate-y-[50%] -translate-x-[50%]">
            <p className="text-4xl font-bold p-8  text-gray-100 bg-secondary/50 ">No Quiz Added</p>
          </div>
        )}
      </section>
      {isModalOpen === 'openForm' ? (
        editData ? (
          <Modal
            children={
              <Form
                editData={editData}
                contributorData={contributorData}
                handleModalChange={handleModalChange}
              />
            }
            handleModalChange={handleModalChange}
          />
        ) : (
          <Modal
            handleModalChange={handleModalChange}
            children={
              <Form getData={contributorData} handleModalChange={handleModalChange} />
            }
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
