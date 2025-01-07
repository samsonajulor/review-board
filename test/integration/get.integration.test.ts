import { getUserToken, apiClient } from "../test-utils";

describe('Get Review Integration Tests', () => {
  it('should allow a user to fetch all reviews', async () => {
    const token = getUserToken();

    const response = await apiClient.get('/reviews', {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('should allow a user to fetch a specific review', async () => {
    const token = getUserToken();

    const response = await apiClient.get('/reviews/12345', {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(200);
    expect(response.data.id).toBe('12345');
  });
});
describe('Get Review Integration Tests', () => {
  it('should allow a user to fetch all reviews', async () => {
    const token = getUserToken();

    const response = await apiClient.get('/reviews', {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('should allow a user to fetch a specific review', async () => {
    const token = getUserToken();

    const response = await apiClient.get('/reviews/12345', {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(200);
    expect(response.data.id).toBe('12345');
  });
});
