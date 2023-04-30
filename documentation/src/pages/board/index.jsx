import React, { useState, useEffect } from 'react'
import { TOKEN_KEY, PROFILE_KEY } from '../../utilis/constants'
import { Redirect } from '@docusaurus/router'
import QuizbaseImage from '@site/static/img/logo.svg'
import { getContributor } from '../../utilis/api/user'
import Modal from '../../components/Modal'

export default function Board() {
  const [quiz, setQuiz] = useState([])
  const [profileRole, setProfileRole] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  let token
  if (typeof window !== 'undefined') {
    token = localStorage.getItem(TOKEN_KEY)
  }
  // what if token is expired or invalid or fake
  // remove token and profile is anything goes wrong
  if (!token) {
    return <Redirect to="/login" />
  }
  let profileID

  if (typeof window !== 'undefined') {
    const profile = localStorage.getItem(PROFILE_KEY)
    const profiledata = JSON.parse(profile)
    profileID = profiledata.id
  }
  useEffect(() => {
    contributorData()
  }, [])

  const contributorData = async () => {
    let response = await getContributor(profileID)
    console.log(response)
    setQuiz(response.data.quiz)
    setProfileRole(response.data.role)
  }
  const handleModalChange = () => {
    setIsModalOpen(!isModalOpen)
  }
console.log(quiz)
  return (
    <div className="h-screen bg-secondary">
      <div className="bg-white h-25 pr-32 pl-0  py-4">
        <div className="flex items-center justify-between ">
          {' '}
          <QuizbaseImage className="w-30 h-10" />
          <div className="flex items-center gap-8">
            {' '}
           { profileRole.length ? <p className="font-bold text-lg"><span className='text-base'> Status:</span>{profileRole.toUpperCase()}</p>:"" }
            <button
              onClick={() => setIsModalOpen(true)}
              className="hover:bg-primary/50 bg-primary font-bold text-white text-base px-4 py-2"
            >
              Create Quiz
            </button>
          </div>
        </div>
      </div>
      <section className="">
        {quiz.length ? (
          quiz?.map((item) => {
            return <div key={item.id}> </div>
          })
        ) : (
          <div className="absolute top-[55%] left-[50%] -translate-y-[50%] -translate-x-[50%]">
            <p className="text-4xl font-bold p-8  text-gray-100 bg-secondary/50 ">No Quiz Added</p>
          </div>
        )}
      </section>
      {isModalOpen && <Modal handleModalChange={handleModalChange} />}
    </div>
  )
}

// if there is network issue error handling use react query
