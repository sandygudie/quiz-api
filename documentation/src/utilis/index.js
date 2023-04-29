import axios from 'axios'
import { TOKEN_KEY, PROFILE_KEY } from './constants'

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
export function getProfile() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(PROFILE_KEY)
  }
}

export function setProfile(profile) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  }
}
