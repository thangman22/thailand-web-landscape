import axios from 'axios';

export default async (url, type) => {
    const { data } = await axios.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?category=performance&category=accessibility&category=best-practices&category=seo&category=pwa&strategy=${type}&url=${url}`)
    return data
}