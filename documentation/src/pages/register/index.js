import React, { useState } from 'react'
import Layout from '@theme/Layout'
import '../login/style.scss'
import useFetch from '../../hooks/useFetch'
import { MdOutlineVisibilityOff, MdOutlineVisibility } from 'react-icons/md'
import { FcGoogle } from 'react-icons/fc'
import Spinner from '../../components/Spinner'
import signUp from '../../utilis/api/index'

export default function register() {
  const [isSendVerifyLink, setVerifyLink] = useState(false)
  const [email, setEmail] = useState('')
  const [toggleVisibility, setToggleVisibility] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const registerHandler = async (event) => {

    event.preventDefault()
  
      try {
        const formData = {
         username: event.target.username.value,
          email: event.target.email.value,
          password: event.target.password.value,
        }
        setLoading(true)
        const response = await register(formData)
        if (response.success) {
          setVerifyLink(true)
          setEmail(event.target.email.value)
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
    <Layout title={'signup'} description="Register">
      {/* {isSendVerifyLink ? (
        <VerificationLink emailLink={email} />
      ) : loading ? (
        <Spinner width="100px" height="100px" color="#009985" />
      ) : ( */}
      <section className="login-signup">
        {/* <div className="login-signup__languageToggle">
          {' '}
          <LanguageToggle />
        </div> */}

        <h1 className="login-signup__heading">Sign Up to MOOCs</h1>
        <div className="login-signup__google">
          <button className="login-signup__google__login-btn">
            Sign in with Google <FcGoogle />
          </button>
        </div>
        <div className="login-signup__hr-line">
          {' '}
          <hr />
          <h2 className="login-signup__hr-line__or">OR</h2>
          <hr />
        </div>

        <form className="login-signup__form" onSubmit={registerHandler} method="POST">
          <div className="login-signup__form-namefield">
            <div className="field">
              <label className="sr-only" htmlFor="firstname">
                Firstname
              </label>
              <input
                type="text"
                placeholder={`First Name`}
                name="firstname"
                id="firstname"
                required
              />
            </div>
            <div className="field">
              <label className="sr-only" htmlFor="lastname">
                Lastname
              </label>
              <input type="text" placeholder={`Last Name`} name="lastname" required id="lastname" />
            </div>
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
          <div className="field">
            <label className="sr-only" htmlFor="confirmpassword">
              Confirm password
            </label>
            <input
              type={toggleVisibility ? 'text' : 'password'}
              placeholder={'Confirm Password'}
              minLength={8}
              className={`${checkpassword && 'password-check'}`}
              required
              name="confirmpassword"
              id="confirmpassword"
            />
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
            <a href="/login" className="login-signup__bottom-content__link">
              &nbsp; Login
            </a>
          </div>
        </div>
      </section>
      {/* )} */}
    </Layout>
  )
}
