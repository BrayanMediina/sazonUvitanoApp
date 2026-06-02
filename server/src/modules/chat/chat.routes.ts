import { Router }      from 'express'
import { requireAuth } from '../../middlewares/auth.middleware.js'
import { prisma }      from '../../config/database.js'

const router = Router()

router.get('/', requireAuth, async (_req, res, next) => {
  try {
    const rows = await prisma.chatMessage.findMany({
      orderBy: { createdAt: 'asc' },
      take: 100,
    })
    const data = rows.map((m) => ({
      id:         m.id,
      senderId:   m.senderId,
      senderName: m.senderName,
      senderRole: m.senderRole,
      content:    m.content,
      timestamp:  m.createdAt.toISOString(),
      read:       true,
    }))
    res.json({ success: true, data })
  } catch (e) { next(e) }
})

export default router
