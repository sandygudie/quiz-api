import makeApiCall from '.'

export async function getContributor(id) {
  const response = await makeApiCall(`/contributor/${id}`, 'get')
  return response
}


