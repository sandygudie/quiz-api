import makeApiCall from '.'

export async function getCourses() {
  const response = await makeApiCall('/course')
  return response
}

export async function getCourse(id) {
  const response = await makeApiCall(`/course/${id}`)
  return response
}

export async function enrollUser(id) {
  const response = await makeApiCall(`course/enroll/${id}`, 'post')
  return response
}

export async function updateExercise(id, payload) {
  const response = await makeApiCall(`/exercise/update/${id}`, 'patch', payload)
  return response
}

export async function exerciseScore(id, payload) {
  const response = await makeApiCall(`exercise/score/${id}`, 'post', payload)
  return response
}

export async function getCertificate(id) {
  const response = await makeApiCall(`certificate/course/${id}`)
  return response
}
