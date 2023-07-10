import makeApiCall from '.'

export async function getContributor(id) {
  const response = await makeApiCall(`/contributor/${id}`, 'get')
  return response
}

export async function getContributorQuiz(id, status, category, difficulty) {
  const response = await makeApiCall(
    `/contributor/${id}/quiz?${status && `status=${status}`}&${
      category && `category=${category}`
    }&${difficulty && `difficulty=${difficulty}`}`,
    'get'
  )
  return response
}
