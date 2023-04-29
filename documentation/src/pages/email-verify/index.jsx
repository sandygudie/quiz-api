import React, { useEffect, useState } from 'react'
import './style.css'
// import { useParams} from 'react-router-dom'
import { verifyEmail } from '../../utilis/api/auth'
import { GiCheckMark } from 'react-icons/gi'
import Link from '@docusaurus/Link'
import { useHistory, useLocation } from '@docusaurus/router'
import Spinner from '../../components/Spinner'

export default function EmailVerify() {
  const [isValidUrl, setValidUrl] = useState('')
  const [message, setMessage] = useState('')
  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    emailVerifyHandler()
  }, [])
  const queryUrl = location.search.slice(1)
  const emailVerifyHandler = async () => {
    try {
      let response = await verifyEmail(queryUrl)
      setValidUrl(true)
      setMessage(response.success)
    } catch (error) {
      setValidUrl(false)
      setMessage(error.message)
    }
  }

  return (
    <div className="verifyEmail">
      {isValidUrl === false ? (
        <div>
          <h1 className="verifyEmail__invalid"> {message}</h1>
          <p className="verifyEmail__subtitle">
            {' '}
            The verification link is expired or invalid ,go back to{' '}
            <Link to="/register">sign up</Link> page
          </p>
        </div>
      ) : isValidUrl === true ? (
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
        <Spinner width="40px" height="40px" color="#009985" />
      )}
    </div>
  )
}
