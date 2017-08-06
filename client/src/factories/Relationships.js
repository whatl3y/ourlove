export default {
  async get(path) {
    const response = await ourloveFetch(`/api/v1.0/relationships/get/${path}`)
    return response.json()
  },

  async getImages(path) {
    const response = await ourloveFetch(`/api/v1.0/relationships/get_images/${path}`)
    return response.json()
  },

  async getMilestones(path) {
    const response = await ourloveFetch(`/api/v1.0/relationships/get_milestones/${path}`)
    return response.json()
  },

  async create(path, info) {
    const response = await ourloveFetch(`/api/v1.0/relationships/create/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({relationship: info})
    })
    return response.json()
  },

  async update(path, info) {
    const response = await ourloveFetch(`/api/v1.0/relationships/update/${path}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({relationship: info})
    })
    return response.json()
  },

  async updatePictureTakenDate(pictureId, takenDate) {
    await ourloveFetch(`/api/v1.0/relationships/update_picture`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: pictureId, image_taken: takenDate})
    })
  },

  async deletePicture(pictureId) {
    await ourloveFetch(`/api/v1.0/relationships/delete_picture/${pictureId}`, {method: 'DELETE'})
  },

  async createOrUpdateMilestone(milestone, path) {
    const response = await ourloveFetch(`/api/v1.0/relationships/update_milestone/${path}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({milestone: milestone})
    })
    return response.json()
  },

  async deleteMilestone(milestoneId) {
    await ourloveFetch(`/api/v1.0/relationships/delete_milestone/${milestoneId}`, {method: 'DELETE'})
  }
}
