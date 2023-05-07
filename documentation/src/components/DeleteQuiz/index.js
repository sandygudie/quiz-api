import React from 'react'
import { deleteQuiz } from '../../utilis/api/contributor'
import { ToastContainer, toast } from 'react-toastify'

export default function index({ editData, handleModalChange, getData }) {
  const deleteQuizHandler = async () => {
    const response = await deleteQuiz(editData)
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
    }
    handleModalChange('')
  }
  return (
    <div className='p-8'>
      <h1 className="text-2xl text-center font-bold mb-4"> Delete Quiz</h1>
      <p className="text-center text-lg">
        Are you sure you want to delete quiz?
      </p>
      <div className="text-center flex items-center justify-around mt-8">
        <button
          className="p-3 px-6 w-40 text-white hover:bg-primary/70 hover:text-secondary px-4 rounded-md bg-primary font-bold"
          type="button"
          onClick={() => deleteQuizHandler(editData)}
        >
          {' '}
          Continue
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
