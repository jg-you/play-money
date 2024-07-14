import { z } from 'zod'
import { ServerErrorSchema, createSchema } from '@play-money/api-helpers'
import { UserSchema } from '@play-money/database'

export default createSchema({
  GET: {
    parameters: UserSchema.pick({ id: true }),
    responses: {
      200: z.object({
        netWorth: z.number(),
        tradingVolume: z.number(),
        totalMarkets: z.number(),
        lastTradeAt: z.date().optional(),
      }),
      404: ServerErrorSchema,
      500: ServerErrorSchema,
    },
  },
})
