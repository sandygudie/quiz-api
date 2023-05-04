import React, { useState } from 'react'
import {  toast } from 'react-toastify'
import { createQuiz, editQuiz } from '../../utilis/api/contributor'
import Spinner from '../Spinner'

export default function index({ handleModalChange, editData, getData }) {
  const [category, setCategory] = useState(editData ? editData.category : '')
  const [difficulty, setDifficulty] = useState(editData ? editData.difficulty : '')
  const [question, setQuestion] = useState(editData ? editData.question : '')
  const [correctAnswer, setCorrectAnswer] = useState(editData ? editData.correct_answer : '')
  const [option0, setOption0] = useState(editData ? editData.incorrect_answers[0] : '')
  const [option1, setOption1] = useState(editData ? editData.incorrect_answers[1] : '')
  const [option2, setOption2] = useState(editData ? editData.incorrect_answers[2] : '')
  const [isLoading, setLoading] = useState(false)

  const handleChangeDifficulty = (event) => {
    setDifficulty(event.target.value)
  }
  const handleChangeCategory = (event) => {
    setCategory(event.target.value)
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const formData = {
        category: category,
        difficulty: difficulty,
        question: question,
        correct_answer: correctAnswer,
        incorrect_answers: [option0, option1, option2]
      }
      console.log(formData)
      let response
      if (editData) {
        response = await editQuiz(formData, editData.id)
      } else {
        response = await createQuiz(formData)
      }
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
        getData()
        handleModalChange('close')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
        theme: 'colored'
      })
      setLoading(false)
    }
  }
  return (
    <>
      <div className="p-6 lg:p-10 bg-white text-gray rounded-xl">
        <h2>{editData ? 'Edit Question' : 'Add New Question'}</h2>
        <form className="mt-4 flex flex-col" onSubmit={handleSubmit}>
          <div className="my-3">
            <label className="pb-1 block text-base font-semibold">Question</label>
            <input
              className="placeholder:text-gray-100 placeholder:text-sm"
              type="text"
              name="question"
              placeholder="Example: What is HTML"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <div className="my-3">
            <label className="pb-1 block text-base font-semibold">Correct Answer</label>
            <input
              className="placeholder:text-gray-100 placeholder:text-sm"
              type="text"
              name="correct_answer"
              placeholder="Example: Hypertext Markup language"
              required
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
            />
          </div>
          <div className=" my-3">
            <div className="flex items-center justify-between gap-3 ">
              {' '}
              <label className="text-base font-semibold">Option1</label>
              <input
                className="placeholder:text-gray-100 placeholder:text-sm"
                type="text"
                name="option1"
                placeholder="Example: Hyper Language"
                required
                value={option0}
                onChange={(e) => setOption0(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between gap-3 my-6">
              {' '}
              <label className="text-base font-semibold">Option2</label>{' '}
              <input
                className="placeholder:text-gray-100 placeholder:text-sm"
                type="text"
                name="option2"
                placeholder="Example: Hyper Text Language"
                required
                value={option1}
                onChange={(e) => setOption1(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between gap-3 ">
              {' '}
              <label className="text-base font-semibold">Option3</label>{' '}
              <input
                className="placeholder:text-gray-100 placeholder:text-sm"
                type="text"
                name="option3"
                placeholder="Example: Does not Exist"
                required
                value={option2}
                onChange={(e) => setOption2(e.target.value)}
              />
            </div>
          </div>

          <div className="my-3 flex justify-between items-center gap-4">
            <div className="w-full">
              <label className="pb-1 block text-base font-semibold">Category</label>
              <select
                className="select-wrapper text-sm  focus-visible:outline-none"
                value={category}
                required
                onChange={handleChangeCategory}
              >
                <option disabled="">Select Category</option>
                <option value={'HTML'}>HTML </option>
                <option value={'CSS'}> CSS</option>
                <option value={'Javascript'}> Javascript </option>
              </select>
            </div>
            <div className="w-full">
              <label className="pb-1 block text-base font-semibold">Difficulty</label>
              <select
                className="select-wrapper text-sm focus-visible:outline-none"
                value={difficulty}
                required
                onChange={handleChangeDifficulty}
              >
                <option disabled="" value="">
                  Select Purpose
                </option>
                <option value={'easy'}> Easy </option>
                <option value={'medium'}> Medium </option>
                <option value={'hard'}> Hard </option>
              </select>
            </div>
          </div>
          <button
            className="mt-6 h-12 text-center text-white rounded-full m-auto w-[200px] py-3 bg-primary font-semibold text-base hover:bg-primary/80"
            type="submit"
          >
            {isLoading ? (
              <Spinner width="30px" height="30px" color="#fff" />
            ) : editData ? (
              'Update question'
            ) : (
              'Submit Question'
            )}
          </button>
        </form>
      </div>
      {/* <ToastContainer /> */}
    </>
  )
}
