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
import CheckBox from '../../components/Checkbox'
import PaginatedContributor from '../../components/PaginatedContributor'

export default function ContributorBoard() {
  const [quiz, setQuiz] = useState([])
  const [filteredQuiz, setFilteredQuiz] = useState([])
  const [isModalOpen, setIsModalOpen] = useState('openForm' | 'deletequiz' | 'close')
  const [editData, setEditData] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [filteredCategory, setFilteredCategory] = useState('')
  const [filteredDifficulty, setFilteredDifficulty] = useState('')

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
      setLoading(true)
      let response = await getContributor(profile.id)
      if (response.success) {
        setQuiz(response.data.quiz)
        setFilteredQuiz(response.data.quiz)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      toast.error(error.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        theme: 'colored'
      })
    } finally {
      setLoading(false)
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
      toast.error(error.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        theme: 'colored'
      })
    } finally {
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

  const changeHandlerStatus = (e) => {
    setStatus(e.target.value)
    filteredQuizHandler(e.target.value)
  }

  const filteredQuizHandler = (filtered) => {
    const newQuiz =
      filteredQuiz.length && filteredQuiz[0].status === filtered
        ? filteredQuiz.filter((ele) => ele.status === filtered)
        : quiz.filter((ele) => ele.status === filtered)
    setFilteredQuiz(newQuiz)
  }

  const filteredQuizHandlerCategory = (category) => {
    const newQuiz =
      filteredQuiz.length && filteredQuiz[0].category === category
        ? filteredQuiz.filter((ele) => ele.category === category)
        : []

    setFilteredQuiz(newQuiz)
  }

  const changeHandlerCategory = (e) => {
    setFilteredCategory(e.target.value)
    filteredQuizHandlerCategory(e.target.value)
  }

  return (
    <div className="h-screen bg-secondary">
      <div className="bg-white h-25 px-6 py-4 flex items-center justify-between">
      <QuizbaseImage className="w-20 md:w-fit h-10" />
        <div className="flex items-center gap-8">
          {' '}
          {profile.role.length ? (
            <p className="hidden sm:block font-bold text-primary text-base">
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

      <section className="overflow-x-auto p-6 m-auto">
        <div className="font-bold text-xl my-8 md:flex items-center justify-between">
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
        {/* add icons to filter */}
        <div className="flex items-center gap-4 justify-start my-4">
          <p>Filter</p>
          <div className="group cursor-pointer relative border-solid border-gray-500 px-2 py-1 text-base rounded-md bg-white">
            Status
            <div className="hidden group-hover:block absolute w-48 rounded-md p-3 bg-gray-100">
              <CheckBox
                changed={(e) => changeHandlerStatus(e)}
                id="status-1"
                isSelected={status === 'pending'}
                label="pending"
                value="pending"
              />
              <CheckBox
                changed={(e) => changeHandlerStatus(e)}
                id="status-2"
                isSelected={status === 'verified'}
                label="verified"
                value="verified"
              />
            </div>
          </div>
          <div className="group cursor-pointer border-solid border-1 border-gray-500 px-2 py-1 text-base rounded-md bg-white">
            Category
            <div className="hidden group-hover:block absolute w-48 rounded-md p-3 bg-gray-100">
              <CheckBox
                changed={(e) => changeHandlerCategory(e)}
                id="category-1"
                isSelected={filteredCategory === 'HTML'}
                label="HTML"
                value="HTML"
              />
              <CheckBox
                changed={(e) => changeHandlerCategory(e)}
                id="category-2"
                isSelected={filteredCategory === 'CSS'}
                label="CSS"
                value="CSS"
              />
              <CheckBox
                changed={(e) => changeHandlerCategory(e)}
                id="category-3"
                isSelected={filteredCategory === 'Javascript'}
                label="Javascript"
                value="Javascript"
              />
            </div>
          </div>
          <div className="group cursor-pointer  border-solid border-1 border-gray-500 px-2 py-1 text-base rounded-md bg-white">
            Difficulty
            <div className="hidden group-hover:block absolute w-48 rounded-md p-3 bg-gray-100">
              <CheckBox
                changed={(e) => radioChangeHandler(e)}
                id="difficulty-1"
                isSelected={status === 'easy'}
                label="easy"
                value="easy"
              />
              <CheckBox
                changed={(e) => radioChangeHandler(e)}
                id="difficulty-2"
                isSelected={status === 'medium'}
                label="medium"
                value="medium"
              />
              <CheckBox
                changed={(e) => radioChangeHandler(e)}
                id="difficulty-3"
                isSelected={status === 'hard'}
                label="hard"
                value="hard"
              />
            </div>
          </div>
        </div>
        {isLoading ? (
          <Spinner width="40px" height="40px" color="#42b883" />
        ) : filteredQuiz.length ? (
          <div className="w-[60em]  md:w-full">
            <div className="flex items-center justify-between p-2 ">
              <p className="py-2 px-4 w-[62px] font-bold text-lg">No.</p>
              <p className="w-[170px] p-2 font-bold">Question</p>
              <p className="w-[150px] p-2 font-bold">Correct</p>
              <p className="w-[400px] p-2 font-bold">Incorrect Options</p>
              <p className="w-[150px] p-2 font-bold">Others</p>
              <p className="w-[100px] p-2 font-bold">Actions</p>
            </div>
            <PaginatedContributor editQuizdata={editQuizdata} deleteHandler={deleteHandler } paginatedQuiz={filteredQuiz}/> 
           
   
          </div>
        ) : (
          <div className="absolute top-[55%] left-[50%] -translate-y-[50%] -translate-x-[50%]">
            <p className="text-4xl text-center font-bold p-8 text-gray-100 ">
              No Quiz Available
            </p>
          </div>
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
