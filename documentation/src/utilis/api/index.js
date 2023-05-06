import axios from 'axios'
import { TOKEN_KEY } from '../constants'
import { ToastContainer, toast } from 'react-toastify'
import { Redirect } from '@docusaurus/router'

let token
if (typeof window !== 'undefined') {
  token = localStorage.getItem(TOKEN_KEY)
}
const baseURL = 'https://quizbase.onrender.com/api/v1'

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
    console.log(error)
    if (error.response) {
      
      if (error.response.status === 403 || error.response.status === 401) {
        localStorage.removeItem(TOKEN_KEY)
        return <Redirect to="/login" />
      }
    }

    throw new Error(error.response?.data?.message || error.message)
  }
}

export default makeApiCall
