// This endpoint is handled by better-auth via /api/auth/[...all]
// Requests to /api/auth/reset-password are automatically routed to better-auth
// No custom handler needed - better-auth handles this endpoint natively

export { POST, GET } from '../[...all]/route';
