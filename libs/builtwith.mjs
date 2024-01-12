import axios from 'axios'

export default async (url, type) => {
  const { data } = await axios.get(`https://api.builtwith.com/v21/api.json?KEY=012c3d56-5d9c-4700-9535-825a6b39fc38&LOOKUP=${url}`)
  return data
}
