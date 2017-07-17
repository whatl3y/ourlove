export { Relationships as default }

const Relationships = {
  async get(path) {
    const response = await fetch(`/api/v1.0/relationships/get/${path}`)
    return response.json()
  }
}
