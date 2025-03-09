import { title } from 'process';
import { z, ZodType } from 'zod';

export class TripValidation {
  static readonly CREATE: ZodType = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(1000),
    latitude: z.number(),
    longitude: z.number(),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.number().positive(),
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(1000).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  });
}
