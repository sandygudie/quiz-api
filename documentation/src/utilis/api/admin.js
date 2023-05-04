import makeApiCall from '.'

export async function getAllContributorQuizs() {
  const response = await makeApiCall(`/quiz/contributors`, 'get')
  console.log(response)
  return response
}

export async function verifyContributorQuiz(id) {
  const response = await makeApiCall(`/contributor/${id}`, 'post')
  return response
}

export async function createQuiz(payload) {
  const response = await makeApiCall(`/quiz`, 'post', payload)
  return response
}
export async function getAllQuizs() {
  const response = await makeApiCall(`/quiz`, 'get')
  return response
}
export async function deleteQuiz(id) {
  const response = await makeApiCall(`/quiz/${id}`, 'delete')
  return response
}
export async function updateQuiz(payload, id) {
  const response = await makeApiCall(`/quiz/${id}`, 'patch', payload)
  return response
}
