import React, { useState, useEffect } from 'react'
import '../login/style.css'
import Layout from '@theme/Layout'
import { ToastContainer, toast } from 'react-toastify'
import { MdOutlineVisibilityOff, MdOutlineVisibility } from 'react-icons/md'
import Spinner from '../../components/Spinner'
import { resetpassword, verifyResetLink } from '../../utilis/api/auth'
import { useHistory, useLocation } from '@docusaurus/router'
import Link from '@docusaurus/Link'

const ResetPassword = () => {
  const [isLoading, setLoading] = useState(false)
  const [toggleVisibility, setToggleVisibility] = useState(false)
  const [isValidLink, setValidLink] = useState('')
  const [message, setMessage] = useState('')
  const location = useLocation()
  const history = useHistory()
  useEffect(() => {
    verifyLinkHandler()
  }, [])

  const resetCode = location.search.slice(1)

  const verifyLinkHandler = async () => {
    try {
      let response = await verifyResetLink(resetCode)
      if (response.success) {
        setValidLink('true')
      }
    } catch (error) {
      setValidLink('false')
      setMessage(error.message)
    }
  }
  const resetPasswordHandler = async (event) => {
    event.preventDefault()
    try {
      const formData = {
        password: event.target.password.value,
        passwordConfirmation: event.target.confirmpassword.value
      }
      setLoading(true)
      const response = await resetpassword(resetCode, formData)
      if (response.success) {
        toast.success(<p> {response.success}!</p>, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          theme: 'colored',
          onClose: () => history.push('/login')
        })
      }
    } catch (error) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
        theme: 'colored'
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <Layout title={'Reset password'} description="Reset password">
      <section className="login-signup">
        {isValidLink === 'true' ? (
          <div>
            <h1 className="login-signup__heading">Reset Password</h1>

            <form className="login-signup__form" onSubmit={resetPasswordHandler}>
              <div className="field">
                <label className="sr-only" htmlFor="password">
                  New Password
                </label>
                <input
                  type={toggleVisibility ? 'text' : 'password'}
                  placeholder={`New Password`}
                  minLength={8}
                  name="password"
                  id="password"
                  required
                />

                <button
                  aria-label="toggle password"
                  className="icon-button eye-icon"
                  onClick={() => setToggleVisibility(!toggleVisibility)}
                >
                  {toggleVisibility ? <MdOutlineVisibility /> : <MdOutlineVisibilityOff />}
                </button>
              </div>

              <div className="field">
                <label className="sr-only" htmlFor="confirm password">
                  Confirm Password
                </label>
                <input
                  type={toggleVisibility ? 'text' : 'password'}
                  placeholder={`Confirm Password`}
                  minLength={8}
                  name="confirmpassword"
                  id="confirmpassword"
                  required
                />
              </div>

              <div className="field button-field">
                <button>
                  {isLoading ? <Spinner width="30px" height="30px" color="#fff" /> : `Submit`}
                </button>
              </div>
            </form>
            <div className="login-signup__bottom">
              <div className="login-signup__bottom-content">
                Don't have an account?
                <Link to="/register" className="login-signup__bottom-content__link">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        ) : isValidLink === 'false' ? (
          <p className="font-bold text-error text-lg"> {message}</p>
        ) : (
          <Spinner width="40px" height="40px" color="#009985" />
        )}
      </section>
      <ToastContainer />
    </Layout>
  )
}
export default ResetPassword
