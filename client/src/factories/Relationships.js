export default {
  async getList() {
    const response = await ourloveFetch(`/api/v1.0/relationships/get_relationships`)
    return response.json()
  },

  async get(path) {
    const response = await ourloveFetch(`/api/v1.0/relationships/get/${path}`)
    return response.json()
  },

  async getAdminUsers(path) {
    const response = await ourloveFetch(`/api/v1.0/relationships/get_admin_users/${path}`)
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

  async getReminders(path) {
    const response = await ourloveFetch(`/api/v1.0/relationships/get_reminders/${path}`)
    return response.json()
  },

  async changePagePath(currentPath, newPath) {
    const response = await ourloveFetch(`/api/v1.0/relationships/change_page_url/${currentPath}/${newPath}`)
    return response.json()
  },

  async checkForOpenPage(name1, name2) {
    const response = await ourloveFetch(`/api/v1.0/relationships/check_for_page/${name1}/${name2}`)
    return response.text()
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

  async updatePicture(pictureId, object) {
    await ourloveFetch(`/api/v1.0/relationships/update_picture`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: pictureId, object: object})
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
  },

  async createOrUpdateReminder(reminder, path) {
    const response = await ourloveFetch(`/api/v1.0/relationships/update_reminder/${path}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({reminder: reminder})
    })
    return response.json()
  },

  async deleteReminder(reminderId) {
    await ourloveFetch(`/api/v1.0/relationships/delete_reminder/${reminderId}`, {method: 'DELETE'})
  }
}
