import axios from 'axios'
import { TOKEN_KEY } from '../constants'
import { ToastContainer, toast } from 'react-toastify'

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
    if (error.response) {
      if (error.response.status === 403) {
        toast.error(error.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 5000,
          theme: 'colored'
        })
        localStorage.removeItem(TOKEN_KEY)
        window.location.assign('/login')
      }
    }

    throw new Error(error.response?.data?.message || error.message)
  }
}

export default makeApiCall
