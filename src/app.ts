import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import DBconnection from './database/connection'
import routes from './routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)

DBconnection()

export default app
