import axios from 'axios'
import { PROFILE_KEY, TOKEN_KEY } from '../constants'


let token
if (typeof window !== 'undefined') {
  token = localStorage.getItem(TOKEN_KEY)
}
const baseURL = 'http://localhost:8080/api/v1'

if (token) {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`
}

async function makeApiCall(url, method, payload, axiosRequestConfig) {
  try {
    if (!baseURL || typeof baseURL !== 'string') {
      throw new Error('BASEURL is not defined')
    }
    const { data } = await axios({
      url,
      method,
      data: payload,
      baseURL,
      ...axiosRequestConfig
    })

    return data
  } catch (error) {
    if (error.response) {
      if (error.response.status === 403 || error.response.status === 401) {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(PROFILE_KEY)
        return window.location.assign('/login')
        //  <Redirect to="/login" />
      }
    }
    throw new Error(error.response?.data?.message || error.message)
  }
}

export default makeApiCall

// learn the contextmethod
// Clear cokkies when user logout
