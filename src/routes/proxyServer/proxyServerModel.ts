import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type ProxyServerResponse = z.infer<typeof ProxyServerResponseSchema>;

export const ProxyServerResponseSchema = z.object({
  success: z.boolean(),
  status: z.number(),
  data: z.any(),
});

export type ProxyServerRequestBody = z.infer<typeof ProxyServerRequestBodySchema>;

export const ProxyServerRequestBodySchema = z.object({
  targetUrl: z.string().url('Invalid URL'),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
  headers: z.record(z.string(), z.string()).optional(),
  body: z.any().optional(),
});
