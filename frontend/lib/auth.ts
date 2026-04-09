import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const authAPI = {
  verifyTelegram: async (data: any) => {
    const response = await axios.post(`${API_URL}/auth/telegram`, data, {
      withCredentials: true,
    })
    return response.data
  },

  logout: async () => {
    const response = await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    )
    return response.data
  },

  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      })
      return response.data
    } catch (error) {
      return null
    }
  },
}
