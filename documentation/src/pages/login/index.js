import React, {useState} from 'react'
import Layout from '@theme/Layout'
import "./style.scss";
import useFetch from "../../hooks/useFetch";
import { MdOutlineVisibilityOff, MdOutlineVisibility } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import Spinner from "../../components/Spinner";

export default function login() {
  const [toggleVisibility, setToggleVisibility] = useState(false)
  const [isError, setError] = useState(false)
  const [isLoading, setLoading] = useState(false)

  // const { handleGoogle, loading } = useFetch();

  // const googlelogin = useGoogleLogin({
  //   onSuccess: (codeResponse) => handleGoogle(codeResponse.code),
  //   flow: "auth-code",
  // });

  const loginHandler = async (event) => {
    setError(false);
    event.preventDefault();
    try {
      const formData= {
        email: event.target.email.value,
        password: event.target.password.value,
      };
      setLoading(true);
      let response = await signIn(formData);

      if (response.success) {
        setToken(response.data.access_token);
        navigate("/dashboard");
      }
    } catch (error) {
      setError(true);
      toast.error(error.message, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Layout title={'login'} description="login">
        <section className="login-signup">
          <h1 className="login-signup__heading">QuizBase</h1>
          <div className="login-signup__google">
            <button className="login-signup__google__login-btn" >
              Sign in with Google <FcGoogle />
            </button>
          </div>
          <div className="login-signup__hr-line">
            {' '}
            <hr />
            <h2 className="login-signup__hr-line__or"> OR</h2>
            <hr />
          </div>

          <form className="login-signup__form" onSubmit={loginHandler} method="POST">
            <div className="field">
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder='Email'
                required
                className={`${isError && 'error-input'}`}
              />
            </div>

            <div className="field">
              <label className="sr-only" htmlFor="password">
                Password
              </label>
              <input
                type={toggleVisibility ? 'text' : 'password'}
                placeholder='Password'
                required
                name="password"
                className={`${isError && 'error-input'}`}
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
                {isLoading ? <Spinner width="30px" height="30px" color="#fff" /> : 'Login'}
              </button>
            </div>
          </form>
          <div className="login-signup__bottom">
            <a href="/forgotpassword" className="login-signup__bottom-forgotpassword-link ">
              {' '}
              forgot password?
            </a>
            <div className="login-signup__bottom-content">
              Don't have an account?{' '}
              <a href="/signup" className="login-signup__bottom-content__link">
                Sign Up
              </a>
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}

// The login flow
// page to login with google and normal login
// verify account
// reset and forgot password
// have user dashboard to see your details and data added(per date)(data have status:verified and unverified)
// have the form to add quiz data,
// see added data to delete, edit
