import React, { useEffect, useState } from 'react'
import './style.scss'
// import { useParams} from 'react-router-dom'
import { verifyEmail } from '../../utilis/api/auth'
import { GiCheckMark } from 'react-icons/gi'
import Link from '@docusaurus/Link'
import { useHistory, useLocation } from '@docusaurus/router'

export default function EmailVerify() {
  const [isValidUrl, setValidUrl] = useState('')
  const [message, setMessage] = useState('')
  const history = useHistory()
  const location = useLocation()

  console.log(location.search.slice(1))
  useEffect(() => {
    emailVerifyHandler()
  }, [])
  const queryUrl = location.search.slice(1)
  const emailVerifyHandler = async () => {
    try {
      await verifyEmail(queryUrl)
      setValidUrl(true)
    } catch (error) {
      setValidUrl(false)
      setMessage(error.message)
    }
  }

  return (
    <div className="verifyEmail">
      {isValidUrl ? (
        <div className="verifyEmail__content">
          <div className="verifyEmail__content__icon">
            {' '}
            <GiCheckMark />
          </div>
          <h1 className="verifyEmail__content__header">{message}!</h1>
          <button onClick={() => history.push('/login')} className="verifyEmail__content__btn">
            Login
          </button>
        </div>
      ) : (
        <div>
          <h1 className="verifyEmail__invalid"> {message}</h1>
          <p className="verifyEmail__subtitle">
            {' '}
            The verification link is expired or invalid ,go back to{' '}
            <Link to="/register">sign up</Link> page
          </p>
        </div>
      )}
    </div>
  )
}
