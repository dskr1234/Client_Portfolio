
import { Router } from 'express'
import { z } from 'zod'
import { sendMail } from '../utils/mailer.js'

const router = Router()
const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(5000)
})

router.post('/', async (req, res) => {
  try {
    const data = schema.parse(req.body)
    const html = `
      <h2>Mail from portfolio contact form</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p>${data.message.replace(/\n/g,'<br/>')}</p>
    `
    await sendMail({
      to: process.env.TO_EMAIL,
      subject: 'Portfolio Contact',
      html
    })
    res.json({ ok: true })
  } catch (err){
    if (err?.issues) return res.status(400).json({ error: err.issues[0].message })
    console.error(err)
    res.status(500).json({ error: 'Unable to send message' })
  }
})

export default router
