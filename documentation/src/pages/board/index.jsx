import React, { useState, useEffect } from 'react'
import { TOKEN_KEY, PROFILE_KEY } from '../../utilis/constants'
import { Redirect } from '@docusaurus/router'
import QuizbaseImage from '@site/static/img/logo.svg'
import { getContributor } from '../../utilis/api/user'

export default function Board() {
  const [quiz, setquiz] = useState([])
  let token
  if (typeof window !== 'undefined') {
    token = localStorage.getItem(TOKEN_KEY)
  }
  // what if token is expired or invalid or fake
  // remove token and profile is anything goes wrong
  // if (!token) {
  //   return <Redirect to="/login" />
  // }
  let profileID
  if (typeof window !== 'undefined') {
    const profile = localStorage.getItem(PROFILE_KEY)
     profileID = JSON.parse(profile)
  }
  useEffect(() => {
    contributorData()
  }, [])

  const contributorData = async () => {
    let response = await getContributor(profileID.id)
    console.log(response)
  }
  return (
    <div className="h-screen bg-secondary">
      <header className="bg-white h-25 pr-32 pl-0  py-4">
        <div className="flex items-center justify-between ">
          {' '}
          <QuizbaseImage className="w-30 h-10" />
          <div>
            <button className="bg-primary font-bold text-white text-base px-4 py-2">
              Create Quiz
            </button>
          </div>
        </div>
      </header>
      <section>{}</section>
    </div>
  )
}
