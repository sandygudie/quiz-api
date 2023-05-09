import makeApiCall from '.'

export async function getAllContributorQuizs() {
  const response = await makeApiCall(`/quiz/contributors`, 'get')
  return response
}

export async function verifyContributorQuiz(id) {
  const response = await makeApiCall(`/contributor/${id}`, 'post')
  return response
}

export async function getAllQuizs() {
  const response = await makeApiCall(`/quiz`, 'get')
  return response
  
}


