import axios from 'axios'
import consola from 'consola'
export default async (url) => {
  let result = false
  try {
    await axios.get(`https://${url}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, compress, deflate, br'
      },
      rejectUnauthorized: false,
      timeout: 10000
    })
    result = true
  } catch (error) {
    if (error.response) {
      if (error.response.status === 403) {
        result = true
      } else {
        consola.error(url, error.message)
      }
    } else if (error.message.includes('timeout of')) {
      result = true
    } else {
      consola.error(url, error.message)
    }
  }

  return result
}
