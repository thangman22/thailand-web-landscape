import { csv2json } from 'json-2-csv'
import axios from 'axios'
import fs from 'fs'

const urlsList = await csv2json(fs.readFileSync('./auditUrls.csv', 'utf8'), {
  delimiter: {
    eol: '\n'
  },
  excelBOM: true
})

for (const url of urlsList) {
  console.log(url)
  await axios.post('https://asia-southeast1-thailand-web-landscape-gcp.cloudfunctions.net/runAnalyze', { requestDomain: url })
}
