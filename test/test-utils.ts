import axios from 'axios';

const BASE_URL = process.env.API_URL || 'https://your-api-gateway-url';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAdminToken = () => 'mock-admin-jwt-token';

export const getUserToken = () => 'mock-user-jwt-token';

export const mockEvent = (claims: any) => ({
  requestContext: {
    authorizer: {
      claims,
    },
  },
  body: JSON.stringify({ reviewText: 'Test Review' }),
});
