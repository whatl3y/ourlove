export default {
  async getImages(type, pageToken=null) {
    const response = await ourloveFetch(`/api/v1.0/integrations/get_images/${type}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({pageInfo: pageToken})
    })
    return response.json()
  }
}
