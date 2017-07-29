export default {
  async isLoggedIn() {
    const response = await ourloveFetch(`/api/v1.0/auth/logged_in`)
    return response.json()
  },

  async getIntegrations() {
    const response = await ourloveFetch(`/api/v1.0/auth/integrations`)
    return response.json()
  }
}
