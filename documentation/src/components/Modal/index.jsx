import React, { useRef, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { createQuiz } from '../../utilis/api/user'

export default function Modal({ handleModalChange }) {
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [isLoading, setLoading] = useState(false)

  const [isError, setError] = useState(false)

  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        handleModalChange()
      }
    }
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  })

  const handleChangeDifficulty = (event) => {
    setDifficulty(event.target.value)
  }
  const handleChangeCategory = (event) => {
    setCategory(event.target.value)
  }
  const handleSubmit = async (event) => {
    setError(false)
    setLoading(true)
    event.preventDefault()
    try {
      const formData = {
        category: category,
        difficulty: difficulty,
        question: event.target.question.value,
        correct_answer: event.target.correct_answer.value,
        incorrect_answers: [
          event.target.option1.value,
          event.target.option2.value,
          event.target.option3.value
        ]
      }
      const response = await createQuiz(formData)
      console.log(response)
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
        handleModalChange(false)
        // get new data
      }
    } catch (error) {
      setError(true)
      toast.error(error.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
        theme: 'colored'
      })
      setLoading(false)
    }
  }
  return (
    <div className="z-30 bg-black/70 fixed -translate-y-[50%] -translate-x-[50%] top-[50%] left-[50%] w-screen h-screen">
      <div
        ref={ref}
        className={`z-40 rounded-lg  w-11/12 lg:w-6/12 fixed bg-white dark:bg-secondary 
            -translate-y-[50%] -translate-x-[50%] left-[50%] top-[50%] rounded-lg`}
      >
        <div className="relative overflow-auto">
          <>
            <div className="p-6 lg:p-10 bg-white text-gray rounded-xl">
              <h2>Add New Question</h2>
              <form className="mt-4 flex flex-col" onSubmit={handleSubmit}>
                <div className="my-3">
                  <label className="pb-1 block text-base font-semibold">Question</label>
                  <input
                    className="placeholder:text-gray-100 placeholder:text-sm"
                    type="text"
                    name="question"
                    placeholder="Example: What is HTML"
                    required
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
                    />
                  </div>
                </div>

                <div className="my-3 flex justify-between items-center gap-4">
                  <div className="w-full">
                    <label className="pb-1 block text-base font-semibold">Language Category</label>
                    <select
                      className="select-wrapper text-sm text-gray-100 focus-visible:outline-none"
                      // name="Service"
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
                      className="select-wrapper text-sm text-gray-100 focus-visible:outline-none"
                      // name="Service"
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

                <input
                  className="mt-6 text-center text-white rounded-full m-auto w-[200px] py-3 bg-primary font-semibold text-base hover:bg-primary/80"
                  type="submit"
                  value={'Submit Question'}
                />
              </form>
            </div>
            <ToastContainer />
          </>
        </div>
      </div>
    </div>
  )
}

// {
//   "category": "HTML",
//   "difficulty":"easy",
//   "question":"What is HTML",
//   "incorrect_answers":["Hypertext", "HyperText Markbook", "Function"],
//   "correct_answer":"HyperText Markup language"
//   }
