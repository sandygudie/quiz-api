import React, { useState } from 'react'
import Layout from '@theme/Layout'
import '../login/style.css'
import { MdOutlineVisibilityOff, MdOutlineVisibility } from 'react-icons/md'
import { FcGoogle } from 'react-icons/fc'
import Spinner from '../../components/Spinner'
import { signUp } from '../../utilis/api/auth'
import { ToastContainer, toast } from 'react-toastify'
import Link from '@docusaurus/Link'

export default function Register() {
  const [toggleVisibility, setToggleVisibility] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const registerHandler = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const formData = {
        username: event.target.username.value,
        email: event.target.email.value,
        password: event.target.password.value
      }
      const response = await signUp(formData)
      if (response.success) {
        toast.success('Successfully! Check email for verification link', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: false,
          theme: 'colored'
        })
        setLoading(false)
      }
    } catch (error) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: false,
        theme: 'colored'
      })
      setLoading(false)
    }
  }

  return (
    <Layout title={'signup'} description="Register">
      <section className="login-signup">
        <h1 className="login-signup__heading">Sign Up</h1>
        <form className="login-signup__form" onSubmit={registerHandler} method="POST">
          <div className="field">
            <label className="sr-only" htmlFor="username">
              Firstname
            </label>
            <input type="text" placeholder={`Username`} name="username" id="username" required />
          </div>

          <div className="field">
            <label className="sr-only" htmlFor="email">
              Email
            </label>
            <input type="email" placeholder={`Email`} name="email" id="email" required />
          </div>
          <div className="field">
            <label className="sr-only" htmlFor="password">
              Password
            </label>
            <input
              type={toggleVisibility ? 'text' : 'password'}
              placeholder={`Password`}
              minLength={8}
              name="password"
              id="password"
              required
            />
            <button
              type="button"
              aria-label="toggle password"
              className="icon-button eye-icon"
              onClick={() => setToggleVisibility(!toggleVisibility)}
            >
              {toggleVisibility ? <MdOutlineVisibility /> : <MdOutlineVisibilityOff />}
            </button>
          </div>

          <div className="field button-field">
            <button>
              {isLoading ? <Spinner width="30px" height="30px" color="#fff" /> : 'Sign Up'}
            </button>
          </div>
        </form>
        <div className="login-signup__bottom">
          <div className="login-signup__bottom-content">
            Already have an Account?
            <Link to="/login" className="login-signup__bottom-content__link">
              &nbsp; Login
            </Link>
          </div>
        </div>
      </section>
      <ToastContainer />
    </Layout>
  )
}
