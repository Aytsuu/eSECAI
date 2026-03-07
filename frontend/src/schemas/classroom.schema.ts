import { z } from 'zod';

export const classroomSchema = z.object({
  name: z.string(),
  description: z.string(),
  bannerFile: z.string()
})