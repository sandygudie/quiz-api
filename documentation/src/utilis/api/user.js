import makeApiCall from '.'

export async function getContributor(id) {
  const response = await makeApiCall(`/contributor/${id}`, 'get')
  return response
}

export async function createQuiz(payload) {
  const response = await makeApiCall(`/quiz`, 'post', payload)
  return response
}


// export async function getContributorQuiz(id) {
//   const response = await makeApiCall(`/${id}`, 'get')
//   return response
// }

// i am trying to get all the quiz by a particular user(contributor)