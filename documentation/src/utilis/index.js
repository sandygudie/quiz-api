import axios from 'axios'
import { TOKEN_KEY } from './constants'

export function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY)
  }
}

export function setToken(token) {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token)
  }
}
