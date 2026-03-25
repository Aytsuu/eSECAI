import { z } from 'zod';

export const classroomSchema = z.object({
  name: z.string()
    .min(1, "Class Name is required")
    .min(2, "Must be atleaast 2 characters"),
  description: z.string(),
  bannerFile: z.string()
})