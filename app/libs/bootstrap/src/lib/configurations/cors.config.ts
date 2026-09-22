export const corsConfig = {
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Cookie',
    'X-Requested-With',
    'Accept',
  ],
  exposedHeaders: [
    'Authorization',
    'Set-Cookie',
    'Access-Control-Allow-Credentials',
  ],
  maxAge: 86400,
};