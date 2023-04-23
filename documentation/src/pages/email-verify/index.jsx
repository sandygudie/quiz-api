import React, { useEffect, useState } from 'react'
import './style.scss'
import { useParams, useNavigate } from 'react-router-dom'
import { verifyEmail } from '../../utilis/api/auth'
import { GiCheckMark } from 'react-icons/gi'
import Link from '@docusaurus/Link'
import { useHistory } from '@docusaurus/router'

export default function EmailVerify() {
  const [isValidUrl, setValidUrl] = useState('')
  const [error, setError] = useState('')
  const params = useParams()
  const history = useHistory()

  useEffect(() => {
    emailVerifyHandler()
  }, [])

  const emailVerifyHandler = async () => {
    try {
      await verifyEmail(params.access_token)
      setValidUrl(true)
    } catch (error) {
      setValidUrl(false)
      setError(error.message)
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
          <h1 className="verifyEmail__content__header">Email Verification Successful!</h1>
          <button onClick={() => history.push('/login')} className="verifyEmail__content__btn">
            Login
          </button>
        </div>
      ) : (
        <div>
          <h1 className="verifyEmail__invalid"> {error}</h1>
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
