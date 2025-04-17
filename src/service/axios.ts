import axios from 'axios'
import { setupCache } from 'axios-cache-interceptor'
import axiosRetry from 'axios-retry'

const client = setupCache(axios.create({}), {
  ttl: 1000 * 4
})

axiosRetry(client, {
  retries: 3,
  retryDelay: retryCount => retryCount * 3000,
  retryCondition: () => true
})

export default client
