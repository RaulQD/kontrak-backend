import { z } from 'zod';

export const revokeSessionsSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});
