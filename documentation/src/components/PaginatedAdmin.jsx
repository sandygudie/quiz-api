import React, { useState } from 'react'
import ReactPaginate from 'react-paginate'

export default function PaginatedAdmin({ paginatedQuiz, admin, editHandler }) {
  const itemsPerPage = 4
  const [itemOffset, setItemOffset] = useState(0)
  const endOffset = itemOffset + itemsPerPage

  const currentItems = paginatedQuiz.slice(itemOffset, endOffset)
  const pageCount = Math.ceil(paginatedQuiz.length / itemsPerPage)

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % paginatedQuiz.length
    setItemOffset(newOffset)
  }

  const AdminQuiz = () =>
    currentItems.map((content, index) => {
      return (
        <div
          key={content._id}
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
              onClick={() => editHandler(content._id)}
              className="p-2 cursor-pointer w-[70px] font-bold block"
            >
              {' '}
              Edit
            </button>
            <button
              onClick={() => {
                deleteHandler(content._id)
              }}
              className="p-2 cursor-pointer w-[70px] font-bold block"
            >
              Delete
            </button>
          </div>
        </div>
      )
    })

  const AllContributor = () =>
    currentItems.map((content, index) => {
      return (
        <div
          key={content._id}
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
                  onClick={() => verifyHandler(content._id)}
                  className={`text-error w-[70px] font-semibold w-15 p-2`}
                >
                  {content.status}
                </button>
              ) : (
                <p className="text-success font-semibold">{content.status}</p>
              )}
            </div>
          </div>

          {/* <div className="w-[100px] p-2 flex flex-col gap-3">
            {' '}
            <button
              onClick={() => editHandler(content._id)}
              className="p-2 w-[70px] cursor-pointer font-bold block"
            >
              {' '}
              Edit
            </button>
            <button
              onClick={() => {
                deleteHandler(content._id)
              }}
              className="p-2 w-[70px] cursor-pointer font-bold block"
            >
              Delete
            </button>
          </div> */}
        </div>
      )
    })

  return (
    <>
      {admin ? (
        <AdminQuiz currentItems={currentItems} />
      ) : (
        <AllContributor currentItems={currentItems} />
      )}
      <ReactPaginate
        breakLabel="..."
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        activeLinkClassName="bg-primary cursor-pointer px-3 py-2"
        pageLinkClassName="bg-gray-100 font-semibold hover:bg-primary cursor-pointer px-3 py-2"
        renderOnZeroPageCount={null}
        nextLinkClassName="bg-gray-100 cursor-pointer px-3 py-2"
        previousLinkClassName="bg-gray-100 cursor-pointer px-3 py-2"
        className="mt-12 bg-gray-200/10 gap-6 p-6 list-none justify-center flex items-center"
      />
    </>
  )
}
