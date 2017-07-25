export default {
  async getIntegrations() {
    const response = await fetch(`/api/v1.0/auth/integrations`)
    return response.json()
  }
}
