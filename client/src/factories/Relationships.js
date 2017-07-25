export default {
  async get(path) {
    const response = await fetch(`/api/v1.0/relationships/get/${path}`)
    return response.json()
  },

  async create(path, info) {
    const response = await fetch(`/api/v1.0/relationships/create/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({relationship: info})
    })
    return response.json()
  }
}
