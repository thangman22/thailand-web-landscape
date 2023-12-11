import { ThreadWorker } from 'poolifier'
import auditLink from './libs/auditLink.mjs'

export default new ThreadWorker(auditLink)
