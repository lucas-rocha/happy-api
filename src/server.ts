import express from 'express'
import DBconnection from './database/connection'
import routes from './routes'

const app = express()

app.use(express.json())
app.use(routes)

DBconnection()
app.listen(3333)

export default app
