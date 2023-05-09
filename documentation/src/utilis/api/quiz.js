import makeApiCall from '.'
export async function createQuiz(payload) {
    const response = await makeApiCall(`/quiz`, 'post', payload)
    return response
  }
  
  export async function deleteQuiz(id) {
    const response = await makeApiCall(`/quiz/${id}`, 'delete')
    return response
  }
  
  export async function editQuiz(payload, id) {
    const response = await makeApiCall(`/quiz/${id}`, 'patch', payload)
    return response
  }