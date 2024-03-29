import makeApiCall from '.'
import { TOKEN_KEY, LOGOUT_KEY, PROFILE_KEY } from '../constants'
import axios from 'axios'

export async function signUp(payload) {
  return await makeApiCall('/auth/register', 'post', payload)
}

export async function login(payload) {
  const response = await makeApiCall('/auth/login', 'post', payload)
  return response
}

export async function forgotpassword(payload) {
  const response = await makeApiCall('/auth/forgot-password', 'post', payload)
  return response
}
export async function verifyResetLink(resetCode) {
  const response = await makeApiCall(`/auth/verify-reset-link/${resetCode}`, 'get')
  return response
}
export async function resetpassword(resetCode, payload) {
  const response = await makeApiCall(`/auth/reset-password/${resetCode}`, 'patch', payload)
  return response
}

export async function verifyEmail(payload) {
  const response = await makeApiCall(`/auth/verifyemail/${payload}`, 'get')
  return response
}

export async function logout() {
  axios.defaults.headers.common.Authorization = ''
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(TOKEN_KEY)
    window.localStorage.removeItem(PROFILE_KEY)

    // to support logging out from all windows
    window.localStorage.setItem(LOGOUT_KEY, Date.now().toString())
    window.location.assign('/login')
    return
  }
}
