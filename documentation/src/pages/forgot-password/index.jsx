import React, { useState } from 'react'
import '../login/style.css'
import { ToastContainer, toast } from 'react-toastify'
import Spinner from '../../components/Spinner'
import Link from '@docusaurus/Link'
import { forgotpassword } from '../../utilis/api/auth'
import Layout from '@theme/Layout'

export default function ForgotPassword() {
  const [isLoading, setLoading] = useState(false)

  const forgotPasswordHandler = async (event) => {
    event.preventDefault()
    try {
      const formData = {
        email: event.target.email.value
      }
      setLoading(true)
      const response = await forgotpassword(formData)
      if (response.success) {
        toast.success(<p> {response.success}!</p>, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          theme: 'colored'
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
    <>
      <Layout title={'forgot password'} description="Forgot Password">
        <section className="login-signup">

          <h1 className="login-signup__heading">
         Forgot Password
          </h1>
          <p className="login-signup__text">
        Enter the email associated with your account. </p>
          <form className="login-signup__form" onSubmit={forgotPasswordHandler}>
            <div className="field">
              <label className="sr-only" htmlFor="email">
               Email
              </label>
              <input type="email" name="email" id="email" placeholder={`Email`} required />
            </div>
            <div className="field button-field">
              <button>
                {isLoading ? <Spinner width="30px" height="30px" color="#fff" /> : `Submit`}
              </button>
            </div>
          </form>
          <div className="login-signup__bottom">
            <div className="login-signup__bottom-content">
              Don't have an account?{' '}
              <Link to="/register" className="login-signup__bottom-content__link">
               Sign Up
              </Link>
            </div>
          </div>
        </section>
        <ToastContainer />
      </Layout>
    </>
  )
}
