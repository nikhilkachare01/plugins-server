import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';

import { ProxyServerRequestBodySchema, ProxyServerResponseSchema } from './proxyServerModel';
import { createApiRequestBody } from '@/api-docs/openAPIRequestBuilders';
import got from 'got';

export const proxyServerRegistry = new OpenAPIRegistry();
proxyServerRegistry.register('ProxyServer', ProxyServerResponseSchema);

proxyServerRegistry.registerPath({
  method: 'post',
  path: '/proxy-server',
  tags: ['Proxy Server for CORS'],
  request: {
    body: createApiRequestBody(ProxyServerRequestBodySchema, 'application/json'),
  },
  responses: createApiResponse(ProxyServerResponseSchema, 'Success'),
});

export const proxyServerRouter: Router = (() => {
  const router = express.Router();

  router.post('/', async (_req: Request, res: Response) => {
    const { targetUrl, method, headers, body } = _req.body;
    try {
      const options: any = {
        method,
        headers,
        json: body,
        responseType: 'json',
      };
      const response = await got(targetUrl, options);

      const validatedResponse = ProxyServerResponseSchema.parse({
        success: true,
        status: response.statusCode,
        data: response.body,
      });

      res.status(response.statusCode).json(validatedResponse);
    } catch (error: any) {
      res.status(error.response?.statusCode || 500).json({
        success: false,
        error: error.response?.body || error.message,
      });
    }
  });
  return router;
})();
