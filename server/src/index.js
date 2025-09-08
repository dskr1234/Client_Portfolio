
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import contactRouter from './routes/contact.js'

const app = express()
app.use(express.json())
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*'}))

app.get('/health', (_req, res) => res.json({ ok: true }))
app.use('/api/contact', contactRouter)

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`[server] listening on http://localhost:${port}`))
