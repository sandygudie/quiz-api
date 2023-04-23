import makeApiCall from '.'

export async function signUp(payload) {
  return await makeApiCall('/auth/register', 'post', payload)
}

export async function login(payload) {
  const response = await makeApiCall('/auth/login', 'post', payload)
  return response
}

export async function forgotpassword(payload) {
  const response = await makeApiCall('/auth/forgotpassword', 'post', payload)
  return response
}

export async function resetpassword(payload) {
  const response = await makeApiCall(`/auth/resetpassword`, 'patch', payload)
  return response
}

export async function verifyEmail(payload) {
  const response = await makeApiCall(`/auth/verifyemail/${payload}`, 'get')
  return response
}
