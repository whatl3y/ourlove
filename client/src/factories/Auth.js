export default {
  async isLoggedIn() {
    const response = await ourloveFetch(`/api/v1.0/auth/logged_in`)
    return response.json()
  },

  async isRelationshipAdmin(relationshipPath) {
    const response = await ourloveFetch(`/api/v1.0/auth/relationship_admin/${relationshipPath}`)
    return response.json()
  },

  async getIntegrations() {
    const response = await ourloveFetch(`/api/v1.0/auth/integrations`)
    return response.json()
  },

  async setReturnTo(path) {
    await ourloveFetch(`/api/v1.0/auth/set_return_to/${path}`)
  }
}
