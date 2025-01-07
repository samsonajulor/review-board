import { apiClient, getAdminToken, getUserToken } from '../test-utils';

describe('Get Review Integration Tests', () => {
  it('should allow an admin to fetch all reviews', async () => {
    const token = getAdminToken();

    const response = await apiClient.get('/reviews', {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('should allow a non-admin user to fetch all reviews', async () => {
    const token = getUserToken();

    const response = await apiClient.get('/reviews', {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('should fetch a specific review by ID', async () => {
    const token = getAdminToken();
    const reviewId = '12345'; // Replace with a valid ID from your database

    const response = await apiClient.get(`/reviews/${reviewId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(200);
    expect(response.data.id).toBe(reviewId);
  });
});
