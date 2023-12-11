import csv from 'csvtojson'
import fs from 'fs'
import { FixedThreadPool, availableParallelism } from 'poolifier'

const pool = new FixedThreadPool(availableParallelism(), './analyze-worker.mjs', {
  errorHandler: (e) => console.error(e),
  onlineHandler: () => console.info('worker is online')
})

const urls = await csv().fromFile('./auditUrls.csv')

for (const url of urls) {
  pool.execute(url.Link).then((res) => {
    console.info(url)
    fs.appendFileSync('finalResult.json', JSON.stringify(res))
  })
}
