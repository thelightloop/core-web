import axios from 'axios'

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

let loadingCount = 0

const onLoadingStart = () => {
  loadingCount++
}

const onLoadingEnd = () => {
  loadingCount = Math.max(0, loadingCount - 1)
}

export const getLoadingCount = () => loadingCount

http.interceptors.request.use((config) => {
  onLoadingStart()
  return config
})

http.interceptors.response.use(
  (response) => {
    onLoadingEnd()
    return response
  },
  (error) => {
    onLoadingEnd()
    const message =
      error.response?.data?.message ??
      error.response?.data?.title ??
      error.message ??
      'Something went wrong'
    return Promise.reject(new Error(message))
  }
)